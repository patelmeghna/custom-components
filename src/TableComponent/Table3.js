import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faMagnifyingGlass, faRightLong } from "@fortawesome/free-solid-svg-icons";
import { Container, FormControl, InputGroup, Table } from "react-bootstrap";

const initialState = {
  data: [],
  columns: [],
  openRows: [],
};

function reducer(state, action) {
  switch (action.type) {
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
        data: state.data.map((item) =>
          item.id === action.payload.id ? { ...item, hasChildren1: true } : item
        ),
        openRows: [action.payload.id],
      };
    case "HIDE_CHILD_ROWS_1":
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload.id
            ? { ...item, hasChildren1: false }
            : item
        ),
        openRows: [],
      };
    case "SHOW_CHILD_ROWS_2":
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload.id
            ? { ...item, hasChildren2: true, hasChildren1: false }
            : item
        ),
        openRows: [action.payload.id],
      };
      case "DELETE_ROWS":
      return {
        ...state,
        data: action.payload.data,
        selectedRows: [],
      };
      case "SET_INPUT_PAGE_NUMBER":
        return {
          ...state,
          inputPageNumber: action.payload,
        };
        case "PREV_PAGE":
      return {
        ...state,
        currentPage:
          state.currentPage > 1 ? state.currentPage - 1 : state.currentPage,
        inputPageNumber:
          state.currentPage > 1 ? state.currentPage - 1 : state.currentPage,
      };
      case "SET_TOTAL_PAGES":
        return { ...state, totalPages: action.payload };
      case "SET_CURRENT_PAGE":
        return { ...state, currentPage: action.payload };
  
    case "NEXT_PAGE":
      debugger
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
      case "SELECT_OPTION":
      return {
        ...state,
        itemsPerPage: action.payload,
      };
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
    case "HIDE_CHILD_ROWS_2":
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload.id
            ? { ...item, hasChildren2: false }
            : item
        ),
        openRows: [],
      };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

function Table3(props) {
  const [state, dispatch] = useReducer(reducer,  {
    data: [],
    columns: [],
    openRows: [],
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
    pageSize: 10,
    selectedRows: [],
  });
  const indexOfLastItem = state.currentPage * state.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - state.itemsPerPage;

  const currentItems = state.data.slice(indexOfFirstItem, indexOfLastItem);
  const totalRecord = state.itemsPerPage * state.totalPages;
  
  const {
    data,
    columns,
    selectedRows,
    sortColumn,
    sortDirection,
    expandedRows,
    currentPage,
    itemsPerPage,
    pageSize
  } = state;
  let sortedData = [...currentItems];
  const pageCount = Math.ceil(state.data.length / pageSize);
  useEffect(() => {
    const totalPages = Math.ceil(state.data.length / state.itemsPerPage);
    dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
  }, [state.data, state.itemsPerPage]);
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/photos")
      .then((response) => {
        dispatch({ type: "INITIALIZE", payload: { data: response.data } });
      });
  }, []);
  const pageNumbers = [];
  for (let i = 1; i <= state.totalPages; i++) {
    pageNumbers.push(i);
  }

  const urlPattern = /^(http|https):\/\//i;

  if (sortColumn) {
    sortedData.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortColumn] > b[sortColumn]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  const handleShowChildRows1 = (id) => {
    if (
      state.openRows.includes(id) &&
      state.data.find((item) => item.id === id).hasChildren2
    ) {
      dispatch({ type: "HIDE_CHILD_ROWS_2", payload: { id } });
    }
    if (
      state.openRows.includes(id) &&
      state.data.find((item) => item.id === id).hasChildren1
    ) {
      dispatch({ type: "HIDE_CHILD_ROWS_1", payload: { id } });
    } else {
      dispatch({ type: "SHOW_CHILD_ROWS_1", payload: { id } });
    }
  };

  const handleHideChildRows1 = (id) => {
    dispatch({ type: "HIDE_CHILD_ROWS_1", payload: { id } });
  };

  const handleShowChildRows2 = (id) => {
    dispatch({ type: "SHOW_CHILD_ROWS_2", payload: { id } });
  };

  const handleHideChildRows2 = (id) => {
    dispatch({ type: "HIDE_CHILD_ROWS_2", payload: { id } });
  };
  const handleDeleteRows = () => {
    const filteredData = state.data.filter(
      (row) => !state.selectedRows.includes(row)
    );
    dispatch({ type: "DELETE_ROWS", payload: { data: filteredData } });
    alert("Deleted");
  };
  
  function handleSelectChange(event, type) {
    const value = event.target.value;
    debugger
    if (type === "navigatePage") {
      debugger
      // Update input value
      dispatch({ type: "SET_INPUT_PAGE_NUMBER", payload: value });
    } else if (type === "itemsPerPage") {
      debugger
      dispatch({ type: "SELECT_OPTION", payload: parseInt(value, 10) });
    }
  }
  
  
  const handlePrevious = () => {
    dispatch({ type: "PREV_PAGE" });
  };

  const handleNext = () => {
    debugger
    dispatch({ type: "NEXT_PAGE" });
  };
  const handlePageChange = () => {
    // Validate the input value
    debugger
    const numValue = parseInt(state.inputPageNumber, 10);
    if (isNaN(numValue) || numValue < 1 || numValue > state.totalPages) {
      return;
    }
    debugger
    dispatch({ type: "SET_CURRENT_PAGE", payload: numValue });
  };
  const handleSetCurrentPage = (pageNumber) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: pageNumber });
  };
  const handleSelectAll = (event) => {
    const { checked } = event.target;

    if (checked) {
      dispatch({ type: "SELECT_ALL", payload: { data: state.data} });
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
  return (
    <>
    <Container className="py-5">

    <Table striped bordered>
    
      <thead>
        <tr>
        <th><input type="checkbox" onClick={handleSelectAll} /></th>
          {state.columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
          {props.alertButtons && <th>Alert</th>}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item) => {
          return(
            <>
            <React.Fragment key={item.id}>
            <tr>
            <th><input
                type="checkbox"
                checked={selectedRows.includes(item)}
                onChange={(event) => handleSelectRow(event, item)}
              /></th>
              {state.columns.slice(0, -2).map((column) => (
                <td key={column}>
                
                  {urlPattern.test(item[column]) ? (
                    <a
                      href={item[column]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item[column]}
                    </a>
                  ) : (
                    item[column]
                  )}
                </td>
              ))}
              {item.hasChildren1 ? (
                state.openRows.includes(item.id) ? (
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleHideChildRows1(item.id)}
                    >
                      Hide
                    </button>
                  </td>
                ) : (
                  <td></td>
                )
              ) : (
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleShowChildRows1(item.id)}
                  >
                    Show
                  </button>
                </td>
              )}
              {item.hasChildren2 ? (
                state.openRows.includes(item.id) ? (
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleHideChildRows2(item.id)}
                    >
                      Hide
                    </button>
                  </td>
                ) : (
                  <td></td>
                )
              ) : (
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleShowChildRows2(item.id)}
                  >
                    Show
                  </button>
                </td>
              )}
              <td>{props.alertButtons[item.id]}</td>
            </tr>
            {item.hasChildren1 && state.openRows.includes(item.id) && (
              <tr>
                <td colSpan={state.columns.length}>
                  {" "}
                  <p>row 1</p>
                </td>
              </tr>
            )}
            {item.hasChildren2 && state.openRows.includes(item.id) && (
              <tr>
                <td colSpan={state.columns.length}>
                  <p>row 2</p>
                </td>
              </tr>
            )}
          </React.Fragment>
            </>
          )
        })}
      </tbody>
   
    </Table>
    <div>
        <button
          disabled={state.currentPage === 1}
          onClick={() => handlePrevious()}
        >
          Previous
        </button>
        {pageCount <= 10 ? (
          Array.from({ length: pageCount }, (_, i) => (
            <button key={i} onClick={() => handleSetCurrentPage(i + 1)}>
              {i + 1}
            </button>
          ))
        ) : (
          <>
            <button onClick={() => handleSetCurrentPage(1)}>1</button>
            {currentPage > 5 && <span>...</span>}
            {currentPage > 4 && (
              <button onClick={() => handleSetCurrentPage(currentPage - 2)}>
                {currentPage - 2}
              </button>
            )}
            {currentPage > 3 && (
              <button onClick={() => handleSetCurrentPage(currentPage - 1)}>
                {currentPage - 1}
              </button>
            )}
            {currentPage > 2 && (
              <button onClick={() => handleSetCurrentPage(currentPage - 1)}>
                {currentPage - 1}
              </button>
            )}
            <button disabled>{currentPage}</button>
            {currentPage < pageCount - 1 && (
              <button onClick={() => handleSetCurrentPage(currentPage + 1)}>
                {currentPage + 1}
              </button>
            )}
            {currentPage < pageCount - 2 && (
              <button onClick={() => handleSetCurrentPage(currentPage + 2)}>
                {currentPage + 2}
              </button>
            )}
            {currentPage < pageCount - 3 && (
              <button onClick={() => handleSetCurrentPage(currentPage + 1)}>
                {currentPage + 1}
              </button>
            )}
            {currentPage < pageCount - 4 && <span>...</span>}
            <button onClick={() => handleSetCurrentPage(pageCount)}>
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
    <div className="w-100 d-flex align-items-center justify-content-between">
          <div>
            <button className="btn btn-primary" onClick={handleDeleteRows}>
              Delete Rows
            </button>
          </div>

          <div>
            <span>View </span>
            <select
              value={itemsPerPage}
              onChange={(event) => handleSelectChange(event, "itemsPerPage")}
              
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="1000">1000</option>
            </select>

            <span> Records</span>
            <p className="m-0 fw-bold">Total {totalRecord} record</p>
          </div>

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
    </Container>
    </>
  );
}

export default Table3;
