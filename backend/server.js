require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "../build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});


app.get("/api/recalls", async (req, res) => {
  try {
    const { classification, search, distribution, location, page = 1 } = req.query;
    const API_KEY = "6HJwEolb7Ze8Rcltjy4l1S7t59OrfqU3NrZHPf5r";
    const LIMIT = 10;
    const skip = (page - 1) * LIMIT;

    const classificationFilter = classification ? `+AND+classification:"${classification}"` : "";
    const searchFilter = search ? `+AND+product_description:"${search}"` : "";
    const distributionFilter = distribution ? `+AND+distribution_pattern:"${distribution}"` : "";
    const locationFilter = location ? `+AND+(city:"${location}" OR state:"${location}")` : "";

    const response = await axios.get(
      `https://api.fda.gov/food/enforcement.json?api_key=${API_KEY}&search=distribution_pattern:"nationwide"${classificationFilter}${searchFilter}${distributionFilter}${locationFilter}&limit=${LIMIT}&skip=${skip}`
    );

    res.json(response.data.results || []);
  } catch (error) {
    console.error("Error fetching recalls:", error);
    res.status(500).json({ error: "Failed to fetch recall data" });
  }
});


app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const aiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ reply: aiResponse.data.choices[0].message.content });
  } catch (error) {
    console.error("Error with AI response:", error);
    res.status(500).json({ error: "AI service unavailable" });
  }
});


app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
