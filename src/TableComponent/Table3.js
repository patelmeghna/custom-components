import React, { useEffect, useReducer } from "react";
import axios from "axios";

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

function Table(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/photos")
      .then((response) => {
        dispatch({ type: "INITIALIZE", payload: { data: response.data } });
      });
  }, []);

  const urlPattern = /^(http|https):\/\//i;

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

  return (
    <table>
      <thead>
        <tr>
          {state.columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
          {props.alertButtons && <th>Alert</th>}
        </tr>
      </thead>
      <tbody>
        {state.data.map((item) => (
          <React.Fragment key={item.id}>
            <tr>
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
        ))}
      </tbody>
    </table>
  );
}

export default Table;
