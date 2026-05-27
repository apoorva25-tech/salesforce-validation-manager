import { useEffect } from "react";

function Callback() {
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));

    const token = params.get("access_token");
    const instanceUrl = params.get("instance_url");

    if (token) {
      localStorage.setItem("sf_access_token", token);
      localStorage.setItem("sf_instance_url", instanceUrl);
      window.location.href = "/";
    }
  }, []);

  return <h2>Logging in...</h2>;
}

export default Callback;