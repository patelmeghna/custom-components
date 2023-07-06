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
    previousMonth: [],
    validateMonth: true,
    hideError: true,
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
          previousMonth: state.previousMonth
            ? [...state.previousMonth, props.defaultSelectedMonth]
            : [props.defaultSelectedMonth],
        };
      case "UNDO":
        return {
          ...state,
          month: new Date(action.payload).getMonth(),
          selectedMonth: new Date(action.payload).getMonth(),
          presentYear: new Date(action.payload).getFullYear(),
          changedYear: new Date(action.payload).getFullYear(),
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
          showYear: false,
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

      case "VALIDATE_MONTH":
        return {
          ...state,
          validateMonth: action.payload,
        };

      case "SHOW_ERROR_MSG":
        const errorToggle = !state.hideError;
        return {
          ...state,
          hideError: errorToggle,
        };
      case "HIDE_ERROR_MSG":
        return {
          ...state,
          hideError: true,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    month,
    show,
    showYear,
    presentYear,
    changedYear,
    selectedMonth,
    validateMonth,
    hideError,
    previousMonth,
  } = state;

  const handleMonthChange = (event) => {
    const value = event.target.value;

    const regex = /(\d{2})\/(\d{4})/;
    const matches = value.match(regex);

    if (matches && matches.length > 2) {
      const month = parseInt(matches[1]) - 1;
      const year = parseInt(matches[2]);

      const dateObject = new Date(year, month);
      if (!props.hideError) {
        const isValidMonth = !isNaN(dateObject) && dateObject instanceof Date;
        dispatch({ type: "VALIDATE_MONTH", payload: isValidMonth });
      }

      dispatch({ type: "CHANGE_MONTH_AND_YEAR", payload: `${year}-${month}` });

      const prevChangeValue =
        month > 9 ? `${year}-${month + 1}` : `${year}-0${month + 1}`;
      if (previousMonth[previousMonth.length - 1] !== prevChangeValue) {
        previousMonth.push(prevChangeValue);
      }
    } else {
      if (!props.hideError) {
        dispatch({ type: "VALIDATE_MONTH", payload: false });
      }
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
      dispatch({ type: "HIDE_ERROR_MSG" });
      dispatch({ type: "VALIDATE_MONTH", payload: true });
    }
  };

  const handleShowError = () => {
    dispatch({ type: "SHOW_ERROR_MSG" });
  };

  function handleClearClick() {
    props.clearClick && props.clearClick();
  }

  const handleUndo = () => {
    let pervious = previousMonth[previousMonth.length - 2];
    if (previousMonth.length > 1) {
      dispatch({ type: "UNDO", payload: pervious });
      previousMonth.pop();
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

  const previousValue =
    month < 9 ? `${changedYear}-0${month + 1}` : `${changedYear}-${month + 1}`;

  useEffect(() => {
    if (!show) {
      if (previousMonth[previousMonth.length - 1] !== previousValue) {
        previousMonth.push(previousValue);
      }
    }
  }, [show]);

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
          className={`text-box${props.isDisabled ? " disabled" : ""}${
            show ? " focus" : ""
          }${validateMonth ? "" : " error"}${
            props.isReadOnly ? " read-only" : ""
          }`}
          disabled={props.isDisabled || props.isReadOnly}
        >
          {state.isFocused ? (
            <input
              onClick={handleShow}
              style={{ padding: "12px" }}
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
              style={{ padding: "12px" }}
              type="text"
              onClick={handleShow}
              className={month ? "selected" : ""}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onChange={handleMonthChange}
              disabled={props.isDisabled || props.isReadOnly}
              value={placeholderText}
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

          {props.isUndo && (
            <button className="icon-btn" onClick={handleUndo}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 512 512"
                id="undo"
              >
                <path d="M447.9 368.2c0-16.8 3.6-83.1-48.7-135.7-35.2-35.4-80.3-53.4-143.3-56.2V96L64 224l192 128v-79.8c40 1.1 62.4 9.1 86.7 20 30.9 13.8 55.3 44 75.8 76.6l19.2 31.2H448c0-10.1-.1-22.9-.1-31.8z"></path>
              </svg>
            </button>
          )}

          {props.isClear && (
            <button onClick={handleClearClick} className="clear-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 16.933 16.933"
                id="eraser-rubber"
              >
                <path
                  d="m 11.113018,281.82981 c -0.338971,0 -0.677844,0.12749 -0.935342,0.38499 l -5.9443407,5.94434 5.1366367,5.13664 5.944341,-5.94434 c 0.515001,-0.515 0.515001,-1.35621 0,-1.8712 l -3.265435,-3.26544 c -0.2575,-0.2575 -0.596887,-0.38499 -0.93586,-0.38499 z m -0.0036,1.67587 a 0.26460982,0.26460982 0 0 1 0.189135,0.078 l 2.646868,2.64687 a 0.26460982,0.26460982 0 0 1 0,0.3731 l -4.7619843,4.76354 a 0.26460982,0.26460982 0 0 1 -0.3751686,0 l -2.646377,-2.64633 a 0.26460982,0.26460982 0 0 1 0,-0.37516 l 4.7635349,-4.76199 a 0.26460982,0.26460982 0 0 1 0.183967,-0.078 z m 0.0036,0.63872 -4.3883607,4.38888 2.271178,2.27118 4.3888787,-4.38836 z m -7.2538194,4.38888 -2.2809984,2.281 c -0.514975,0.51497 -0.514975,1.35622 0,1.8712 l 2.6499678,2.65049 a 0.26460982,0.26460982 0 0 0 0.1875842,0.076 h 2.7285157 a 0.26460982,0.26460982 0 0 0 0.1855179,-0.076 l 1.6660495,-1.66605 z"
                  color="#000"
                  font-family="sans-serif"
                  font-weight="400"
                  overflow="visible"
                  transform="translate(0 -280.067)"
                ></path>
              </svg>
            </button>
          )}
          {!validateMonth && (
            <button onClick={handleShowError} className="error-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32.002"
                height="32"
                viewBox="0 0 32.002 32"
                id="error"
              >
                <path d="M2.062 32h27.812a2 2 0 0 0 1.766-2.942l-13.876-26A1.997 1.997 0 0 0 16.002 2H16c-.738 0-1.414.406-1.762 1.056L.3 29.056a2.004 2.004 0 0 0 .046 1.972A2.005 2.005 0 0 0 2.062 32zM16 24a2 2 0 1 1-.001 4.001A2 2 0 0 1 16 24zm-2-3.968v-8a2 2 0 0 1 4 0v8a2 2 0 0 1-4 0z"></path>
              </svg>
            </button>
          )}
          <p className={`error-msg-wrap${hideError ? " hide" : ""}`}>
            {props.errorMsg ? props.errorMsg : "Invalid value in input"}
          </p>
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
