import React, { useEffect, useReducer } from "react";
import { Container, Table } from "react-bootstrap";

const initialState = {
  apiResponse: [],
  tableHeaders: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_API_RESPONSE":
      return { ...state, apiResponse: action.payload };
    case "SET_TABLE_HEADERS":
      return { ...state, tableHeaders: action.payload };
    default:
      return state;
  }
};

const Table5 = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const urlPattern = /^(http|https):\/\//i;

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "SET_API_RESPONSE", payload: data });
        dispatch({ type: "SET_TABLE_HEADERS", payload: Object.keys(data[0]) });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const { apiResponse, tableHeaders } = state;

  return (
    <Container>
      <Table striped bordered>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {apiResponse.map((item) => (
            <tr key={item.id}>
              {tableHeaders.map((header) => (
                <td key={header}>
                  {urlPattern.test(item[header]) ? (
                    <a
                      href={item[header]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item[header]}
                    </a>
                  ) : (
                    item[header]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Table5;
