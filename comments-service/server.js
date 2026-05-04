const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

let comments = [];
let currentId = 1;

app.get("/", (req, res) => {
  res.send("Comments service running");
});

app.get("/comments", (req, res) => {
  res.json(comments);
});

app.get("/comments/:country", (req, res) => {
  const country = req.params.country.toLowerCase();

  const filtered = comments.filter(
    (comment) => comment.country.toLowerCase() === country
  );

  res.json(filtered);
});

app.post("/comments", (req, res) => {
  const { country, text } = req.body;

  if (!country || !text) {
    return res.status(400).json({ error: "Country and text are required" });
  }

  const newComment = {
    id: currentId++,
    country,
    text
  };

  comments.push(newComment);

  res.status(201).json(newComment);
});

app.delete("/comments/:id", (req, res) => {
  const id = Number(req.params.id);
  const initialLength = comments.length;

  comments = comments.filter((comment) => comment.id !== id);

  if (comments.length === initialLength) {
    return res.status(404).json({ error: "Comment not found" });
  }

  res.json({ message: "Comment deleted" });
});
app.get("/prova-actions", (req, res) => {
  res.send("GitHub Actions funciona correctament");
});
app.listen(PORT, () => {
  console.log(`Comments service running on port ${PORT}`);
});