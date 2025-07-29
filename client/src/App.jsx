import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";
import { icon, marker } from "leaflet";
import React, { useState, useEffect } from "react";
import axios from "axios";
//import { io } from "socket.io-client";
function App() {
  const [lat, setlat] = useState(null);
  const [long, setlong] = useState(null);

 // const socket = io("http://localhost:3000"); // 🔁 Update if using a deployed server

  const [busData, setBusData] = useState([]);

  /*useEffect(() => {
    socket.on("bus_data", (data) => {

      setBusData(data);
    });

    return () => {
      socket.off("bus_data");
    };
  }, []);
*/
useEffect(() => {
  axios.get("http://localhost:3000/locations")
    .then((response) => {
      // If response.data.nf is an object, wrap it in an array
      const data = response.data.nf
        ? Array.isArray(response.data.nf)
          ? response.data.nf
          : [response.data.nf]
        : [];
      setBusData(data);
    })
    .catch((error) => {
      console.error("Error fetching bus data:", error);
    });
}, []);
//console.log('the data is',busData);

const Markers = busData.map((bus, index) => ({
  geocode: [ bus.lat,bus.lon],
  popUp: `TID: ${bus.tid}, Battery: ${bus.batt}%, Time: ${bus.created_at}`,
}));
//console.log(busData);

  const sarala_icon = new icon({
    iconUrl: "./sarala_icon.png",
    iconSize: [50, 50],
  });


  // console.log(lat, long);

  return (
    <>
      <MapContainer center={[12.990531074169104, 75.28186271998001]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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