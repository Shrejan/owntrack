
import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

let busLocations = {}; // Store latest locations
io.on("connection", (socket) => {
  console.log("Client connected once");
  // Only emit on new data, not on every connection
});
app.post('/location', (req, res) => {
  const data = req.body;
  // Use a unique key, e.g., tid or _id
  busLocations[data.tid || data._id] = data;
  // Emit to all clients only when new data is received
  console.log(busLocations);
  io.emit("data", busLocations);
  res.send("ok");
});

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
