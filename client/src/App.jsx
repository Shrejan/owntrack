import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";
import { icon, marker } from "leaflet";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";


       const SOCKET_SERVER_URL = "https://owntrack-backend.onrender.com";
    //const SOCKET_SERVER_URL = 'http://localhost:3000';

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [busData, setBusData] = useState([]);

  // Establish Socket.IO connection on mount
  useEffect(() => {
    const socketIo = io(SOCKET_SERVER_URL, { transports: ['websocket'] });
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  // Handle connect/disconnect status
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  // Listen for "data" events and update busData
  useEffect(() => {
    if (!socket) return;

    socket.on('data', (data) => {
      //console.log('Received data:', data);
      const arr = Object.values(data);
      setBusData(arr);
    });

    return () => socket.off('data');
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
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.2}
          attribution="&copy; OpenStreetMap contributors"
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
