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
          hasUrl1: item.hasOwnProperty(action.payload.urlColumn),
          hasUrl2: item.hasOwnProperty(action.payload.urlColumn),
        })),
        columns: [...Object.keys(action.payload.data[0])],
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
          item.id === action.payload.id ? { ...item, hasChildren2: true } : item
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

function ChildRows({ childRows }) {
  return (
    <ul>
      {childRows.map((row, index) => (
        <li key={index}>{row}</li>
      ))}
    </ul>
  );
}

function Table() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/photos")
      .then((response) => {
        const dataWithUrl = response.data.map((item) => ({
          ...item,
          hasChildren1: false,
          hasChildren2: false,
          url: item.url,
        }));
        dispatch({
          type: "INITIALIZE",
          payload: { data: dataWithUrl },
        });
      });
  }, []);

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
        </tr>
      </thead>
      <tbody>
        {state.data.map((item) => (
          <React.Fragment key={item.id}>
            <tr>
              {state.columns.slice(0, -2).map((column) => (
                <td key={column}>{item[column]}</td>
              ))}
              {item.url ? (
                <td>
                  <a href={item.url}>{item.url}</a>
                </td>
              ) : (
                <td></td>
              )}
              {item.thumbnailUrl ? (
                <td>
                  <a href={item.thumbnailUrl}>{item.thumbnailUrl}</a>
                </td>
              ) : (
                <td></td>
              )}
              {item.hasChildren1 ? (
                state.openRows.includes(item.id) ? (
                  <td>
                    <button onClick={() => handleHideChildRows1(item.id)}>
                      Hide
                    </button>
                  </td>
                ) : (
                  <td></td>
                )
              ) : (
                <td>
                  <button onClick={() => handleShowChildRows1(item.id)}>
                    Show
                  </button>
                </td>
              )}
              {item.hasChildren2 ? (
                state.openRows.includes(item.id) ? (
                  <td>
                    <button onClick={() => handleHideChildRows2(item.id)}>
                      Hide
                    </button>
                  </td>
                ) : (
                  <td></td>
                )
              ) : (
                <td>
                  <button onClick={() => handleShowChildRows2(item.id)}>
                    Show
                  </button>
                </td>
              )}
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
