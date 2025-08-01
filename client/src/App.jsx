import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";
import { icon, marker } from "leaflet";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
function App() {
  const [lat, setlat] = useState(null);
  const [socket, setcocket] = useState();
  const [busData, setBusData] = useState([]);

  useEffect(() => {

    const sockets = io("https://owntrack-backend.onrender.com"); // Use your server URL here

 //   const sockets = io("https://owntrack-backend.onrender.com");

    setcocket(sockets);
    return () => {
      sockets.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("data", (data) => {
     // console.log("Received data:", data);
      const arr = Object.values(data);
      setBusData(arr);
    });
    return () => {
      socket.off("data");
    };
  }, [socket]);

  const Markers = busData.map((bus, index) => ({
    geocode: [bus.lat, bus.lon],
    popUp: `acc: ${bus.accuracy}, Battery: ${bus.battery}%, Time: ${bus.timestamp}, SSID: ${bus.ssid}`,
  }));
  //console.log(busData);

  const sarala_icon = new icon({
    iconUrl: "/sarala_icon.png",
    iconSize: [50, 50],
  });

  // console.log(lat, long);

  return (
    <>
      <MapContainer center={[12.990531074169104, 75.28186271998001]} zoom={13}>
         <TileLayer
    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    attribution="&copy; Esri, Maxar, Earthstar Geographics"
    maxZoom={18}
  />
        {Markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={sarala_icon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

export default App;
