import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { log } from "console";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});
let busLocations =[];
io.on("connection", (socket) => {
  console.log("Client connected once");
});
app.post("/location", (req, res) => {
  const data = req.body;
  //busLocations[data.tid || data._id] = data;
busLocations.push(data);
  //console.log(busLocations);
 
  res.json({ status: "ok" });
});
setInterval(() => {if(busLocations.length > 0)
  {io.emit("data", busLocations);
  console.log("Emitting bus locations:", busLocations);
  busLocations=[];}
}, 3000); // Emit data every second

httpServer.listen(3000,'0.0.0.0', () => {
  console.log("listening on *:3000");
});
