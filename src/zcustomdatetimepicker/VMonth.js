import React, { useReducer, useEffect } from "react";

const VMonth = (props) => {
  const initialState = {
    show: false,
    presentYear: new Date().getFullYear(),
    changedYear: new Date().getFullYear(),
    showYear: false,
    month: new Date().getMonth(),
    selectedMonth: new Date().getMonth(),
    isFocused: false,
  };

  const years = [];

  const id = props.id;

  const reducer = (state, action) => {
    switch (action.type) {
      case "MONTH_IN_MONTHONLY":
        const defaultDate = props.defaultSelectedMonth
          ? new Date(props.defaultSelectedMonth)
          : new Date();
        return {
          ...state,
          month: defaultDate.getMonth(),
          selectedMonth: defaultDate.getMonth(),
          presentYear: defaultDate.getFullYear(),
          changedYear: defaultDate.getFullYear(),
        };
      case "RESET":
        return {
          ...state,
          presentYear: new Date().getFullYear(),
          changedYear: new Date().getFullYear(),
          showYear: false,
          month: new Date().getMonth(),
          selectedMonth: new Date().getMonth(),
          show: "",
        };
      case "PREVIOUS_YEAR":
        if (state.showYear) {
          return {
            ...state,
            presentYear: state.presentYear - 12,
            changedYear: state.changedYear - 12,
          };
        } else {
          if (state.changedYear === state.presentYear) {
            return {
              ...state,
              presentYear: state.presentYear - 12,
              changedYear: state.changedYear - 1,
            };
          } else {
            return {
              ...state,
              changedYear: state.changedYear - 1,
            };
          }
        }

      case "NEXT_YEAR":
        if (state.showYear) {
          return {
            ...state,
            presentYear: state.presentYear + 12,
            changedYear: state.changedYear + 12,
          };
        } else {
          if (state.changedYear === state.presentYear + 11) {
            return {
              ...state,
              presentYear: state.presentYear + 12,
              changedYear: state.changedYear + 1,
            };
          } else {
            return {
              ...state,
              changedYear: state.changedYear + 1,
            };
          }
        }

      case "TOGGLE_SHOW":
        let showMonth = !state.show;
        if (props.isDisabled || props.isReadOnly) {
          showMonth = "";
        }
        return {
          ...state,
          show: showMonth,
        };

      case "TOGGLE_YEAR":
        return {
          ...state,
          showYear: !state.showYear,
        };

      case "CHANGE_YEAR":
        return {
          ...state,
          changedYear: action.payload,
        };

      case "SELECT_MONTH":
        return {
          ...state,
          month: action.selectedMonth,
          selectedMonth: action.selectedMonth,
          show: false,
        };

      case "CHANGE_MONTH_AND_YEAR":
        const [year, month] = action.payload.split("-").map(Number);
        const newDate = new Date(year, month, 1);

        return {
          ...state,
          month: newDate.getMonth(),
          selectedMonth: newDate.getMonth(),
          changedYear: year,
          presentYear: year,
          show: false,
        };

      case "FOCUS":
        return { ...state, isFocused: true };
      case "BLUR":
        return { ...state, isFocused: false };

      case "HIDE_CALENDAR":
        return { ...state, show: "" };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { month, show, showYear, presentYear, changedYear, selectedMonth } =
    state;

  const handleMonthChange = (event) => {
    const value = event.target.value;

    const regex = /(\d{2})\/(\d{4})/;
    const matches = value.match(regex);

    if (matches && matches.length > 2) {
      const month = parseInt(matches[1]) - 1;
      const year = parseInt(matches[2]);

      dispatch({ type: "CHANGE_MONTH_AND_YEAR", payload: `${year}-${month}` });
    }
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  const handleEnable = () => {
    props.setIsDisabled(!props.isDisabled);
  };

  const handleFocus = () => {
    dispatch({ type: "FOCUS" });
    props.onFocus && props.onFocus();
  };

  const handleBlur = () => {
    dispatch({ type: "BLUR" });
    props.onBlur && props.onBlur();
  };

  const handleShow = () => {
    if (!props.isDisabled || !props.isReadOnly) {
      dispatch({ type: "TOGGLE_SHOW" });
    }
  };

  const handleSelectYear = (year) => {
    dispatch({ type: "CHANGE_YEAR", payload: year });
  };

  const handleYearShow = () => {
    dispatch({ type: "TOGGLE_YEAR" });
  };

  const handlePreviousYear = () => {
    dispatch({ type: "PREVIOUS_YEAR" });
  };

  const handleNextYear = () => {
    dispatch({ type: "NEXT_YEAR" });
  };

  const handleMonthClick = (selectedMonth) => {
    dispatch({ type: "SELECT_MONTH", selectedMonth });
  };

  const handleDocumentClick = (e) => {
    if (!e.target.closest(`#${id}`)) {
      dispatch({ type: "HIDE_CALENDAR" });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    if (props.defaultSelectedMonth) {
      dispatch({ type: "MONTH_IN_MONTHONLY" });
    }
  }, [props.defaultSelectedMonth]);

  for (let i = 0; i < 12; i++) {
    years.push(presentYear + i);
  }

  let placeholderText = "";

  if (props.placeholder) {
    placeholderText = props.placeholder;
  } else {
    placeholderText =
      month < 9
        ? `0${month + 1}/${changedYear}`
        : `${month + 1}/${changedYear}`;
  }

  return (
    <div className={`month-year-picker ${props.className}`}>
      <div className="calendar-wrap" id={id}>
        <div className={`calendar ${show ? "show" : ""}`}>
          {/* ===== month calendar :: begin ===== */}
          <div className="calendar-header">
            <button className="table-btn" onClick={handlePreviousYear}>
              &#x276E;
            </button>
            <p className="year-display" onClick={handleYearShow}>
              {`${showYear ? "Back" : "Year"} ${changedYear}`}
            </p>
            <button className="table-btn" onClick={handleNextYear}>
              &#x276F;
            </button>
          </div>

          <table className={`year-table ${showYear ? "show" : ""}`}>
            <tbody>
              {years.map((year, index) => {
                if (index % 3 === 0) {
                  return (
                    <tr key={index}>
                      <td
                        className={year === changedYear ? "selected" : ""}
                        onClick={() => handleSelectYear(year)}
                      >
                        {year}
                      </td>
                      <td
                        className={
                          years[index + 1] === changedYear ? "selected" : ""
                        }
                        onClick={() => handleSelectYear(years[index + 1])}
                      >
                        {years[index + 1]}
                      </td>
                      <td
                        className={
                          years[index + 2] === changedYear ? "selected" : ""
                        }
                        onClick={() => handleSelectYear(years[index + 2])}
                      >
                        {years[index + 2]}
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>

          <table className="month-table">
            <tbody>
              <tr>
                {months.slice(0, 3).map((month, i) => (
                  <td
                    key={i}
                    className={selectedMonth === i ? "selected" : ""}
                    onClick={() => handleMonthClick(i)}
                  >
                    {month}
                  </td>
                ))}
              </tr>
              <tr>
                {months.slice(3, 6).map((month, i) => (
                  <td
                    key={i}
                    className={selectedMonth === i + 3 ? "selected" : ""}
                    onClick={() => handleMonthClick(i + 3)}
                  >
                    {month}
                  </td>
                ))}
              </tr>
              <tr>
                {months.slice(6, 9).map((month, i) => (
                  <td
                    key={i}
                    className={selectedMonth === i + 6 ? "selected" : ""}
                    onClick={() => handleMonthClick(i + 6)}
                  >
                    {month}
                  </td>
                ))}
              </tr>
              <tr>
                {months.slice(9).map((month, i) => (
                  <td
                    key={i}
                    className={selectedMonth === i + 9 ? "selected" : ""}
                    onClick={() => handleMonthClick(i + 9)}
                  >
                    {month}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          {/* ===== month calendar :: end ===== */}
        </div>
        <div
          className={`text-box ${props.isDisabled ? "disabled" : ""} ${
            show ? "focus" : ""
          } ${props.isReadOnly ? "read-only" : ""}`}
          onClick={handleShow}
          disabled={props.isDisabled || props.isReadOnly}
        >
          {state.isFocused ? (
            <input
              type="text"
              className={month ? "selected" : ""}
              onChange={handleMonthChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={props.isDisabled || props.isReadOnly}
              name={props.name}
              placeholder={props.placeholder ? props.placeholder : "MM/YYYY"}
            />
          ) : (
            <input
              type="text"
              className={month ? "selected" : ""}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onChange={handleMonthChange}
              disabled={props.isDisabled || props.isReadOnly}
              value={
                month < 9
                  ? `0${month + 1}/${changedYear}`
                  : `${month + 1}/${changedYear}`
              }
              name={props.name}
              placeholder={
                props.placeholder
                  ? props.placeholder
                  : props.placeholder
                  ? props.placeholder
                  : "MM/YYYY"
              }
            />
          )}
        </div>
      </div>
      {props.disableControl && (
        <button className="table-btn" onClick={handleEnable}>
          {!props.isDisabled ? "Disable" : "Enable"}
        </button>
      )}

      {props.resetControl && (
        <button className="table-btn" onClick={handleReset}>
          Reset
        </button>
      )}
    </div>
  );
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default VMonth;
