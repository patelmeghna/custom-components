import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup, useMap } from "react-leaflet";
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
  const featureGroupRef = useRef();
  const [storedShapes, setStoredShapes] = useState([]);

  const onCreated = (e) => {
    const drawnShape = e.layer;
    let shapeObject;

    if (drawnShape instanceof L.Marker) {
      const { lat, lng } = drawnShape.getLatLng();
      shapeObject = { type: "marker", lat, lng };
    } else if (drawnShape instanceof L.CircleMarker) {
      const { lat, lng } = drawnShape.getLatLng();
      const radius =
        drawnShape.getRadius() > 10
          ? drawnShape.getRadius() / 10
          : drawnShape.getRadius();
      shapeObject = { type: "circleMarker", lat, lng, radius };
    } else if (drawnShape instanceof L.Circle) {
      const { lat, lng } = drawnShape.getLatLng();
      const radius = drawnShape.getRadius() / 1000;
      shapeObject = { type: "circle", lat, lng, radius };
    } else if (drawnShape instanceof L.Polygon) {
      // For Polygon
      const latlngs = drawnShape.getLatLngs()[0]; // Extract the outer ring (main polygon)
      const firstPoint = latlngs[0];
      const lastPoint = latlngs[latlngs.length - 1];
      const isClosed = firstPoint.equals(lastPoint);

      if (!isClosed) {
        // If not closed, add the first point's lat/lng values at the end to close the polygon
        latlngs.push(firstPoint);
        drawnShape.setLatLngs([latlngs]); // Wrap in an array to maintain polygon format
      }

      shapeObject = { type: "polygon", latlngs };
    } else if (drawnShape instanceof L.Polyline) {
      // For Polyline
      shapeObject = { type: "polyline", latlngs: drawnShape.getLatLngs() };
    }

    // Retrieve existing shapes from local storage or initialize an empty array
    const existingShapes =
      JSON.parse(localStorage.getItem("drawnShapes")) || [];

    // Add the new shape object to the existingShapes array
    existingShapes.push(shapeObject);

    // Save the updated shapes to local storage
    localStorage.setItem("drawnShapes", JSON.stringify(existingShapes));
  };

  const recreateShapesOnMap = (shapes) => {
    const featureGroup = featureGroupRef.current;
    if (featureGroup) {
      featureGroup.clearLayers();
      shapes.forEach((shape) => {
        // Add the shape to the map based on its type
        if (shape.type === "marker") {
          const { lat, lng } = shape;
          L.marker([lat, lng]).addTo(featureGroup);
        } else if (shape.type === "circleMarker") {
          const { lat, lng, radius } = shape;
          L.circleMarker([lat, lng], { radius }).addTo(featureGroup);
        } else if (shape.type === "circle") {
          const { lat, lng, radius } = shape;
          L.circle([lat, lng], { radius }).addTo(featureGroup);
        } else if (shape.type === "polygon") {
          const { latlngs } = shape;
          L.polygon(latlngs).addTo(featureGroup);
        } else if (shape.type === "polyline") {
          const { latlngs } = shape;
          L.polyline(latlngs).addTo(featureGroup);
        }
      });
    }
  };

  useEffect(() => {
    // Retrieve the stored shapes from local storage
    const storedShapesFromStorage =
      JSON.parse(localStorage.getItem("drawnShapes")) || [];

    // Set the stored shapes to trigger the recreation on render
    setStoredShapes(storedShapesFromStorage);
  }, []);

  // Recreate shapes when storedShapes change
  useEffect(() => {
    if (storedShapes.length > 0) {
      recreateShapesOnMap(storedShapes);
    }
  }, [storedShapes]);

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
          onCreated={onCreated}
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
