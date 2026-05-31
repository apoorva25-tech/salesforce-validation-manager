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
    const describeResponse = await axios.get(
  `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/describe`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
);

console.log(
  "VALIDATION RULE FIELDS:",
  describeResponse.data.fields.map((f) => f.name)
);
    const response = await axios.get(
      `${instanceUrl}/services/data/v59.0/tooling/query/?q=SELECT+Id,ValidationName,Metadata+FROM+ValidationRule+LIMIT+1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data.records);
   console.log(JSON.stringify(response.data, null, 2));
    res.json(response.data.records);
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch validation rules",
      details: error.response?.data || error.message,
    });
  }
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
    console.log("TOGGLE ERROR:", error.response?.data || error.message);
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