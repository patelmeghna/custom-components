import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import L from "leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
});

const MapIndex = () => {
  const featureGroupRef = useRef(null);

  const onCreated = (e) => {
    // Access the featureGroupRef and get the leafletElement
    const drawnShape = e.layer;
    let latlngs;

    if (
      drawnShape instanceof L.Marker ||
      drawnShape instanceof L.CircleMarker
    ) {
      // For markers, get the latitude and longitude directly
      const { lat, lng } = drawnShape.getLatLng();
      latlngs = { lat, lng };
    } else if (drawnShape instanceof L.Circle) {
      // For circles, get the center and the radius
      const center = drawnShape.getLatLng();
      const radius = drawnShape.getRadius();
      latlngs = { center, radius };
    } else {
      // For other shapes (rectangle, polyline, polygon), get the coordinates
      latlngs = drawnShape.getLatLngs();
    }

    // You can handle the latlngs data as per your requirements
    console.log(latlngs);
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "500px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={onCreated} // Add the onCreated callback here
          draw={{
            circle: true,
            rectangle: true,
            polyline: true,
            polygon: true,
            marker: true,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapIndex;
