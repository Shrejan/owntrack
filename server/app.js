import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mqtt from "mqtt";
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
const options = {
  clientId: "shrejan",
  username: "hivemq.webclient.1753984224763",
  password: "RLmn1$75,zN2M.w>OWfe",
  clean: true,
  reconnectperiod: 1000,
  connectTimeout: 30 * 1000,
};
const mqttClient = mqtt.connect("wss://d8b8feafe64d4ad98a28e2310525d196.s1.eu.hivemq.cloud:8884/mqtt", options);
io.on("connection", (socket) => {
 
  mqttClient.subscribe("owntracks/+/+", (e) => {
     console.log("Subscribed to owntracks/+/+");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
   mqttClient.unsubscribe("owntracks/+/+", (err) => {
       console.log("Unsubscribed from owntracks/+/+");
    });
  });
});
io.on("error", (error) => {
  console.error("Socket.IO error:", error);
});
let busLocations = {};
const data = {};

mqttClient.on("message", (topic, message) => {
  try {
    const datas = JSON.parse(message.toString());

    if (topic) {
      
      data[topic] = {
        ssid: datas.SSID,
        topic: topic,
        lat: datas.lat,
        lon: datas.lon,
        battery: datas.batt,
        accuracy: datas.acc,
        timestamp: datas.tst,
      };

      busLocations[topic] = data[topic];
    } else {
      console.warn("Invalid message: Missing SSID", datas);
    }
  } catch (err) {
    console.error("Invalid MQTT message:", err);
  }
});

setInterval(() => {
  const allClientData = Object.values(busLocations);

  if (allClientData.length > 0) {
    io.emit("data", allClientData);
   // console.log("Emitting data to clients:", allClientData  );
  }
}, 1000);

httpServer.listen(3000, "0.0.0.0", () => {
  console.log("listening on *:3000");
});
