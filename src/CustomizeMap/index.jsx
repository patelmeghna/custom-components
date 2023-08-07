import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  Circle,
  useMapEvents,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./index.css";

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

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000);
    return `${timestamp}-${randomNumber}`;
  };

  /* handle edit start */

  const handleEdit = () => {
    // add unique id for every shape for delete function

    const remainingLayers = featureGroupRef.current?.getLayers();

    if (remainingLayers) {
      // Array to store the shape information with unique IDs
      const remainingShapesInfo = [];

      // Iterate through the layers and store the shape info
      remainingLayers.forEach((layer) => {
        let shapeType;
        let shapeInfo;

        if (layer instanceof L.Marker) {
          shapeType = "marker";
          const { lat, lng } = layer.getLatLng();
          shapeInfo = { id: generateUniqueId(), type: shapeType, lat, lng };
        } else if (layer instanceof L.CircleMarker) {
          shapeType = "circleMarker";
          const { lat, lng } = layer.getLatLng();
          const radius = layer.getRadius();
          shapeInfo = {
            id: generateUniqueId(),
            type: shapeType,
            lat,
            lng,
            radius,
          };
        } else if (layer instanceof L.Circle) {
          shapeType = "circle";
          const { lat, lng } = layer.getLatLng();
          const radius = layer.getRadius();
          shapeInfo = {
            id: generateUniqueId(),
            type: shapeType,
            lat,
            lng,
            radius,
          };
        } else if (layer instanceof L.Polygon) {
          shapeType = "polygon";
          const latlngs = layer
            .getLatLngs()[0]
            .map((point) => [point.lat, point.lng]);
          shapeInfo = { id: generateUniqueId(), type: shapeType, latlngs };
        } else if (layer instanceof L.Polyline) {
          shapeType = "polyline";
          const latlngs = layer
            .getLatLngs()
            .map((point) => [point.lat, point.lng]);
          shapeInfo = { id: generateUniqueId(), type: shapeType, latlngs };
        }

        const linkUrl = "https://google.com"; // Replace this with the link URL for the specific shape
        if (shapeType && shapeInfo) {
          // Add the link information to the shapeInfo object
          shapeInfo.linkUrl = linkUrl;

          remainingShapesInfo.push(shapeInfo);
        }

        if (layer) {
          layer.on("click", () => {
            // Open the link URL when the shape is clicked
            window.open(linkUrl, "_blank");
          });
        }
      });

      localStorage.setItem("drawnShapes", JSON.stringify(remainingShapesInfo));
    }
  };

  /* handle edit ends*/

  const recreateShapesOnMap = (shapes) => {
    const featureGroup = featureGroupRef.current;
    // const map = L.map('map').setView([51.505, -0.09], 13);
    if (featureGroup) {
      console.log(featureGroup);
      featureGroup.clearLayers();
      shapes.forEach((shape) => {
        let layer;

        if (shape.type === "marker") {
          const { lat, lng } = shape;
          layer = L.marker([lat, lng]);
        } else if (shape.type === "circleMarker") {
          const { lat, lng, radius } = shape;
          const centerLatLng = [lat, lng];

          if (radius === 10) {
            layer = L.circleMarker(centerLatLng, { radius });
          } else {
            layer = L.circle(centerLatLng, { radius });
          }
        } else if (shape.type === "circle") {
          const { lat, lng, radius } = shape;
          layer = L.circle([lat, lng], { radius });
        } else if (shape.type === "polygon") {
          const { latlngs } = shape;
          layer = L.polygon(latlngs);
        } else if (shape.type === "polyline") {
          const { latlngs } = shape;
          layer = L.polyline(latlngs);
        }

        if (layer) {
          const linkUrl = shape.linkUrl;

          layer.addTo(featureGroup);

          layer.on("click", () => {
            // Open the link URL when the shape is clicked
            window.open(linkUrl, "_blank");
          });
        }
      });
    }
  };

  const handleShapeEdit = (e) => {
    const editedShape = storedShapes.find(
      (shape) => shape.id === e.layer._leaflet_id
    );
  };

  useEffect(() => {
    const storedShapesFromStorage =
      JSON.parse(localStorage.getItem("drawnShapes")) || [];

    setStoredShapes(storedShapesFromStorage);

    const featureGroup = featureGroupRef.current;
    if (featureGroup) {
      featureGroup.on("edit", handleShapeEdit);
    }

    return () => {
      if (featureGroup) {
        featureGroup.off("edit", handleShapeEdit);
      }
    };
  }, []);

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
          onCreated={handleEdit}
          onDeleteStop={handleEdit}
          onEditStop={handleEdit}
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
