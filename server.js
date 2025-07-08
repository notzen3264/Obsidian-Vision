const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const PORT = 8000;

// Replace with your own API key!
const API_KEY = "AIzaSyDOpsDUJxMfg24fz8mARnpypoB_-FGWsho";

app.use(cors());
app.use(express.static("public")); // Serves index.html from /public
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.items) {
      res.json(data.items);
    } else {
      res.status(500).json({ error: "No items returned" });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Obsidian Vision server running at http://localhost:${PORT}`);
});
