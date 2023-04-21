import React, { useEffect, useReducer } from "react";
import { Container, Table } from "react-bootstrap";

const initialState = {
  apiResponse: [],
  tableHeaders: [],
  pageSize: 10,
  currentPage: 1,
  columns: [],
  openRows: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_API_RESPONSE":
      return { ...state, apiResponse: action.payload };
    case "SET_TABLE_HEADERS":
      return { ...state, tableHeaders: action.payload };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_SIZE":
      return { ...state, pageSize: action.payload };
    case "INITIALIZE":
      return {
        ...state,
        data: action.payload.data.map((item) => ({
          ...item,
          hasChildren1: false,
          hasChildren2: false,
        })),
        columns: [...Object.keys(action.payload.data[0]), "Show 1", "Show 2"],
      };
    case "SHOW_CHILD_ROWS_1":
      return {
        ...state,
        data: state.apiResponse.map((item) =>
          item.id === action.payload.id ? { ...item, hasChildren1: true } : item
        ),
        openRows: [action.payload.id],
      };
    case "HIDE_CHILD_ROWS_1":
      return {
        ...state,
        data: state.apiResponse.map((item) =>
          item.id === action.payload.id
            ? { ...item, hasChildren1: false }
            : item
        ),
        openRows: [],
      };
    case "SHOW_CHILD_ROWS_2":
      return {
        ...state,
        data: state.apiResponse.map((item) =>
          item.id === action.payload.id
            ? { ...item, hasChildren2: true, hasChildren1: false }
            : item
        ),
        openRows: [action.payload.id],
      };
    case "HIDE_CHILD_ROWS_2":
      return {
        ...state,
        data: state.apiResponse.map((item) =>
          item.id === action.payload.id
            ? { ...item, hasChildren2: false }
            : item
        ),
        openRows: [],
      };
    default:
      return state;
  }
};

function DemoFile(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { apiResponse, tableHeaders, pageSize, currentPage } = state;

  const pageCount = Math.ceil(apiResponse.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentItems = apiResponse.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    dispatch({ type: "SET_PAGE", payload: page });
  };

  const handleSizeChange = (size) => {
    dispatch({ type: "SET_SIZE", payload: size });
  };

  const urlPattern = /^(http|https):\/\//i;

  useEffect(() => {
    fetch(props.api)
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "SET_API_RESPONSE", payload: data });
        dispatch({ type: "SET_TABLE_HEADERS", payload: Object.keys(data[0]) });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Container>
      <Table striped bordered>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.slice(0, pageSize).map((item) => (
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
              <td>{props.alertButtons[item.id]}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div>
        <button
          disabled={state.currentPage === 1}
          onClick={() => handlePageChange(state.currentPage - 1)}
        >
          Previous
        </button>
        {pageCount <= 10 ? (
          Array.from({ length: pageCount }, (_, i) => (
            <button key={i} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </button>
          ))
        ) : (
          <>
            <button onClick={() => handlePageChange(1)}>1</button>
            {currentPage > 5 && <span>...</span>}
            {currentPage > 4 && (
              <button onClick={() => handlePageChange(currentPage - 2)}>
                {currentPage - 2}
              </button>
            )}
            {currentPage > 3 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>
                {currentPage - 1}
              </button>
            )}
            {currentPage > 2 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>
                {currentPage - 1}
              </button>
            )}
            <button disabled>{currentPage}</button>
            {currentPage < pageCount - 1 && (
              <button onClick={() => handlePageChange(currentPage + 1)}>
                {currentPage + 1}
              </button>
            )}
            {currentPage < pageCount - 2 && (
              <button onClick={() => handlePageChange(currentPage + 2)}>
                {currentPage + 2}
              </button>
            )}
            {currentPage < pageCount - 3 && (
              <button onClick={() => handlePageChange(currentPage + 1)}>
                {currentPage + 1}
              </button>
            )}
            {currentPage < pageCount - 4 && <span>...</span>}
            <button onClick={() => handlePageChange(pageCount)}>
              {pageCount}
            </button>
          </>
        )}
        <button
          disabled={state.currentPage === pageCount}
          onClick={() => handlePageChange(state.currentPage + 1)}
        >
          Next
        </button>
      </div>

      <div>
        <label>Page Size:</label>
        <select
          value={pageSize}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </Container>
  );
}

export default DemoFile;
