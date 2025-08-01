import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mqtt, { Client } from "mqtt";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});
//username : hivemq.webclient.1753956973528
//paswerd : Gd41aCBcxW,0eA>%2#bM


let busLocations =[];

const options = {
  host: "d8b8feafe64d4ad98a28e2310525d196.s1.eu.hivemq.cloud:8884/mqtt",
  port: 8884,
  protocol: "mqtts",
  clean : true,
  reconnectperiod: 1000,
  connectTimeout: 30 * 1000,
  username: "hivemq.webclient.1753984224763",
  password: "RLmn1$75,zN2M.w>OWfe",
};
const mqttClient = mqtt.connect(options); // Or your broker URL

  mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("owntracks/+/+"); // Subscribe to all OwnTracks topics
});


mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    if (data._type === "location") {
      busLocations.push(data);
       console.log("Received via MQTT:", data);
    }
  } catch (err) {
    console.error("Invalid MQTT message:", err);
  }
});
io.on("connection", (socket) => {
  console.log("Client connected once");
});
/*app.post("/location", (req, res) => {
  const data = req.body;
  //busLocations[data.tid || data._id] = data;
busLocations.push(data);
  //console.log(busLocations);
 
  res.json({ status: "ok" });
});*/
setInterval(() => {if(busLocations.length > 0)
  {io.emit("data", busLocations);
  //console.log("Emitting bus locations:", busLocations);
  busLocations=[];}
}, 3000); // Emit data every second

httpServer.listen(3000,'0.0.0.0', () => {
  console.log("listening on *:3000");
});
/*import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mqtt from "mqtt";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

let busLocations = [];

// MQTT SETUP
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com"); // Or your broker URL

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("owntracks/+/+"); // Subscribe to all OwnTracks topics
});

mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    if (data._type === "location") {
      busLocations.push(data);
      // console.log("Received via MQTT:", data);
    }
  } catch (err) {
    console.error("Invalid MQTT message:", err);
  }
});

// SOCKET.IO: Send to frontend every 3s
setInterval(() => {
  if (busLocations.length > 0) {
    io.emit("data", busLocations);
    console.log("Emitting bus locations:", busLocations);
    busLocations = [];
  }
}, 3000);

// Socket connection log
io.on("connection", (socket) => {
  console.log("Client connected via Socket.io");
});

// Start server
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("listening on *:3000");
}); */