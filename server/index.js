const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/validation-rules", async (req, res) => {
  const { accessToken, instanceUrl } = req.body;

  try {
    const response = await axios.get(
      `${instanceUrl}/services/data/v59.0/tooling/query/?q=SELECT+Id,ValidationName,Active+FROM+ValidationRule`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json(response.data.records);
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch validation rules",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});