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
  const [changeShape, setChangeShape] = useState(false);

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000);
    return `${timestamp}-${randomNumber}`;
  };

  // handle create
  const onCreated = (e) => {
    const drawnShape = e.layer;
    let shapeObject;

    const shapeId = generateUniqueId();

    if (drawnShape instanceof L.Marker) {
      const { lat, lng } = drawnShape.getLatLng();
      shapeObject = { type: "marker", lat, lng };
    } else if (drawnShape instanceof L.CircleMarker) {
      const { lat, lng } = drawnShape.getLatLng();
      const radius = drawnShape.getRadius();
      if (radius === 10) {
        shapeObject = { type: "circleMarker", lat, lng, radius };
      } else {
        shapeObject = { type: "circle", lat, lng, radius };
      }
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
      console.log("latlng", drawnShape.getLatLngs());
    }
    const id = Object.keys(drawnShape._renderer._layers);

    shapeObject.id = id[id.length - 1];
    shapeObject.linkUrl = "https://google.com";

    // Retrieve existing shapes from local storage or initialize an empty array
    const existingShapes =
      JSON.parse(localStorage.getItem("drawnShapes")) || [];

    // Add the new shape object to the existingShapes array
    existingShapes.push(shapeObject);

    // Save the updated shapes to local storage
    localStorage.setItem("drawnShapes", JSON.stringify(existingShapes));
    setStoredShapes(existingShapes);
  };
  // handle create

  /* handle edit start */
  let leafletIds;
  let leafletInfo;
  const handleEdited = (shape) => {
    leafletIds = Object.keys(shape.layers._layers);
    leafletInfo = shape.layers._layers;
    console.log("info array", leafletIds);
  };

  const handleChangeStart = () => {
    setStoredShapes(JSON.parse(localStorage.getItem("drawnShapes")));
    setChangeShape(true);
  };

  const handleEdit = (e) => {
    const storedData = JSON.parse(localStorage.getItem("drawnShapes"));

    function updateObjectByIdInLocalStorage(id, updatedProperties) {
      if (storedData) {
        // Find the index of the object with the given ID
        const indexToUpdate = storedData.findIndex((item) => item.id == id);
        if (indexToUpdate !== -1) {
          // If the object with the ID is found, update its properties
          storedData[indexToUpdate] = {
            ...storedData[indexToUpdate],
            ...updatedProperties,
          };

          // Store the updated array back in localStorage
          localStorage.setItem("drawnShapes", JSON.stringify(storedData));
          setStoredShapes(storedData);
        } else {
          // Handle case where the ID is not found
          console.error("Object with ID " + id + " not found!");
        }
      }
    }
    let findShape;
    if (changeShape) {
      findShape = storedData.filter((shape) =>
        leafletIds.includes(shape.id.toString())
      );
    } else {
      setStoredShapes(storedData);
    }

    const remainingLayers = featureGroupRef.current?.getLayers();

    if (remainingLayers) {
      // Array to store the shape information with unique IDs
      const remainingShapesInfo = [];

      // Iterate through the layers and store the shape info
      remainingLayers.forEach((layer) => {
        let shapeType;
        let shapeInfo;

        if (layer instanceof L.Marker) {
          const shapeType = "marker";
          const matchingShapes = findShape.filter(
            (shape) => shape.type === shapeType && leafletIds.includes(shape.id)
          );

          if (matchingShapes.length > 0) {
            matchingShapes.forEach((matchingShape) => {
              updateObjectByIdInLocalStorage(matchingShape.id, {
                lat: leafletInfo[matchingShape.id]._latlng.lat,
                lng: leafletInfo[matchingShape.id]._latlng.lng,
              });
            });
          }
          // console.log("stop", leafletInfo[leafletIds]._latlng);
        } else if (layer instanceof L.CircleMarker) {
          const shapeType = "circleMarker";
          const matchingShapes =
            changeShape &&
            findShape.filter(
              (shape) =>
                shape.type === shapeType && leafletIds.includes(shape.id)
            );

          if (matchingShapes.length > 0) {
            matchingShapes.forEach((matchingShape) => {
              updateObjectByIdInLocalStorage(matchingShape.id, {
                lat: leafletInfo[matchingShape.id]._latlng.lat,
                lng: leafletInfo[matchingShape.id]._latlng.lng,
              });
            });
          }
        } else if (layer instanceof L.Circle) {
          const shapeType = "circle";
          const matchingShapes =
            changeShape &&
            findShape.filter(
              (shape) =>
                shape.type === shapeType && leafletIds.includes(shape.id)
            );

          if (matchingShapes.length > 0) {
            matchingShapes.forEach((matchingShape) => {
              updateObjectByIdInLocalStorage(matchingShape.id, {
                lat: leafletInfo[matchingShape.id]._latlng.lat,
                lng: leafletInfo[matchingShape.id]._latlng.lng,
                radius: leafletInfo[matchingShape.id]._mRadius,
              });
            });
          }
          // console.log("type", leafletInfo[leafletIds]._latlng);
          // console.log(shapeType, leafletInfo[leafletIds]);
        } else if (layer instanceof L.Polygon) {
          const shapeType = "polygon";
          const matchingShapes =
            changeShape &&
            findShape.filter(
              (shape) =>
                shape.type === shapeType && leafletIds.includes(shape.id)
            );

          if (matchingShapes.length > 0) {
            matchingShapes.forEach((matchingShape) => {
              const latlngs = leafletInfo[matchingShape.id].getLatLngs()[0]; // Extract the outer ring (main polygon)
              const firstPoint = latlngs[0];
              const lastPoint = latlngs[latlngs.length - 1];
              const isClosed = firstPoint.equals(lastPoint);

              if (!isClosed) {
                // If not closed, add the first point's lat/lng values at the end to close the polygon
                latlngs.push(firstPoint);
                leafletInfo[matchingShape.id].setLatLngs([latlngs]); // Wrap in an array to maintain polygon format
              }

              updateObjectByIdInLocalStorage(matchingShape.id, {
                latlngs,
              });
            });
          }
        } else if (layer instanceof L.Polyline) {
          const shapeType = "polyline";
          const matchingShapes = findShape.filter(
            (shape) => shape.type === shapeType && leafletIds.includes(shape.id)
          );

          if (matchingShapes.length > 0) {
            matchingShapes.forEach((matchingShape) => {
              updateObjectByIdInLocalStorage(matchingShape.id, {
                latlngs: leafletInfo[matchingShape.id].getLatLngs(),
              });
            });
          }
        }
      });

      // localStorage.setItem("drawnShapes", JSON.stringify(remainingShapesInfo));
    }
  };

  /* handle edit ends*/

  const handleDeleteShapes = () => {
    // Sample array of objects stored in localStorage
    const storedData = JSON.parse(localStorage.getItem("drawnShapes"));

    // Remove objects from the array based on leaflet IDs
    const updatedData =
      changeShape &&
      storedData.filter((shape) => !leafletIds.includes(shape.id.toString()));

    // Store the updated array back in localStorage
    if (leafletIds && leafletIds.length > 0) {
      localStorage.setItem("drawnShapes", JSON.stringify(updatedData));
      setStoredShapes(updatedData);
    } else {
      setStoredShapes(storedData);
    }
  };

  const button = <button>Click</button>;

  const recreateShapesOnMap = (shapes) => {
    const featureGroup = featureGroupRef.current;
    let leaflet_id;

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
          let tooltipContent;

          if (shape.title) {
            tooltipContent = `<div><strong>Shape Title:</strong> ${shape.id}</div><div><a href="${linkUrl}" target="_blank">Link</a></div>`;
          } else {
            tooltipContent = `<div><strong>Shape Title:</strong> <button onClick="console.log(shape.id)">Click</button></div><div><a href="${linkUrl}" target="_blank">Link</a></div>`;
          }

          // Add the shape to the featureGroup and attach the tooltip
          layer.addTo(featureGroup).bindPopup(tooltipContent, {
            direction: "top", // Adjust the direction of the tooltip as needed
            permanent: true, // Set to 'true' if you want the tooltip to be always visible
          });

          console.log(changeShape);

          if (!changeShape) {
            layer.on("click", () => {
              // Open the link URL when the shape is clicked
              window.open(linkUrl, "_blank");
            });
          }
        }
      });

      leaflet_id = Object.keys(featureGroup._layers);
    }
    const updatedObjects = leaflet_id.map((num, index) => ({
      ...storedShapes[index],
      id: num, // Set the object's ID based on the corresponding number
    }));
    localStorage.setItem("drawnShapes", JSON.stringify(updatedObjects));
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
          onCreated={onCreated}
          onDeleteStart={handleChangeStart}
          onDeleteStop={() => {
            setChangeShape(false);
            handleDeleteShapes();
          }}
          onDeleted={handleEdited}
          onEditStart={handleChangeStart}
          onEditStop={() => {
            setChangeShape(false);
            handleEdit();
          }}
          onEdited={handleEdited}
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
