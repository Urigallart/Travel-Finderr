const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let favorites = [];

app.get("/", (req, res) => {
  res.send("Favorites service running");
});

app.get("/favorites", (req, res) => {
  res.json(favorites);
});

app.post("/favorites", (req, res) => {
  const { name, capital } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Country name is required" });
  }

  const exists = favorites.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) {
    return res.status(409).json({ error: "Country already in favorites" });
  }

  const newFavorite = { name, capital };
  favorites.push(newFavorite);

  res.status(201).json(newFavorite);
});

app.delete("/favorites/:name", (req, res) => {
  const countryName = req.params.name.toLowerCase();
  const initialLength = favorites.length;

  favorites = favorites.filter(
    (item) => item.name.toLowerCase() !== countryName
  );

  if (favorites.length === initialLength) {
    return res.status(404).json({ error: "Country not found" });
  }

  res.json({ message: "Favorite deleted" });
});

app.listen(PORT, () => {
  console.log(`Favorites service running on port ${PORT}`);
});