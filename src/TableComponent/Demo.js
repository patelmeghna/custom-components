import React, { useEffect, useState } from "react";
import DemoFile from "./DemoFile";

const Demo = () => {
  const [alertData, setAlertData] = useState([]);

  const data = "https://jsonplaceholder.typicode.com/photos";

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((response) => response.json())
      .then((data) => {
        setAlertData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const alertBtns = alertData.map((item) => (
    <button
      key={item.id}
      onClick={() => {
        alert(item.body);
      }}
    >
      {item.id}
    </button>
  ));

  return <DemoFile alertButtons={alertBtns} api={data} />;
};

export default Demo;
