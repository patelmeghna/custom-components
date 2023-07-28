import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Table1 from "./TableComponent/Table1";
import Table2 from "./TableComponent/Table2";
import Table3 from "./TableComponent/Table3";
import Table4 from "./TableComponent/Table4";
import Demo from "./TableComponent/Demo";
import Home from "./Home";
import TableLayout from "./TableComponent/layout";
import DatePicker from "./zcustomdatetimepicker";
import CustomTab from "./TabComponent/CustomTab"

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columnsToDisplay = ["id", "userId", "title"];
  const API_URL = "https://jsonplaceholder.typicode.com/posts";

  const handleDeleteRows = (rowsToDelete) => {
    setData((prevData) =>
      prevData.filter((row) => !rowsToDelete.includes(row.id))
    );
  };

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const alertBtns = data.map((item) => (
    <button
      key={item.id}
      className="btn btn-primary"
      onClick={() => {
        alert(item.title);
      }}
    >
      {item.id}
    </button>
  ));

  return (
    <>
      <BrowserRouter>
        <Routes>
    
          <Route index element={<Home />} />
          <Route path="/date-picker" element={<DatePicker />} />
          <Route path="/*" element={<TableLayout />}>
            <Route
              path="table1"
              element={
                <Table1 api={API_URL} columnsToDisplay={columnsToDisplay} />
              }
            />

            <Route
              path="table2"
              element={
                <Table2 api={API_URL} columnsToDisplay={columnsToDisplay} />
              }
            />
            <Route
              path="table3"
              element={<Table3 alertButtons={alertBtns} apiUrl={API_URL} />}
            />
            <Route path="table4" element={<Table4 />} />
            <Route path="demo-code" element={<Demo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
