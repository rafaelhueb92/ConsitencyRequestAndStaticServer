require("dotenv/config");

const express = require("express");
const path = require("path");
const fs = require("fs");

const { PORT } = process.env;

const app = express();

app.use("/", express.static(path.resolve(__dirname, "public")));

app.get("/", (_, res) => {
  const index = path.resolve(__dirname, "public", "index.html");

  return res.sendFile(index);
});

app.get("/rededHtml", (_, res) => {
  const indexPath = path.resolve(__dirname, "public", "index.html");
  const index = fs.readFileSync(indexPath, "utf8");
  return res.send(index);
});

app.get("/html", (_, res) => {
  return res.send("<h1>Html Route </h1>");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
