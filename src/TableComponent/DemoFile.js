import { faLeftLong, faMagnifyingGlass, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useReducer } from "react";
import { Container, FormControl, InputGroup, Table } from "react-bootstrap";
import '../App.css'
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
    case "SELECT_ALL":
      return {
        ...state,
        selectedRows: action.payload.data,
      };
    case "DESELECT_ALL":
      return {
        ...state,
        selectedRows: [],
      };
    case "SELECT_ROW":
      return {
        ...state,
        selectedRows: [...state.selectedRows, action.payload.row],
      };
    case "DESELECT_ROW":
      return {
        ...state,
        selectedRows: state.selectedRows.filter(
          (row) => row !== action.payload.row
        ),
      };
    case "PREV_PAGE":
      return {
        ...state,
        currentPage:
          state.currentPage > 1 ? state.currentPage - 1 : state.currentPage,
        inputPageNumber:
          state.currentPage > 1 ? state.currentPage - 1 : state.currentPage,
      };
    case "NEXT_PAGE":
      return {
        ...state,
        currentPage:
          state.currentPage < state.totalPages
            ? state.currentPage + 1
            : state.currentPage,
        inputPageNumber:
          state.currentPage < state.totalPages
            ? state.currentPage + 1
            : state.currentPage,
      };

    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SELECT_OPTION":
      return {
        ...state,
        itemsPerPage: action.payload,
      };
    case "SET_INPUT_PAGE_NUMBER":
      return {
        ...state,
        inputPageNumber: action.payload,
      };
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
  const [state, dispatch] = useReducer(reducer, {
    apiResponse: [],
    tableHeaders: [],
    pageSize: 10,
    currentPage: 1,
    columns: [],
    openRows: [],
    selectedRows: [],
    itemsPerPage: 10,
    totalPages: 0,
    reset:false
  });

  const { apiResponse, tableHeaders, pageSize, currentPage, selectedRows } = state;

  const pageCount = Math.ceil(apiResponse.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentItems = apiResponse.slice(startIndex, endIndex);

  const pageNumbers = [];
  for (let i = 1; i <= state.totalPages; i++) {
    pageNumbers.push(i);
  }

  // const handlePageChange = (page) => {
  //   dispatch({ type: "SET_PAGE", payload: page });
  // };

  const handleSizeChange = (size) => {
    dispatch({ type: "SET_SIZE", payload: size });
  };

  const urlPattern = /^(http|https):\/\//i;
  const totalRecord = state.itemsPerPage * state.totalPages;


  useEffect(() => {
    const totalPages = Math.ceil(state.apiResponse.length / state.itemsPerPage);
    dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
  }, [state.apiResponse, state.itemsPerPage]);
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

  const handleSelectAll = (event) => {
    const { checked } = event.target;

    if (checked) {
      dispatch({ type: "SELECT_ALL", payload: { data: state.apiResponse } });
    } else {
      dispatch({ type: "DESELECT_ALL" });
    }
  };
  const handleSelectRow = (event, row) => {
    const { checked } = event.target;
    if (checked) {
      dispatch({ type: "SELECT_ROW", payload: { row } });
    } else {
      dispatch({ type: "DESELECT_ROW", payload: { row } });
      // dispatch({ type: "DESELECT_ALL" });
    }
  };

  const handlePrevious = () => {
    dispatch({ type: "PREV_PAGE" });
  };

  const handleNext = () => {
    dispatch({ type: "NEXT_PAGE" });
  };

  const handlePageChange = (page) => {
    // dispatch({ type: "SET_PAGE", payload: page });
    // Validate the input value
    debugger
    const numValue = parseInt(state.inputPageNumber, 10);
    
    if (isNaN(numValue) || numValue < 1 || numValue > state.totalPages) {
      
      return;
    }
    
    dispatch({ type: "SET_CURRENT_PAGE", payload: numValue });
  };



  function handleSelectChange(event, type) {
    
    const value = event.target.value;
    
    if (type === "navigatePage") {
      
      // Update input value
      dispatch({ type: "SET_INPUT_PAGE_NUMBER", payload: value });
    } else if (type === "itemsPerPage") {
      
      dispatch({ type: "SELECT_OPTION", payload: parseInt(value, 10) });
    }
  }

  return (
    <Container>
      <Table striped bordered>
        <thead>
          <tr>
            <th><input type="checkbox" onClick={handleSelectAll} /></th>
            {tableHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.slice(0, pageSize).map((item, index) => (
            <tr key={item.id}>
              <th><input
                type="checkbox"
                checked={selectedRows.includes(item)}
                onChange={(event) => handleSelectRow(event, item)}
              /></th>
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
      <div className="row">
        <div className="column">
        <div>
        <button
          disabled={state.currentPage === 1}
          onClick={() => handlePrevious()}
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
          onClick={() => handleNext()}
        >
          Next
        </button>
      </div>
        </div>
        <div className="column">
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
        <span> Records</span>
        <p className="m-0 fw-bold">Total {totalRecord} record</p>
      </div>
        </div>
        <div className="column">
        <div className="d-flex">
        <button className="btn btn-primary me-1" onClick={handlePrevious}>
          <FontAwesomeIcon icon={faLeftLong} />
        </button>
        <div className="d-flex">
          <span>Page </span>
          <InputGroup>
            <FormControl
              type="number"
              min="1"
              max={state.totalPages}
              value={state.inputPageNumber}
              onChange={(event) =>
                handleSelectChange(event, "navigatePage")
              }
            />
            <InputGroup.Text>
              <button className="p-0 btn" onClick={handlePageChange}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </InputGroup.Text>
          </InputGroup>

          <span> of {pageNumbers[pageNumbers.length - 1]}</span>
        </div>
        <button className="btn btn-primary ms-1" onClick={handleNext}>
          <FontAwesomeIcon icon={faRightLong} />
        </button>
      </div>
        </div>
      </div>
    

    
      
    </Container>
  );
}

export default DemoFile;
