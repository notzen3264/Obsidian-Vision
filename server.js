const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 8000;

// Replace with your actual YouTube Data API key
const API_KEY = "AIzaSyBd1kAA_55cWHXlLzE1RtDB-6xcPcPsIuA";
//AIzaSyDOpsDUJxMfg24fz8mARnpypoB_-FGWsho
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serves static files from /public

// Serve index.html explicitly at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Proxy API search request to YouTube
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: {
        Referer: "https://obsidian-video-search.netlify.app",
        "User-Agent": "ObsidianVision/1.0"
      }
    });

    const data = await response.json();

    if (data.items) {
      res.json(data.items);
    } else {
      console.error("No items in YouTube response:", data);
      res.status(500).json({ error: "No video items returned" });
    }
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Backend search failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🧠 Obsidian Vision backend running at http://localhost:${PORT}`);
});
