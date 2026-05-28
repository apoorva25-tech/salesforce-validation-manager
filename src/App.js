import { BrowserRouter, Routes, Route } from "react-router-dom";
import Callback from "./Callback";
import { useState } from "react";

function Home() {
  const token = localStorage.getItem("sf_access_token");
  const instanceUrl = localStorage.getItem("sf_instance_url");

  const [rules, setRules] = useState([]);

  const loginToSalesforce = () => {
    const CLIENT_ID =
      "3MVG9GBhY6wQjl2vDb8Q4bY3wswb4beHLwYAxUDaxBsNf2yK26FH.f6b1QU7RNKP72r1ct537VfTz5QJpzy0x";

    const REDIRECT_URI = "https://salesforce-validation-manager-gamma.vercel.app/callback";

    const authUrl =
      `https://login.salesforce.com/services/oauth2/authorize` +
      `?response_type=token` +
      `&client_id=${CLIENT_ID}` +
      `&redirect_uri=${REDIRECT_URI}`;

    window.location.href = authUrl;
  };

  const getValidationRules = async () => {
    try {
      const response = await fetch("http://https://salesforce-validation-manager-sixr.onrender.com/validation-rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: token,
          instanceUrl: instanceUrl,
        }),
      });


      const data = await response.json();
       if (Array.isArray(data)) {
        setRules(data);
    }         else {
        console.log("Backend error:", data);
       alert(data.error || "Failed to fetch validation rules");
       setRules([]);
    }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch validation rules");
    }
  };

  const toggleRule = async (rule) => {
  try {
    await fetch("http://https://salesforce-validation-manager-sixr.onrender.com/toggle-rule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: token,
        instanceUrl: instanceUrl,
        ruleId: rule.Id,
        active: !rule.Active,
      }),
    });

    getValidationRules();
  } catch (error) {
    console.log(error);
    alert("Failed to toggle validation rule");
  }
};

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Salesforce Validation Manager</h1>

      {token ? (
        <>
          <p style={{ color: "green" }}>Logged in successfully ✅</p>

         <button
            onClick={getValidationRules}
           style={{
           padding: "10px 20px",
           backgroundColor: "#0176d3",
           color: "white",
           border: "none",
           borderRadius: "6px",
           cursor: "pointer",
           fontSize: "16px",
           marginTop: "10px",
          marginRight: "10px",
           
         }}
          >
           Get Validation Rules
          </button>
          <button
         onClick={() => {
         localStorage.clear();
         window.location.reload();
        }}
         >
          Reset Login
          </button>

          <div style={{ marginTop: "30px" }}>
            {rules.map((rule) => (
              <div
                key={rule.Id}
               style={{
                 border: "1px solid #ddd",
                 padding: "20px",
                 margin: "15px auto",
                 width: "60%",
                 borderRadius: "10px",
                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                 backgroundColor: "#fff",
              }}
              >
                <h3>{rule.ValidationName}</h3>
                <p>Status: {rule.Active ? "Active ✅" : "Inactive ❌"}</p>
                <button
                   onClick={() => toggleRule(rule)}
                  style={{
                  padding: "8px 16px",
                  backgroundColor: rule.Active ? "#d9534f" : "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
                >
                {rule.Active ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <button onClick={loginToSalesforce}>Login With Salesforce</button>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;