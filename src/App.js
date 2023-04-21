import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "../src/TableComponent/layout/Header";
import Table1 from "./TableComponent/Table1";
import Table2 from "./TableComponent/Table2";
import Table3 from "./TableComponent/Table3";
import Table4 from "./TableComponent/Table4";
import Demo from "./TableComponent/Demo";
import { useDispatch } from 'react-redux';
import { setTableValues } from './redux/CustomTable/custom-table.actions';
import axios from "axios";
// import CustomTable from "./componentscustomTable";

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const columnsToDisplay = ["id", "userId", "title"];
  const API_URL = "https://jsonplaceholder.typicode.com/posts";

  const handleDeleteRows = (rowsToDelete) => {
    setData((prevData) =>
      prevData.filter((row) => !rowsToDelete.includes(row.id))
    );
  };

  useEffect(() => {
    getAPI()
  }, []);


  const  getAPI = async () => {
    setIsLoading(true);
   await axios.get(API_URL).then(
      res => {
        if(res.status === 200){
          res.data.forEach(x => {
            x.status = false
          });
          dispatch(setTableValues(res.data))
          setData(res.data);
          setIsLoading(false);
        }
      }
    ).catch(
      err => {
        setIsLoading(false);
        console.log(err);
      }
    )

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
    {isLoading === true ? <div>Loading...</div> : 
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            index
            element={
              <Table1 api={API_URL} columnsToDisplay={columnsToDisplay} />
            }
          />

          <Route
            path="/table2"
            element={
              <Table2 api={API_URL} columnsToDisplay={columnsToDisplay} />
            }
          />
          <Route
            path="/table3"
            element={<Table3 alertButtons={alertBtns} apiUrl={API_URL} />}
          />
          <Route path="/table4" element={<Table4 />} />
          <Route path="/demo-code" element={<Demo />} />
          {/* <Route path="/customtable" element={<CustomTable />} /> */}
        </Routes>
      </BrowserRouter>
    </>}
    </>
  );
}

export default App;
