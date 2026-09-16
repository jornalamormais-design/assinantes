const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzAmi4CxrSFnHg4A04QRK1Qz6hlHum3eVO8SdBm5bVJG2fddciDqmeVkDYV-ioepKaO/exec";

app.use(express.json());
app.use(express.static("public"));

app.get("/api/subscribers", async (req, res) => {
  try {
    const response = await fetch(SCRIPT_URL);

    if (!response.ok) {
      throw new Error(`Apps Script respondeu ${response.status}`);
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.post("/api/subscribers", async (req, res) => {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`Apps Script respondeu ${response.status}`);
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(require("path").join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});