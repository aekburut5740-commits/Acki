const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function readPosts() {
  return JSON.parse(fs.readFileSync("posts.json", "utf-8"));
}

function savePosts(posts) {
  fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));
}

app.get("/", (req, res) => {
  res.send("Acki Backend is running");
});

app.get("/posts", (req, res) => {
  res.json(readPosts());
});

app.post("/posts", (req, res) => {
  const posts = readPosts();

  const newPost = {
    id: Date.now(),
    username: req.body.username || "Visitor",
    content: req.body.content || "",
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
    saves: 0,
    shares: 0
  };

  posts.unshift(newPost);
  savePosts(posts);

  res.status(201).json(newPost);
});

app.patch("/posts/:id/like", (req, res) => {
  const posts = readPosts();
  const postId = Number(req.params.id);

  const post = posts.find((p) => Number(p.id) === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  post.likes = Number(post.likes || 0) + Number(req.body.change || 0);

  if (post.likes < 0) post.likes = 0;

  savePosts(posts);

  res.json(post);
});

app.patch("/posts/:id/save", (req, res) => {
  const posts = readPosts();
  const postId = Number(req.params.id);

  const post = posts.find((p) => Number(p.id) === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  post.saves = Number(post.saves || 0) + Number(req.body.change || 0);

  if (post.saves < 0) post.saves = 0;

  savePosts(posts);

  res.json(post);
});

app.patch("/posts/:id/share", (req, res) => {
  const posts = readPosts();
  const postId = Number(req.params.id);

  const post = posts.find((p) => Number(p.id) === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  post.shares = Number(post.shares || 0) + 1;

  savePosts(posts);
  res.json(post);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Acki backend running on port ${PORT}`);
});

app.post("/posts/:id/comments", (req, res) => {
  const posts = readPosts();
  const postId = Number(req.params.id);

  const post = posts.find((p) => Number(p.id) === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const newComment = {
    id: Date.now(),
    user: req.body.user || "Visitor",
    text: req.body.text || "",
    createdAt: new Date().toISOString()
  };

  if (!post.comments) post.comments = [];

  post.comments.push(newComment);
  savePosts(posts);

  res.status(201).json(newComment);
});