import React, { useEffect, useReducer } from "react";
import axios from "axios";
import {
  Card,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeftLong,
  faMagnifyingGlass,
  faRightLong,
} from "@fortawesome/free-solid-svg-icons";

const Table1 = ({ api, columnsToDisplay }) => {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    columns: [],
    selectedRows: [],
    sortColumn: null,
    sortDirection: null,
    expandedRows: [],
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
  });

  const indexOfLastItem = state.currentPage * state.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - state.itemsPerPage;

  const currentItems = state.data.slice(indexOfFirstItem, indexOfLastItem);
  // const totalPages = Math.ceil(state.data.length / state.itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= state.totalPages; i++) {
    pageNumbers.push(i);
  }

  const totalRecord = state.itemsPerPage * state.totalPages;

  useEffect(() => {
    const totalPages = Math.ceil(state.data.length / state.itemsPerPage);
    dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
  }, [state.data, state.itemsPerPage]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(api);
      const columns = Object.keys(result.data[0]).map((key) => ({
        name: key,
        selected: true,
      }));
      dispatch({
        type: "FETCH_SUCCESS",
        payload: { data: result.data, columns },
      });
    };
    fetchData();
  }, [api]);

  const handleDeleteRows = () => {
    const filteredData = state.data.filter(
      (row) => !state.selectedRows.includes(row)
    );
    dispatch({ type: "DELETE_ROWS", payload: { data: filteredData } });
    alert("Deleted");
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    if (checked) {
      dispatch({ type: "SELECT_ALL", payload: { data: state.data } });
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
    }
  };

  const handleToggleColumn = (event, columnName) => {
    dispatch({ type: "TOGGLE_COLUMN", payload: { columnName } });
  };

  const handleSortColumn = (event, columnName) => {
    event.preventDefault();
    let direction = "asc";
    if (state.sortColumn === columnName) {
      direction = state.sortDirection === "asc" ? "desc" : "asc";
    }
    dispatch({ type: "SORT_COLUMN", payload: { columnName, direction } });
  };

  const handleToggleRowExpansion = (event, row) => {
    const { checked } = event.target;
    if (checked) {
      dispatch({ type: "EXPAND_ROW", payload: { row } });
    } else {
      dispatch({ type: "COLLAPSE_ROW", payload: { row } });
    }
  };

  const handleRearrangeColumns = (dragIndex, hoverIndex) => {
    const newColumns = [...state.columns];
    const draggedColumn = newColumns[dragIndex];

    newColumns.splice(dragIndex, 1);
    newColumns.splice(hoverIndex, 0, draggedColumn);

    dispatch({ type: "REARRANGE_COLUMNS", payload: { columns: newColumns } });
  };

  const {
    data,
    columns,
    selectedRows,
    sortColumn,
    sortDirection,
    expandedRows,
    currentPage,
    itemsPerPage,
  } = state;
  let sortedData = [...currentItems];

  // Get an array of selected columns
  const selectedColumns = columns.filter((column) => column.selected);

  // Get an array of unselected columns
  const unselectedColumns = columns.filter((column) => !column.selected);

  const handlePrevious = () => {
    dispatch({ type: "PREV_PAGE" });
  };

  const handleNext = () => {
    dispatch({ type: "NEXT_PAGE" });
  };

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

  function handleSelectChange(event, type) {
    const value = event.target.value;

    if (type === "navigatePage") {
      // Update input value
      dispatch({ type: "SET_INPUT_PAGE_NUMBER", payload: value });
    } else if (type === "itemsPerPage") {
      dispatch({ type: "SELECT_OPTION", payload: parseInt(value, 10) });
    }
  }

  const handlePageChange = () => {
    // Validate the input value
    const numValue = parseInt(state.inputPageNumber, 10);
    if (isNaN(numValue) || numValue < 1 || numValue > state.totalPages) {
      return;
    }
    dispatch({ type: "SET_CURRENT_PAGE", payload: numValue });
  };

  const handleSetCurrentPage = (pageNumber) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: pageNumber });
  };

  let visibleColumns = columns;
  let hiddenColumns;

  // const handleHidden

  console.log(visibleColumns);

  return (
    <>
      <Container>
        <Row>
          <Col md="5">
            <Card>
              <Card.Title className="p-3 border-bottom">
                <h4>Hidden Columns</h4>
              </Card.Title>
              <Card.Body>
                {unselectedColumns.map((column, index) => (
                  // Display unselected columns
                  <h5
                    key={index}
                    onClick={(event) => handleToggleColumn(event, column.name)}
                  >
                    {column.name}
                  </h5>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col md="2">
            <button>Show</button>
            <button>Hide</button>
          </Col>
          <Col md="5">
            <Card>
              <Card.Title className="p-3 border-bottom">
                <h4>Visible Columns</h4>
              </Card.Title>
              <Card.Body>
                {selectedColumns.map((column, index) => (
                  // Display selected columns
                  <h5
                    key={index}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("dragIndex", index);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                    }}
                    onDrop={(event) => {
                      const dragIndex = event.dataTransfer.getData("dragIndex");
                      const hoverIndex = index;
                      handleRearrangeColumns(dragIndex, hoverIndex);
                    }}
                    onClick={(event) => handleToggleColumn(event, column.name)}
                  >
                    {column.name}
                  </h5>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container className="py-5">
        <Table striped bordered>
          <thead>
            <tr>
              <th>
                <input type="checkbox" onChange={handleSelectAll} />
              </th>
              <th></th>
              {selectedColumns.map((column, index) => (
                <th key={index}>
                  <p onClick={(event) => handleSortColumn(event, column.name)}>
                    {column.name}
                    {sortColumn === column.name && (
                      <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                    )}
                  </p>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedData.map((row, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={(event) => handleSelectRow(event, row)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        dispatch({
                          type: "TOGGLE_EXPAND_ROW",
                          payload: index,
                        })
                      }
                    >
                      {expandedRows.includes(index) ? "-" : "+"}
                    </button>
                  </td>
                  {columns
                    .filter((column) => column.selected)
                    .map((column, index) => (
                      <td key={index}>
                        {column.name === "expand" ? (
                          <input
                            type="checkbox"
                            checked={expandedRows.includes(row)}
                            onChange={(event) =>
                              handleToggleRowExpansion(event, row)
                            }
                          />
                        ) : (
                          row[column.name]
                        )}
                      </td>
                    ))}
                </tr>
                {expandedRows.includes(row) && (
                  <tr>
                    <td
                      colSpan={
                        columns.filter((column) => column.selected).length
                      }
                    >
                      Peek-a-boo
                    </td>
                  </tr>
                )}
                {state.expandedRows.includes(index) && (
                  <tr>
                    <td></td>
                    <td></td>
                    <td colSpan={columnsToDisplay.length + 1}>
                      {Object.keys(row)
                        .filter(
                          (columnName) => !columnsToDisplay.includes(columnName)
                        )
                        .map((columnName) => (
                          <div key={`${index}-${columnName}`}>
                            <strong>{columnName}:</strong> {row[columnName]}
                          </div>
                        ))}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
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
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.payload.data,
        columns: action.payload.columns,
      };
    case "TOGGLE_EXPAND_ROW":
      const rowIndex = action.payload;
      const expandedRows = state.expandedRows.includes(rowIndex)
        ? state.expandedRows.filter((row) => row !== rowIndex)
        : [...state.expandedRows, rowIndex];
      return { ...state, expandedRows };
    case "DELETE_ROWS":
      return {
        ...state,
        data: action.payload.data,
        selectedRows: [],
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
    case "TOGGLE_COLUMN":
      const updatedColumns = state.columns.map((column) =>
        column.name === action.payload.columnName
          ? { ...column, selected: !column.selected }
          : column
      );
      return {
        ...state,
        columns: updatedColumns,
      };
    case "SORT_COLUMN":
      const { columnName, direction } = action.payload;
      return {
        ...state,
        sortColumn: columnName,
        sortDirection: direction,
      };
    case "REARRANGE_COLUMNS":
      return {
        ...state,
        columns: action.payload.columns,
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

    default:
      return state;
  }
};

export default Table1;
