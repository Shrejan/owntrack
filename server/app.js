// server.js
/*import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/esp", (req, res) => {
  console.log("Message from ESP32:", req.body.msg);
  if (req.body.msg === "hiii") {
    res.json({ reply: "led2" });
  } else {
    res.json({ reply: "unknown" });
  }
});
app.listen(3000,'0.0.0.0', () => {
  console.log("Server running on http://192.168.1.12:3000");
});*/

import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
let busLocations = {}; // Store latest locations

app.post('/location', (req, res) => {
  const data = req.body;
  // Use a unique key, e.g., tid or _id
  busLocations[data.tid || data._id] = data;
  console.log(busLocations);
  res.send("ok");
});


app.get('/locations', (req, res) => {
  res.json(busLocations);
  console.log("🚍 Current bus locations:", busLocations) ;
});
//console.log(busLocations);

app.listen(PORT,'0.0.0.0',() => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
