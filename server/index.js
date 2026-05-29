const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/toggle-rule", async (req, res) => {
  const { accessToken, instanceUrl, ruleId, active } = req.body;

  try {
    await axios.patch(
      `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${ruleId}`,
      {
        Metadata: {
          active: active,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to toggle validation rule",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});