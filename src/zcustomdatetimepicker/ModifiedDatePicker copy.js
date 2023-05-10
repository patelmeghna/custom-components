import "./zcustomdatetimepicker.css";
import { useReducer, useEffect } from "react";

export default function ModifiedDatePicker(props) {
  // initial value :: begin
  const initialState = {
    currentDate: new Date(),
    selectedStart: null,
    selectedEnd: null,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    show: "",
    selectedHour: null,
    selectedMinute: null,
    selectedEndHour: null,
    selectedEndMinute: null,
    time: "hh:mm",
    endTime: "hh:mm",
    showClock: "",
    showEndClock: "",
    presentYear: new Date().getFullYear(),
    changedYear: new Date().getFullYear(),
    showYear: "",
    timeFormat: "AM",
    endTimeFormat: "AM",
    value: "hi",
    isFocused: false,
    isEndFocused: false,
  };
  // initial value :: end

  // default variables :: begin
  const firstDayOfMonth = new Date(
    initialState.year,
    initialState.month,
    1
  ).getDay();
  const lastDayOfMonth = new Date(
    initialState.year,
    initialState.month + 1,
    0
  ).getDate();
  const numOfRows = Math.ceil((firstDayOfMonth + lastDayOfMonth) / 7);
  const prevMonth = initialState.month === 0 ? 11 : initialState.month + 1;
  const prevYear =
    initialState.month === 0 ? initialState.year + 1 : initialState.year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 20;
  const maxYear = currentYear + 40;
  const monthFormat = new Intl.DateTimeFormat("en-US", { month: "numeric" });
  const monthName = monthFormat.format(
    new Date(initialState.year, initialState.month)
  );
  const yearFormat = new Intl.DateTimeFormat("en-US", { year: "numeric" });
  const yearValue = yearFormat.format(
    new Date(initialState.year, initialState.month)
  );
  const minDate = new Date(props.minimumDate);
  const maxDate = new Date(props.maximumDate);
  const defaultDate = new Date(props.defaultSelectedDate);
  const defaultEnd = new Date(props.defaultEndDate);
  const defaultMonth = new Date(props.defaultSelectedMonth);
  const years = [];
  const yearOptions = [];
  const hourOptions = [];
  const minuteOptions = [];
  let startDate = "";
  let endDate = "";
  const id = props.id;
  // default variables :: end

  // reducer :: begin
  const reducer = (state, action) => {
    switch (action.type) {
      // basic functions :: begin
      case "SET_CURRENT_DATE":
        return {
          ...state,
          currentDate: action.payload,
          month: action.payload.getMonth(),
          year: action.payload.getFullYear(),
        };

      case "SET_MONTH":
        return {
          ...state,
          month: action.payload.getMonth(),
        };

      case "DEFAULT_SELECTED_DATE":
        return {
          ...state,
          selectedStart: defaultDate,
          month: defaultDate.getMonth(),
          year: defaultDate.getFullYear(),
        };

      case "MIN_DATE":
        return {
          ...state,
          month: minDate.getMonth(),
          year: minDate.getFullYear(),
        };

      case "DEFAULT_END":
        return {
          ...state,
          selectedEnd: defaultEnd,
        };

      case "MONTH_IN_MONTHONLY":
        return {
          ...state,
          month: defaultMonth.getMonth(),
          presentYear: defaultMonth.getFullYear(),
          changedYear: defaultMonth.getFullYear(),
        };

      case "DEFAULT_TIME":
        return {
          time: props.defaultSelectedTime,
          selectedHour: state.hour,
          selectedMinute: state.minute,
          selectedStart: defaultDate,
          month: defaultDate.getMonth(),
          year: defaultDate.getFullYear(),
        };

      case "CHANGE_END_HOUR":
        return {
          ...state,
          selectedEndHour: action.payload,
        };

      case "CHANGE_END_MINUTE":
        return {
          ...state,
          selectedEndMinute: action.payload,
        };

      case "CHANGE_HOUR":
        return {
          ...state,
          selectedHour: action.payload,
        };

      case "CHANGE_MINUTE":
        return {
          ...state,
          selectedMinute: action.payload,
        };

      case "PREVIOUS":
        let newMonth = state.month - 1;
        let newYear = state.year;
        if (newMonth === -1) {
          newMonth = 11;
          newYear -= 1;
        }
        return {
          ...state,
          month: newMonth,
          year: newYear,
        };

      case "NEXT":
        let nextMonth = state.month + 1;
        let nextYear = state.year;
        if (nextMonth === 12) {
          nextYear += 1;
          nextMonth = 0;
        }
        return {
          ...state,
          month: nextMonth,
          year: nextYear,
        };

      case "TOGGLE_SHOW":
        return {
          ...state,
          show: state.show === "" ? "show" : "",
        };

      case "TOGGLE_SHOW_END":
        return {
          ...state,
          show: state.show === "" ? "show-end" : "",
        };

      case "TOGGLE_SHOW_CLOCK":
        return {
          ...state,
          showClock: state.showClock === "" ? "show" : "",
        };

      case "TOGGLE_SHOW_END_CLOCK":
        return {
          ...state,
          showEndClock: state.showEndClock === "" ? "show" : "",
        };

      case "RESET":
        return {
          ...state,
          selectedStart: null,
          selectedEnd: null,
          month: state.currentDate.getMonth(),
          year: state.currentDate.getFullYear(),
          time: "hh:mm",
          endTime: "hh:mm",
          selectedHour: null,
          selectedMinute: null,
          selectedEndHour: null,
          selectedEndMinute: null,
          show: "",
          showClock: "",
          showEndClock: "",
          showYear: "",
        };

      case "CHANGE_YEAR":
        return {
          ...state,
          changedYear: action.payload,
        };

      case "TOGGLE_YEAR":
        return {
          ...state,
          showYear: state.showYear === "" ? "show" : "",
        };
      // basic functions :: end

      // year change in monthOnly :: begin
      case "PREVIOUS_YEAR":
        if (state.showYear === "show") {
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
        if (state.showYear === "show") {
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
      // year change in monthOnly :: end

      // month change :: begin
      case "CHANGE_MONTH":
        let newChangeMonth = parseInt(action.payload);
        let newSelectedMonth = parseInt(action.payload);
        console.log(minDate.getFullYear());
        if (minDate.getFullYear() === state.year) {
          if (minDate.getMonth() > newChangeMonth) {
            newChangeMonth = minDate.getMonth();
            newSelectedMonth = minDate.getMonth();
          }
        }
        if (maxDate.getFullYear() === state.year) {
          if (maxDate.getMonth() < newChangeMonth) {
            newChangeMonth = maxDate.getMonth();
            newSelectedMonth = maxDate.getMonth();
          }
        }
        if (state.show === "show-end") {
          if (new Date(state.selectedStart).getMonth() === state.year) {
            if (new Date(state.selectedStart).getMonth() > newChangeMonth) {
              newChangeMonth = new Date(state.selectedStart).getMonth();
              newSelectedMonth = new Date(state.selectedStart).getMonth();
            }
          }
        }
        return {
          ...state,
          month: newChangeMonth,
          selectedMonth: newSelectedMonth,
        };
      // month change :: end

      // year change :: begin
      case "CHANGE_YEAR_LIST":
        let setYear = parseInt(action.payload);
        let setSelectedYear = parseInt(action.payload);
        let listChangeMonth = state.month;
        let listSelectedMonth = state.selectedMonth;
        if (minDate.getFullYear() > setYear) {
          setYear = minDate.getFullYear();
          setSelectedYear = minDate.getFullYear();
        }
        if (maxDate.getFullYear() < setYear) {
          setYear = maxDate.getFullYear();
          setSelectedYear = maxDate.getFullYear();
        }
        if (setYear === maxDate.getFullYear()) {
          if (state.month > maxDate.getMonth()) {
            listChangeMonth = maxDate.getMonth();
            listSelectedMonth = maxDate.getMonth();
          }
        }
        if (setYear === minDate.getFullYear()) {
          if (state.month < minDate.getMonth()) {
            listChangeMonth = minDate.getMonth();
            listSelectedMonth = minDate.getMonth();
          }
        }
        if (state.show === "show-end") {
          if (new Date(state.selectedStart).getFullYear() > setYear) {
            setYear = new Date(state.selectedStart).getFullYear();
            setSelectedYear = new Date(state.selectedStart).getFullYear();
          }

          if (setYear === new Date(state.selectedStart).getFullYear()) {
            if (state.month < new Date(state.selectedStart).getMonth()) {
              listChangeMonth = new Date(state.selectedStart).getMonth();
              listSelectedMonth = new Date(state.selectedStart).getMonth();
            }
          }
        }
        return {
          ...state,
          month: listChangeMonth,
          selectedMonth: listSelectedMonth,
          year: setYear,
          selectedYear: setSelectedYear,
        };
      // year change :: end

      // time format :: begin
      case "FORMAT_CHANGE":
        if (props.clockTimeFormat === "am-pm") {
          return {
            ...state,
            timeFormat: state.timeFormat === "AM" ? "PM" : "AM",
          };
        } else {
          return {
            ...state,
            timeFormat: "",
          };
        }

      case "FORMAT_END_CHANGE":
        if (props.clockTimeFormat === "am-pm") {
          return {
            ...state,
            endTimeFormat: state.endTimeFormat === "AM" ? "PM" : "AM",
          };
        } else {
          return {
            ...state,
            endTimeFormat: "",
          };
        }
      // time format :: end

      // apply event handler :: begin
      case "APPLY":
        let toggleTime = state.show;
        let newTimeFormat = state.timeFormat;
        let newEndTimeFormat = state.endTimeFormat;
        if (props.clockTimeFormat !== "am-pm") {
          newTimeFormat = "";
          newEndTimeFormat = "";
        }
        if (props.selectedMode === "dateTime") {
          toggleTime = "";
        } else {
          toggleTime = "show-end";
        }
        if (state.show === "show") {
          // start date selection :: begin
          if (state.selectedHour && state.selectedMinute) {
            if (state.selectedHour < 10 && state.selectedHour.length === 1) {
              return {
                ...state,
                time: `0${state.selectedHour}:${state.selectedMinute} ${newTimeFormat}`,
                show: toggleTime,
              };
            }
            if (
              state.selectedMinute < 10 &&
              state.selectedMinute.length === 1
            ) {
              return {
                ...state,
                time: `${state.selectedHour}:0${state.selectedMinute} ${newTimeFormat}`,
                show: toggleTime,
              };
            }
            if (
              state.selectedHour < 10 &&
              state.selectedHour.length === 1 &&
              state.selectedMinute < 10 &&
              state.selectedMinute.length === 1
            ) {
              return {
                ...state,
                time: `0${state.selectedHour}:0${state.selectedMinute} ${newTimeFormat}`,
                show: toggleTime,
              };
            }

            return {
              ...state,
              time: `${state.selectedHour}:${state.selectedMinute} ${newTimeFormat}`,
              show: toggleTime,
            };
          }
          if (state.selectedHour !== null && state.selectedMinute === null) {
            if (state.selectedHour < 10 && state.selectedHour.length === 1) {
              return {
                ...state,
                time: `0${state.selectedHour}:00 ${newTimeFormat}`,
                show: toggleTime,
              };
            }

            return {
              ...state,
              time: `${state.selectedHour}:00 ${newTimeFormat}`,
              show: toggleTime,
            };
          }
          if (state.selectedHour === null && state.selectedMinute !== null) {
            if (
              state.selectedMinute < 10 &&
              state.selectedMinute.length === 1
            ) {
              return {
                ...state,
                time: `24:0${state.selectedMinute} ${newTimeFormat}`,
                show: toggleTime,
                selectedHour: "24",
              };
            }

            return {
              ...state,
              time: `24:${state.selectedMinute} ${newTimeFormat}`,
              show: toggleTime,
              selectedHour: "24",
            };
          }
          if (
            (state.time === null && state.selectedStart === null) ||
            (state.time === "hh:mm" && state.selectedStart === null) ||
            state.selectedStart === null
          ) {
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                selectedStart: new Date(),
                selectedHour: "12",
                selectedMinute: "00",
                time: `12:00 ${newTimeFormat}`,
                show: toggleTime,
              };
            } else {
              return {
                ...state,
                selectedStart: new Date(),
                selectedHour: "00",
                selectedMinute: "00",
                time: `00:00 ${newTimeFormat}`,
                show: toggleTime,
              };
            }
          }
          if (state.selectedStart !== null) {
            if (state.time === null || state.time === "hh:mm") {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  selectedHour: "12",
                  selectedMinute: "00",
                  time: `12:00 ${newTimeFormat}`,
                  show: toggleTime,
                };
              } else {
                return {
                  ...state,
                  selectedHour: "00",
                  selectedMinute: "00",
                  time: `00:00 ${newTimeFormat}`,
                  show: toggleTime,
                };
              }
            }
            if (state.time !== null || state.time !== "hh:mm") {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  selectedHour: state.selectedHour,
                  selectedMinute: state.selectedMinute,
                  time: `${state.selectedHour}:${state.selectedMinute} ${newTimeFormat}`,
                  show: toggleTime,
                };
              } else {
                return {
                  ...state,
                  selectedHour: state.selectedHour,
                  selectedMinute: state.selectedMinute,
                  time: `${state.selectedHour}:${state.selectedMinute} ${newTimeFormat}`,
                  show: toggleTime,
                };
              }
            }
          }
          // start date selection :: end
        } else {
          // end date selection :: begin
          if (state.selectedEndHour && state.selectedEndMinute) {
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1
            ) {
              return {
                ...state,
                endTime: `0${state.selectedEndHour}:${state.selectedEndMinute} ${newEndTimeFormat}`,
                show: "",
              };
            }
            if (
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1
            ) {
              return {
                ...state,
                endTime: `${state.selectedEndHour}:0${state.selectedEndMinute} ${newEndTimeFormat}`,
                show: "",
              };
            }
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1 &&
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1
            ) {
              return {
                ...state,
                endTime: `0${state.selectedEndHour}:0${state.selectedEndMinute} ${newEndTimeFormat}`,
                show: "",
              };
            }

            return {
              ...state,
              endTime: `${state.selectedEndHour}:${state.selectedEndMinute} ${newEndTimeFormat}`,
              show: "",
            };
          }
          if (
            state.selectedEndHour !== null &&
            state.selectedEndMinute === null
          ) {
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1
            ) {
              return {
                ...state,
                endTime: `0${state.selectedEndHour}:00 ${newEndTimeFormat}`,
                show: "",
              };
            }
            return {
              ...state,
              endTime: `${state.selectedEndHour}:00 ${newEndTimeFormat}`,
              show: "",
            };
          }
          if (
            state.selectedEndHour === null &&
            state.selectedEndMinute !== null
          ) {
            if (
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `11:0${state.selectedEndMinute} ${newEndTimeFormat}`,
                  selectedHour: "11",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `23:0${state.selectedEndMinute} ${newEndTimeFormat}`,
                  selectedHour: "23",
                  show: "",
                };
              }
            }
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                endTime: `11:${state.selectedEndMinute} ${newEndTimeFormat}`,
                selectedHour: "11",
                show: "",
              };
            } else {
              return {
                ...state,
                endTime: `23:${state.selectedEndMinute} ${newEndTimeFormat}`,
                selectedHour: "23",
                show: "",
              };
            }
          }
          if (
            (state.endTime === null && state.selectedEnd === null) ||
            (state.endTime === "hh:mm" && state.selectedEnd === null) ||
            state.selectedEnd === null
          ) {
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                selectedEnd: state.selectedStart,
                selectedEndHour: "11",
                selectedEndMinute: "59",
                endTime: `11:59 ${newTimeFormat}`,
                show: "",
              };
            } else {
              return {
                ...state,
                selectedEnd: state.selectedStart,
                selectedEndHour: "23",
                selectedEndMinute: "59",
                endTime: `23:59 ${newTimeFormat}`,
                show: "",
              };
            }
          }
          if (state.selectedEnd) {
            if (state.endTime === null || state.endTime === "hh:mm") {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  selectedEndHour: "11",
                  selectedEndMinute: "59",
                  endTime: `11:59 ${newTimeFormat}`,
                  show: "",
                };
              } else {
                return {
                  ...state,
                  selectedEndHour: "23",
                  selectedEndMinute: "59",
                  endTime: `23:59 ${newTimeFormat}`,
                  show: "",
                };
              }
            }
          }
          if (state.endTime !== null || state.endTime !== "hh:mm") {
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                selectedEndHour: state.selectedEndHour,
                selectedEndMinute: state.selectedEndMinute,
                endTime: `${state.selectedEndHour}:${state.selectedEndMinute} ${newTimeFormat}`,
                show: "",
              };
            } else {
              return {
                ...state,
                selectedEndHour: state.selectedEndHour,
                selectedEndMinute: state.selectedEndMinute,
                endTime: `${state.selectedEndHour}:${state.selectedEndMinute} ${newTimeFormat}`,
                show: "",
              };
            }
          }
          // end date selection :: end
        }
      // apply event handler :: end

      // date select :: begin
      case "SELECT_DATE":
        let toggle = state.show;
        if (state.showClock === "") {
          toggle = "";
        }
        const selected = new Date(action.year, action.month, action.day);
        if (
          props.selectedMode === "range" ||
          props.selectedMode === "dateTimeRange"
        ) {
          if (state.show === "show") {
            return {
              ...state,
              selectedStart: selected,
              show: state.showClock === "" ? "show-end" : "show",
            };
          } else {
            return {
              ...state,
              selectedEnd: selected,
              show: state.showEndClock === "" ? "" : state.show,
            };
          }
        } else {
          return {
            ...state,
            selectedStart: selected,
            selectedEnd: null,
            show: toggle,
          };
        }
      // date select :: end

      // basic functionalities of monthOnly :: begin
      case "SELECT_MONTH":
        return {
          ...state,
          month: action.selectedMonth,
          selectedMonth: action.selectedMonth,
          show: "",
        };

      case "HIDE_CALENDAR":
        return {
          ...state,
          show: "",
          showYear: "",
        };
      // basic functionalities of monthOnly :: end

      // set input value into selectedStart :: begin
      case "SET_SELECTED_START":
        return {
          ...state,
          show: "",
          selectedStart: action.payload,
          month: action.payload.getMonth(),
          year: action.payload.getFullYear(),
        };
      // set input value into selectedStart :: end

      // set input value into selectedStart :: begin
      case "SET_SELECTED_END":
        return {
          ...state,
          show: "",
          selectedEnd: action.payload,
          month: action.payload.getMonth(),
          year: action.payload.getFullYear(),
        };
      // set input value into selectedStart :: end

      case "REMOVE_END_DATE":
        return { ...state, selectedEnd: null };

      case "FOCUS":
        return { ...state, isFocused: true };
      case "BLUR":
        return { ...state, isFocused: false };
      case "FOCUS_ON_END":
        return { ...state, isEndFocused: true };
      case "BLUR_ON_END":
        return { ...state, isEndFocused: false };
      default:
        return state;
    }
  };
  // reducer :: end

  // reducer hook :: begin
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    currentDate,
    month,
    year,
    show,
    showClock,
    selectedStart,
    selectedEnd,
    selectedHour,
    selectedMinute,
    selectedEndHour,
    selectedEndMinute,
    time,
    endTime,
    showEndClock,
    presentYear,
    timeFormat,
    endTimeFormat,
  } = state;
  // reducer hook :: end

  // handle event listeners :: begin
  const handleFormatChange = () => {
    dispatch({ type: "FORMAT_CHANGE" });
  };

  const handleEndFormatChange = () => {
    dispatch({ type: "END_FORMAT_CHANGE" });
  };

  const handleEndHourChange = (e) => {
    dispatch({ type: "CHANGE_END_HOUR", payload: e.target.value });
  };

  const handleEndMinuteChange = (e) => {
    dispatch({ type: "CHANGE_END_MINUTE", payload: e.target.value });
  };

  const handleHourChange = (e) => {
    dispatch({ type: "CHANGE_HOUR", payload: e.target.value });
  };

  const handleMinuteChange = (e) => {
    dispatch({ type: "CHANGE_MINUTE", payload: e.target.value });
  };

  const handlePrevious = () => {
    dispatch({ type: "PREVIOUS" });
  };

  const handleNext = () => {
    dispatch({ type: "NEXT" });
  };

  const handleShow = () => {
    if (!props.isDisabled || !props.isReadOnly) {
      dispatch({ type: "TOGGLE_SHOW" });
    }
  };

  const handleShowEnd = () => {
    if (!props.isDisabled || !props.isReadOnly) {
      dispatch({ type: "TOGGLE_SHOW_END" });
    }
  };

  const handleShowClock = () => {
    dispatch({ type: "TOGGLE_SHOW_CLOCK" });
  };

  const handleShowEndClock = () => {
    dispatch({ type: "TOGGLE_SHOW_END_CLOCK" });
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  const handleEnable = () => {
    props.setIsDisabled(!props.isDisabled);
  };

  const handleMonthChange = (e) => {
    dispatch({ type: "CHANGE_MONTH", payload: e.target.value });
  };

  const handleYearChange = (e) => {
    dispatch({ type: "CHANGE_YEAR_LIST", payload: e.target.value });
  };

  const handleApply = () => {
    dispatch({ type: "APPLY" });
  };

  const handleDayClick = (day) => {
    dispatch({
      type: "SELECT_DATE",
      year,
      month,
      day,
    });
  };

  const handleDocumentClick = (e) => {
    if (!e.target.closest(`#${id}`)) {
      dispatch({ type: "HIDE_CALENDAR" });
    }
  };
  // handle event listeners :: end

  // useEffect hook :: begin
  useEffect(() => {
    props.onChange && props.onChange(selectedStart);
  }, [selectedStart]);

  useEffect(() => {
    props.onEndChange && props.onEndChange(selectedEnd);
  }, [selectedEnd]);

  useEffect(() => {
    if (
      props.selectedMode !== "range" ||
      props.selectedMode !== "dateTimeRange"
    ) {
      dispatch({ type: "REMOVE_END_DATE" });
    }
  }, [props.selectedMode]);

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  let prevBtn = (
    <button className="table-btn" onClick={handlePrevious}>
      &#x276E;
    </button>
  );

  useEffect(() => {
    if (props.defaultSelectedDate) {
      dispatch({ type: "DEFAULT_SELECTED_DATE" });
    }
  }, [props.defaultSelectedDate]);

  useEffect(() => {
    if (props.minimumDate) {
      dispatch({ type: "MIN_DATE" });
    }
  }, [props.minimumDate]);

  useEffect(() => {
    if (props.defaultEndDate) {
      dispatch({ type: "DEFAULT_END" });
    }
  }, [props.defaultEndDate]);

  useEffect(() => {
    if (props.defaultSelectedMonth && props.monthOnly) {
      dispatch({ type: "MONTH_IN_MONTHONLY" });
    }
  }, [props.defaultSelectedMonth, props.monthOnly]);

  useEffect(() => {
    if (props.defaultSelectedTime) {
      const [hour, minute] = props.defaultSelectedTime.split(":");
      dispatch({ type: "DEFAULT_TIME" });
    }
  }, [props.defaultSelectedTime]);
  // useEffect hook :: end

  // logics for calendar :: begin
  for (let i = minYear; i <= maxYear; i++) {
    yearOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  if (props.clockTimeFormat) {
    for (let i = 1; i <= 12; i++) {
      hourOptions.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }
  } else {
    for (let i = 0; i < 24; i++) {
      hourOptions.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }
  }

  for (let i = 0; i < 60; i++) {
    minuteOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  const str = props.format || "DD/MM/YYYY";
  const separator = str.includes("/")
    ? "/"
    : str.includes("-")
    ? "-"
    : str.includes(".")
    ? "."
    : "";

  let startDateNumber;
  if (selectedStart?.getDate() < 10) {
    startDateNumber = `0${selectedStart?.getDate()}`;
  } else {
    startDateNumber = selectedStart?.getDate();
  }

  let startMonthNumber;
  if (selectedStart?.getMonth() < 9) {
    startMonthNumber = `0${selectedStart?.getMonth() + 1}`;
  } else {
    startMonthNumber = selectedStart?.getMonth() + 1;
  }

  const startDateFormat = (str, separator) => {
    const stringMap = {
      DD: startDateNumber || "DD",
      MM: startMonthNumber || "MM",
      YYYY: selectedStart?.getFullYear() || "YYYY",
    };

    return str
      .toLowerCase()
      .split(separator)
      .map((word) => stringMap[word.toUpperCase()])
      .join(separator);
  };

  startDate = startDateFormat(str, separator);

  let endDateNumber;
  if (selectedEnd?.getDate() < 10) {
    endDateNumber = `0${selectedEnd?.getDate()}`;
  } else {
    endDateNumber = selectedEnd?.getDate();
  }

  let endMonthNumber;
  if (selectedEnd?.getMonth() < 9) {
    endMonthNumber = `0${selectedEnd?.getMonth() + 1}`;
  } else {
    endMonthNumber = selectedEnd?.getMonth() + 1;
  }

  const endDateFormat = (str, separator) => {
    const stringMap = {
      DD: endDateNumber || "DD",
      MM: endMonthNumber || "MM",
      YYYY: selectedEnd?.getFullYear() || "YYYY",
    };

    return str
      .toLowerCase()
      .split(separator)
      .map((word) => stringMap[word.toUpperCase()])
      .join(separator);
  };

  endDate = endDateFormat(str, separator);

  if (show === "show") {
    if (month === minDate.getMonth() && year === minDate.getFullYear()) {
      prevBtn = (
        <button disabled className="table-btn" onClick={handlePrevious}>
          &#x276E;
        </button>
      );
    } else {
      prevBtn = "";
    }
  } else if (show === "show-end") {
    if (month === new Date(selectedStart).getMonth()) {
      prevBtn = (
        <button disabled className="table-btn" onClick={handlePrevious}>
          &#x276E;
        </button>
      );
    } else {
      prevBtn = "";
    }
  }

  for (let i = 0; i < 12; i++) {
    years.push(presentYear + i);
  }
  // logics for calendar :: end

  /* =================================
     =================================
     function for input value :: begin
     =================================
     ================================= */
  const handleDateChange = (event) => {
    const value = event.target.value;
    const format = props.format || "DD/MM/YYYY";

    const str = format
      .replace("DD", "\\d{2}")
      .replace("MM", "\\d{2}")
      .replace("YYYY", "\\d{4}");

    const regex = new RegExp(`^${str}$`);

    if (value.match(regex)) {
      const dd = value.slice(format.indexOf("DD"), format.indexOf("DD") + 2);
      const mm = value.slice(format.indexOf("MM"), format.indexOf("MM") + 2);
      const yyyy = value.slice(
        format.indexOf("YYYY"),
        format.indexOf("YYYY") + 4
      );

      const dateArr = [yyyy, mm, dd];
      const rearrangedDateStr = dateArr.join("-");

      dispatch({
        type: "SET_SELECTED_START",
        payload: new Date(rearrangedDateStr),
      });
    }
  };
  function handleFocus() {
    dispatch({ type: "FOCUS" });
    props.onFocus && props.onFocus();
  }

  function handleBlur() {
    dispatch({ type: "BLUR" });
    props.onBlur && props.onBlur();
  }

  const handleEndDateChange = (event) => {
    const value = event.target.value;
    const format = props.format || "DD/MM/YYYY";

    const str = format
      .replace("DD", "\\d{2}")
      .replace("MM", "\\d{2}")
      .replace("YYYY", "\\d{4}");

    const regex = new RegExp(`^${str}$`);

    if (value.match(regex)) {
      const dd = value.slice(format.indexOf("DD"), format.indexOf("DD") + 2);
      const mm = value.slice(format.indexOf("MM"), format.indexOf("MM") + 2);
      const yyyy = value.slice(
        format.indexOf("YYYY"),
        format.indexOf("YYYY") + 4
      );

      const dateArr = [yyyy, mm, dd];
      const rearrangedDateStr = dateArr.join("-");

      dispatch({
        type: "SET_SELECTED_END",
        payload: new Date(rearrangedDateStr),
      });
    }
  };
  function handleEndFocus() {
    dispatch({ type: "FOCUS_ON_END" });
    props.onEndFocus && props.onEndFocus();
  }

  function handleEndBlur() {
    dispatch({ type: "BLUR_ON_END" });
    props.onEndBlur && props.onEndBlur();
  }

  /* =================================
     =================================
     function for input value :: end
     =================================
     ================================= */
  return (
    <div className={props.className} style={props.style}>
      <div className="calendar-wrap" id={id}>
        <div className={`calendar ${show}`}>
          <>
            {/* ===== calendar :: begin ===== */}
            <div className="calendar-header">
              <>
                {prevBtn}
                <div>
                  <select
                    className="table-select"
                    value={month}
                    onChange={handleMonthChange}
                  >
                    {months.map((month, index) => {
                      return <option value={index}>{month}</option>;
                    })}
                  </select>

                  <select
                    className="table-select"
                    value={year}
                    onChange={handleYearChange}
                  >
                    {yearOptions}
                  </select>
                </div>
                {month === maxDate.getMonth() &&
                year === maxDate.getFullYear() ? (
                  <button disabled className="table-btn" onClick={handleNext}>
                    &#x276F;
                  </button>
                ) : (
                  <button className="table-btn" onClick={handleNext}>
                    &#x276F;
                  </button>
                )}
              </>
            </div>
            {/* ===== calendar :: end ===== */}

            {/* ===== date time table :: begin ===== */}
            <table className="date-time-table">
              <thead>
                <tr className="table-head">
                  {weekdays.map((weekday) => (
                    <th className="table-header" key={weekday}>
                      {weekday}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(numOfRows)
                  .fill()
                  .map((row, i) => (
                    <tr key={i}>
                      {Array(7)
                        .fill()
                        .map((col, j) => {
                          const day = i * 7 + j + 1 - firstDayOfMonth;
                          if (i === 0 && day < 1) {
                            return (
                              <td key={j} className="next-prev-month">
                                {daysInPrevMonth + day}
                              </td>
                            );
                          }
                          if (day > lastDayOfMonth) {
                            return (
                              <td key={j} className="disabled next-prev-month">
                                {day - lastDayOfMonth}
                              </td>
                            );
                          }

                          const currentDate = new Date(year, month, day);

                          return (
                            <td
                              key={j}
                              className={`day ${
                                day < 1 || day > lastDayOfMonth
                                  ? "disabled"
                                  : selectedStart &&
                                    selectedEnd &&
                                    selectedStart <=
                                      new Date(year, month, day) &&
                                    selectedEnd >= new Date(year, month, day)
                                  ? day === selectedStart.getDate() &&
                                    month === selectedStart.getMonth() &&
                                    year === selectedStart.getFullYear()
                                    ? "first-date"
                                    : day === selectedEnd.getDate() &&
                                      month === selectedEnd.getMonth() &&
                                      year === selectedEnd.getFullYear()
                                    ? "last-date"
                                    : "in-range"
                                  : selectedStart &&
                                    selectedStart.getDate() === day &&
                                    selectedStart.getMonth() === month &&
                                    selectedStart.getFullYear() === year
                                  ? "start-range"
                                  : selectedEnd &&
                                    selectedEnd.getTime() ===
                                      new Date(year, month, day).getTime()
                                  ? "end-range"
                                  : day === currentDate.getDate() &&
                                    month === currentDate.getMonth() &&
                                    year === currentDate.getFullYear()
                                  ? "current"
                                  : ""
                              } ${currentDate < minDate ? "disabled" : ""} ${
                                currentDate > maxDate ? "disabled" : ""
                              }${
                                selectedStart &&
                                new Date(year, month, day) < selectedStart
                                  ? show === "show-end" && "disabled"
                                  : ""
                              }`}
                              onClick={() => handleDayClick(day)}
                            >
                              {day > 0 && day <= lastDayOfMonth ? day : ""}
                            </td>
                          );
                        })}
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* ===== date time table :: end ===== */}

            {/* ===== display value :: begin ===== */}
            <div
              className={`time-range-wrap ${
                show === "show"
                  ? showClock === "show" && "show"
                  : show === "show-end"
                  ? showEndClock === "show" && "show-end"
                  : ""
              }`}
            >
              <div className="time-wrap">
                {(props.selectedMode === "dateTimeRange" ||
                  props.selectedMode === "dateTime") && (
                  <div className="clock-wrap">
                    <button
                      className="clock-btn"
                      onClick={
                        show === "show"
                          ? handleShowClock
                          : show === "show-end"
                          ? handleShowEndClock
                          : ""
                      }
                    >
                      🕒
                    </button>
                    {showClock === "show" ? (
                      <div className="show-clock">
                        <select
                          className="table-select"
                          value={selectedHour}
                          onChange={handleHourChange}
                        >
                          {hourOptions}
                        </select>
                        <span>:</span>
                        <select
                          className="table-select"
                          value={selectedMinute}
                          onChange={handleMinuteChange}
                        >
                          {minuteOptions}
                        </select>
                        {props.clockTimeFormat === "am-pm" && (
                          <button
                            className="format-btn"
                            onClick={handleFormatChange}
                          >
                            {timeFormat}
                          </button>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    {showEndClock === "show" ? (
                      <div className="show-end-clock">
                        <select
                          className="table-select"
                          value={selectedEndHour}
                          onChange={handleEndHourChange}
                        >
                          {hourOptions}
                        </select>
                        <span>:</span>
                        <select
                          className="table-select"
                          value={selectedEndMinute}
                          onChange={handleEndMinuteChange}
                        >
                          {minuteOptions}
                        </select>

                        {props.clockTimeFormat === "am-pm" && (
                          <button
                            className="format-btn"
                            onClick={handleEndFormatChange}
                          >
                            {endTimeFormat}
                          </button>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
              <div className="calendar-bottom-btn">
                <button className="table-btn btn-gray" onClick={handleReset}>
                  Clear
                </button>
                <button className="table-btn" onClick={handleApply}>
                  Apply
                </button>
              </div>
            </div>
            {/* ===== display value :: end ===== */}
          </>
        </div>
        {/* ===== display value :: begin ===== */}
        <div
          className={
            (props.selectedMode === "range" ||
              props.selectedMode === "dateTimeRange") &&
            "date-selection-input-wrap"
          }
        >
          <div
            className={
              props.monthOnly
                ? "d-none"
                : `text-box ${props.isDisabled ? "disabled" : ""} ${
                    show === "show" ? "focus" : ""
                  } ${props.isReadOnly ? "read-only" : ""}`
            }
            onClick={handleShow}
            disabled={props.isDisabled || props.isReadOnly}
          >
            {state.isFocused ? (
              <input
                style={{ padding: "12px" }}
                type="text"
                onChange={handleDateChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={selectedStart ? "selected" : ""}
                placeholder={props.format ? props.format : "DD/MM/YYYY"}
              />
            ) : (
              <input
                style={{ padding: "12px" }}
                type="text"
                value={`${selectedStart ? startDate : ""}${
                  props.selectedMode ? (showClock !== "" ? ` ${time}` : "") : ""
                }`}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={selectedStart ? "selected" : ""}
                placeholder={props.format ? props.format : "DD/MM/YYYY"}
              />
            )}
          </div>
          <div
            className={
              props.selectedMode === "range" ||
              props.selectedMode === "dateTimeRange"
                ? `text-box ${props.isDisabled ? "disabled" : ""} ${
                    show === "show-end" ? "focus" : ""
                  } ${props.isReadOnly ? "read-only" : ""}`
                : "d-none"
            }
            onClick={handleShowEnd}
            disabled={props.isDisabled || props.isReadOnly}
          >
            {state.isEndFocused ? (
              <input
                style={{ padding: "12px" }}
                type="text"
                onChange={handleEndDateChange}
                onBlur={handleEndBlur}
                onFocus={handleEndFocus}
                className={selectedEnd ? "selected" : ""}
                placeholder={props.format ? props.format : "DD/MM/YYYY"}
              />
            ) : (
              <input
                style={{ padding: "12px" }}
                type="text"
                value={`${
                  selectedEnd >= selectedStart && selectedEnd
                    ? `${endDate}`
                    : ""
                }${
                  props.selectedMode
                    ? showEndClock !== ""
                      ? ` ${endTime}`
                      : ""
                    : ""
                }`}
                onBlur={handleEndBlur}
                onFocus={handleEndFocus}
                className={selectedEnd ? "selected" : ""}
                placeholder={props.format ? props.format : "DD/MM/YYYY"}
              />
            )}
          </div>
        </div>
        {/* ===== display value :: end ===== */}
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
}

const MonthOnly = (props) => {
  const initialState = {
    show: "",
    presentYear: new Date().getFullYear(),
    changedYear: new Date().getFullYear(),
    showYear: "",
    month: new Date().getMonth(),
    selectedMonth: new Date().getMonth(),
  };
  const years = [];
  const id = props.id;

  const reducer = (state, action) => {
    switch (action.type) {
      case "MONTH_IN_MONTHONLY":
        return {
          ...state,
          month: state.defaultMonth.getMonth(),
          presentYear: state.defaultMonth.getFullYear(),
          changedYear: state.defaultMonth.getFullYear(),
        };
      case "PREVIOUS_YEAR":
        if (state.showYear === "show") {
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
        if (state.showYear === "show") {
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
        return {
          ...state,
          show: state.show === "" ? "show" : "",
        };

      case "TOGGLE_YEAR":
        return {
          ...state,
          showYear: state.showYear === "" ? "show" : "",
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
          show: "",
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { month, show, showYear, presentYear, changedYear, selectedMonth } =
    state;

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
    if (props.defaultSelectedMonth && props.monthOnly) {
      dispatch({ type: "MONTH_IN_MONTHONLY" });
    }
  }, [props.defaultSelectedMonth, props.monthOnly]);

  for (let i = 0; i < 12; i++) {
    years.push(presentYear + i);
  }

  return (
    <div className={props.className}>
      <div className="calendar-wrap" id={id}>
        <div className={`calendar ${show}`}>
          {/* ===== month calendar :: begin ===== */}
          <div className="calendar-header">
            <button className="table-btn" onClick={handlePreviousYear}>
              &#x276E;
            </button>
            <p className="year-display" onClick={handleYearShow}>
              {`${showYear === "" ? "Year" : "Back"} ${changedYear}`}
            </p>
            <button className="table-btn" onClick={handleNextYear}>
              &#x276F;
            </button>
          </div>

          <table className={`year-table ${showYear}`}>
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
                    className={selectedMonth === i + 4 ? "selected" : ""}
                    onClick={() => handleMonthClick(i + 4)}
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
            show !== "" ? "focus" : ""
          } ${props.isReadOnly ? "read-only" : ""}`}
          onClick={handleShow}
          disabled={props.isDisabled || props.isReadOnly}
        >
          <input
            type="text"
            className={month ? "selected" : ""}
            onChange={(e) => e.preventDefault}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
            value={
              month < 10
                ? ` 0${month + 1}/${changedYear}`
                : ` ${month + 1}/${changedYear}`
            }
          />
        </div>
      </div>
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

export { MonthOnly };
