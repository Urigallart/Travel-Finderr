const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

let visited = [];

app.get("/", (req, res) => {
  res.send("Visited service running");
});

app.get("/visited", (req, res) => {
  res.json(visited);
});

app.post("/visited", (req, res) => {
  const { name, year } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Country name is required" });
  }

  const newVisited = { name, year };
  visited.push(newVisited);

  res.status(201).json(newVisited);
});

app.delete("/visited/:name", (req, res) => {
  const countryName = req.params.name.toLowerCase();
  const initialLength = visited.length;

  visited = visited.filter(
    (item) => item.name.toLowerCase() !== countryName
  );

  if (visited.length === initialLength) {
    return res.status(404).json({ error: "Country not found" });
  }

  res.json({ message: "Visited country deleted" });
});

app.listen(PORT, () => {
  console.log(`Visited service running on port ${PORT}`);
});