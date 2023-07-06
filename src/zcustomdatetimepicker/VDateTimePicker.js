import "./zcustomdatetimepicker.css";
import { useReducer, useEffect } from "react";
import error from "./error.svg";
import clear from "./clear.svg";
import undo from "./undo.svg";

export default function VDateTimePicker(props) {
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
    selectedHour: new Date().getHours(),
    selectedMinute: new Date().getMinutes(),
    selectedEndHour: new Date().getHours(),
    selectedEndMinute: new Date().getMinutes(),
    time: "",
    endTime: "",
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
    previousSelectedStartDate: [],
    previousSelectedEndDate: [],
    undoDate: "",
    selectedSecond: new Date().getSeconds(),
    selectedEndSecond: new Date().getSeconds(),
    validateStart: true,
    validateEnd: true,
    hideError: true,
    hideErrorEnd: true,
  };
  // initial value :: end

  const maximumDate = new Date(props.maxDate);
  let minCalDate = props.minDate;

  let defaultDate,
    defaultEnd,
    defaultTime,
    defaultEndTime,
    defaultStartDate,
    startDateTime,
    defaultEndDate,
    endDateTime;

  const dateTimeRange = props.defaultValue;

  if (props.defaultValue) {
    if (dateTimeRange.includes(" To ")) {
      [startDateTime, endDateTime] = dateTimeRange.split(" To ");

      if (startDateTime.includes(" ")) {
        [defaultStartDate, defaultTime] = startDateTime.split(" ");

        defaultDate = new Date(defaultStartDate);
      } else {
        defaultDate = new Date(startDateTime);
      }

      if (endDateTime.includes(" ")) {
        [defaultEndDate, defaultEndTime] = endDateTime.split(" ");
        defaultEnd = new Date(defaultEndDate);
      } else {
        defaultEnd = new Date(endDateTime);
      }
    } else {
      if (dateTimeRange.includes(" ")) {
        [defaultStartDate, defaultTime] = dateTimeRange.split(" ");
        defaultDate = new Date(defaultStartDate);
      } else {
        defaultDate = new Date(dateTimeRange);
      }
    }
  }

  if (typeof props.minDate !== "boolean") {
    const date = `${new Date(props.minDate).getFullYear()}-${
      new Date(props.minDate).getMonth() + 1
    }-${new Date(props.minDate).getDate()}`;
    minCalDate = new Date(date);
  } else {
    const date = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`;
    minCalDate = new Date(date);
  }

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

      case "DEFAULT_VALUES":
        let hour,
          endTimeHour,
          minute,
          endTimeMinute,
          second,
          endTimeSecond,
          showStartClock,
          showEndClock,
          defaultStartTime,
          defaultEndSelectedTime,
          rangeEndDate,
          rangeStartDate;

        if (defaultTime !== undefined) {
          [hour, minute, second] = defaultTime.split(":");

          if (!props.isSecondHide) {
            defaultStartTime = defaultTime;
          } else {
            defaultStartTime = `${hour}:${minute}`;
          }
          showStartClock = "show";
        } else {
          defaultStartTime = "";
        }

        if (defaultEndTime !== undefined) {
          [endTimeHour, endTimeMinute, endTimeSecond] =
            defaultEndTime.split(":");

          if (!props.isSecondHide) {
            defaultEndSelectedTime = defaultEndTime;
          } else {
            defaultEndSelectedTime = `${endTimeHour}:${endTimeMinute}`;
          }

          showEndClock = "show";
        } else {
          defaultEndSelectedTime = "";
        }

        let defaultMonth = defaultDate.getMonth();
        let defaultYear = defaultDate.getFullYear();

        if (props.minDate && defaultDate > props.minDate) {
          rangeStartDate = defaultDate;
        } else {
          rangeStartDate = new Date();
        }

        if (props.range && defaultEnd !== undefined) {
          if (defaultEnd > defaultDate) {
            defaultMonth = defaultEnd.getMonth();
            defaultYear = defaultEnd.getFullYear();
            rangeEndDate = defaultEnd;
          } else {
            defaultMonth = rangeStartDate.getMonth();
            defaultYear = rangeStartDate.getFullYear();
            rangeEndDate = rangeStartDate;
          }
        }

        return {
          ...state,
          selectedStart: rangeStartDate,
          selectedEnd: rangeEndDate,
          month: defaultMonth,
          year: defaultYear,
          time: defaultStartTime,
          endTime: defaultEndSelectedTime,
          hour: hour,
          minute: minute,
          endHour: endTimeHour,
          endMinute: endTimeMinute,
          showClock: showStartClock,
          showEndClock: showEndClock,
          selectedHour: hour,
          selectedMinute: minute,
          selectedEndHour: endTimeHour,
          selectedEndMinute: endTimeMinute,
          selectedSecond: second,
          selectedEndSecond: endTimeSecond,
          previousSelectedStartDate: state.previousSelectedStartDate
            ? [...state.previousSelectedStartDate, rangeStartDate]
            : [rangeStartDate],
          previousSelectedEndDate: state.previousSelectedEndDate
            ? [...state.previousSelectedEndDate, rangeEndDate]
            : [rangeEndDate],
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

      case "CHANGE_END_SECOND":
        return {
          ...state,
          selectedEndSecond: action.payload,
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

      case "CHANGE_SECOND":
        return {
          ...state,
          selectedSecond: action.payload,
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
        let showStart = !state.show;
        if (props.isDisabled || props.isReadOnly) {
          showStart = "";
        } else {
          showStart =
            state.show === "" || state.show === "show-end" ? "show" : "";
        }

        if (!props.range) {
          if (state.show === "show-end") {
            showStart = "";
          }
        }
        return {
          ...state,
          show: showStart,
        };

      case "TOGGLE_SHOW_END":
        let showEnd = !state.show;
        if (props.isDisabled || props.isReadOnly) {
          showEnd = "";
        } else {
          if (state.selectedStart === null) {
            showEnd = "show";
          } else {
            showEnd =
              state.show === "" || state.show === "show" ? "show-end" : "";
          }
        }
        return {
          ...state,
          show: showEnd,
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
          previousSelectedDate: state.selectedStart,
          month: state.currentDate.getMonth(),
          year: state.currentDate.getFullYear(),
          time: "",
          endTime: "",
          selectedHour: null,
          selectedMinute: null,
          selectedEndHour: null,
          selectedEndMinute: null,
          selectedSecond: null,
          selectedEndSecond: null,
          show: "",
          showClock: "",
          showEndClock: "",
          showYear: "",
        };

      // changes //
      case "UNDO_START":
        return {
          ...state,
          selectedStart: new Date(action.payload),
        };

      case "UNDO_END":
        return {
          ...state,
          selectedEnd: new Date(action.payload),
        };

      case "UNDO_STATE":
        return {
          ...state,
          undoDate: action.payload,
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

        if (minCalDate.getFullYear() === state.year) {
          if (minCalDate.getMonth() > newChangeMonth) {
            newChangeMonth = minCalDate.getMonth();
            newSelectedMonth = minCalDate.getMonth();
          }
        }
        if (maximumDate.getFullYear() === state.year) {
          if (maximumDate.getMonth() < newChangeMonth) {
            newChangeMonth = maximumDate.getMonth();
            newSelectedMonth = maximumDate.getMonth();
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
        if (minCalDate.getFullYear() > setYear) {
          setYear = minCalDate.getFullYear();
          setSelectedYear = minCalDate.getFullYear();
        }
        if (maximumDate.getFullYear() < setYear) {
          setYear = maximumDate.getFullYear();
          setSelectedYear = maximumDate.getFullYear();
        }
        if (setYear === maximumDate.getFullYear()) {
          if (state.month > maximumDate.getMonth()) {
            listChangeMonth = maximumDate.getMonth();
            listSelectedMonth = maximumDate.getMonth();
          }
        }
        if (setYear === minCalDate.getFullYear()) {
          if (state.month < minCalDate.getMonth()) {
            listChangeMonth = minCalDate.getMonth();
            listSelectedMonth = minCalDate.getMonth();
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
            timeFormat:
              state.timeFormat === "AM" || state.timeFormat === ""
                ? "PM"
                : "AM",
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
        let hideSecond = "";
        let singleLetterSecond = "";
        let hideEndSecond = "";
        let hideEndSingleSecond = "";

        if (!props.isSecondHide) {
          hideSecond = `${state.selectedSecond}`;
          singleLetterSecond = `0${state.selectedSecond}`;
          hideEndSecond = `${state.selectedEndSecond}`;
          hideEndSingleSecond = `0${state.selectedEndSecond}`;
        }

        if (props.clockTimeFormat !== "am-pm") {
          newTimeFormat = "";
          newEndTimeFormat = "";
        }
        if (!props.range) {
          toggleTime = "";
        } else {
          toggleTime = "show-end";
        }
        if (state.show === "show") {
          // start date selection :: begin
          if (
            state.selectedHour &&
            state.selectedMinute &&
            state.selectedSecond
          ) {
            if (state.selectedHour < 10 && state.selectedHour.length === 1) {
              return {
                ...state,
                time: `0${state.selectedHour}:${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
                show: toggleTime,
              };
            }
            if (
              state.selectedMinute < 10 &&
              state.selectedMinute.length === 1
            ) {
              return {
                ...state,
                time: `${state.selectedHour}:0${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
                show: toggleTime,
              };
            }
            if (
              state.selectedSecond < 10 &&
              state.selectedSecond.length === 1
            ) {
              return {
                ...state,
                time: `${state.selectedHour}:${state.selectedMinute}:${singleLetterSecond} ${newTimeFormat}`,
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
                time: `0${state.selectedHour}:0${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
                show: toggleTime,
              };
            }
            if (
              state.selectedHour < 10 &&
              state.selectedHour.length === 1 &&
              state.selectedSecond < 10 &&
              state.selectedSecond.length === 1
            ) {
              return {
                ...state,
                time: `0${state.selectedHour}:${state.selectedMinute}:${singleLetterSecond} ${newTimeFormat}`,
                show: toggleTime,
              };
            }
            if (
              state.selectedSecond < 10 &&
              state.selectedSecond.length === 1 &&
              state.selectedMinute < 10 &&
              state.selectedMinute.length === 1
            ) {
              return {
                ...state,
                time: `${state.selectedHour}:0${state.selectedMinute}:${singleLetterSecond} ${newTimeFormat}`,
                show: toggleTime,
              };
            }
            if (
              state.selectedHour < 10 &&
              state.selectedHour.length === 1 &&
              state.selectedMinute < 10 &&
              state.selectedMinute.length === 1 &&
              state.selectedSecond < 10 &&
              state.selectedSecond.length === 1
            ) {
              return {
                ...state,
                time: `0${state.selectedHour}:0${state.selectedMinute}:${singleLetterSecond} ${newTimeFormat}`,
                show: toggleTime,
              };
            }

            return {
              ...state,
              time: `${state.selectedHour}:${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
              show: toggleTime,
            };
          }
          if (
            state.selectedHour === null &&
            state.selectedMinute !== null &&
            state.selectedSecond !== null
          ) {
            if (
              state.selectedMinute < 10 &&
              state.selectedMinute.length === 1
            ) {
              return {
                ...state,
                time: `24:0${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
                show: toggleTime,
                selectedHour: "24",
              };
            }
            if (
              state.selectedSecond < 10 &&
              state.selectedSecond.length === 1
            ) {
              return {
                ...state,
                time: `24:${state.selectedMinute}:${singleLetterSecond} ${newTimeFormat}`,
                show: toggleTime,
                selectedHour: "24",
              };
            }
            if (
              state.selectedMinute < 10 &&
              state.selectedMinute.length === 1 &&
              state.selectedSecond < 10 &&
              state.selectedSecond.length === 1
            ) {
              return {
                ...state,
                time: `24:0${state.selectedMinute}:${singleLetterSecond} ${newTimeFormat}`,
                show: toggleTime,
                selectedHour: "24",
              };
            }

            return {
              ...state,
              time: `24:${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
              show: toggleTime,
              selectedHour: "24",
            };
          }
          if (
            state.selectedHour === null &&
            state.selectedMinute === null &&
            state.selectedSecond !== null
          ) {
            if (
              state.selectedSecond < 10 &&
              state.selectedSecond.length === 1
            ) {
              return {
                ...state,
                time: `24:00:${singleLetterSecond} ${newTimeFormat}`,
                show: toggleTime,
                selectedHour: "24",
                selectedMinute: "00",
              };
            }

            return {
              ...state,
              time: `24:00:${hideSecond} ${newTimeFormat}`,
              show: toggleTime,
              selectedHour: "24",
              selectedMinute: "00",
            };
          }
          if (
            state.selectedHour === null &&
            state.selectedMinute !== null &&
            state.selectedSecond === null
          ) {
            if (
              state.selectedMinute < 10 &&
              state.selectedMinute.length === 1
            ) {
              return {
                ...state,
                time: `24:0${state.selectedMinute}:00 ${newTimeFormat}`,
                show: toggleTime,
                selectedHour: "24",
                selectedMinute: "00",
              };
            }

            return {
              ...state,
              time: `24:${state.selectedMinute}:00 ${newTimeFormat}`,
              show: toggleTime,
              selectedHour: "24",
              selectedSecond: "00",
            };
          }
          if (
            state.selectedHour !== null &&
            state.selectedMinute === null &&
            state.selectedSecond === null
          ) {
            if (state.selectedHour < 10 && state.selectedHour.length === 1) {
              return {
                ...state,
                time: `0${state.selectedHour}:00:00 ${newTimeFormat}`,
                show: toggleTime,
                selectedSecond: "00",
                selectedMinute: "00",
              };
            }

            return {
              ...state,
              time: `${state.selectedHour}:00:00 ${newTimeFormat}`,
              show: toggleTime,
              selectedSecond: "00",
              selectedSecond: "00",
            };
          }
          if (
            state.selectedHour !== null &&
            state.selectedMinute !== null &&
            state.selectedSecond === null
          ) {
            if (
              state.selectedMinute < 10 &&
              state.selectedMinute.length === 1
            ) {
              return {
                ...state,
                time: `${state.selectedHour}:0${state.selectedMinute}:00 ${newTimeFormat}`,
                show: toggleTime,
                selectedSecond: "00",
              };
            }
            if (state.selectedHour < 10 && state.selectedHour.length === 1) {
              return {
                ...state,
                time: `0${state.selectedSecond}:${state.selectedMinute}:00 ${newTimeFormat}`,
                show: toggleTime,
                selectedSecond: "00",
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
                time: `0${state.selectedHour}:0${state.selectedMinute}:00 ${newTimeFormat}`,
                show: toggleTime,
                selectedSecond: "00",
              };
            }

            return {
              ...state,
              time: `${state.selectedHour}:${state.selectedMinute}:00 ${newTimeFormat}`,
              show: toggleTime,
              selectedSecond: "00",
            };
          }
          if (
            state.selectedHour !== null &&
            state.selectedMinute === null &&
            state.selectedSecond !== null
          ) {
            if (state.selectedHour < 10 && state.selectedHour.length === 1) {
              return {
                ...state,
                time: `0${state.selectedHour}:00:${hideSecond} ${newTimeFormat}`,
                show: toggleTime,
                selectedMinute: "00",
              };
            }
            if (
              state.selectedSecond < 10 &&
              state.selectedSecond.length === 1
            ) {
              return {
                ...state,
                time: `${state.selectedHour}:00:${singleLetterSecond} ${newTimeFormat}`,
                show: toggleTime,
                selectedMinute: "00",
              };
            }
            if (
              state.selectedHour < 10 &&
              state.selectedHour.length === 1 &&
              state.selectedSecond < 10 &&
              state.selectedSecond.length === 1
            ) {
              return {
                ...state,
                time: `0${state.selectedHour}:00:${singleLetterSecond} ${newTimeFormat}`,
                show: toggleTime,
                selectedMinute: "00",
              };
            }

            return {
              ...state,
              time: `24:${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
              show: toggleTime,
              selectedHour: "24",
            };
          }
          if (
            (state.time === null && state.selectedStart === null) ||
            (state.time === "" && state.selectedStart === null) ||
            state.selectedStart === null
          ) {
            if (!props.isSecondHide) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  selectedStart: new Date(),
                  selectedHour: "12",
                  selectedMinute: "00",
                  selectedSecond: "00",
                  time: `12:00:00 ${newTimeFormat}`,
                  show: toggleTime,
                };
              } else {
                return {
                  ...state,
                  selectedStart: new Date(),
                  selectedHour: "00",
                  selectedMinute: "00",
                  selectedSecond: "00",
                  time: `00:00:00 ${newTimeFormat}`,
                  show: toggleTime,
                };
              }
            } else {
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
          }
          if (state.selectedStart === null) {
            if (state.time === null || state.time === "") {
              if (!props.isSecondHide) {
                if (props.clockTimeFormat === "am-pm") {
                  return {
                    ...state,
                    selectedStart: new Date(),
                    selectedHour: "12",
                    selectedMinute: "00",
                    selectedSecond: "00",
                    time: `12:00:00 ${newTimeFormat}`,
                    show: toggleTime,
                  };
                } else {
                  return {
                    ...state,
                    selectedStart: new Date(),
                    selectedHour: "00",
                    selectedMinute: "00",
                    selectedSecond: "00",
                    time: `00:00:00 ${newTimeFormat}`,
                    show: toggleTime,
                  };
                }
              } else {
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
            }
            if (state.time !== null || state.time !== "") {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  selectedHour: state.selectedHour,
                  selectedMinute: state.selectedMinute,
                  selectedSecond: state.selectedSecond,
                  time: `${state.selectedHour}:${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
                  show: toggleTime,
                };
              } else {
                return {
                  ...state,
                  selectedHour: state.selectedHour,
                  selectedMinute: state.selectedMinute,
                  selectedSecond: state.selectedSecond,
                  time: `${state.selectedHour}:${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
                  show: toggleTime,
                };
              }
            }
          } else {
            if (state.time === null || state.time === "") {
              if (!props.isSecondHide) {
                if (props.clockTimeFormat === "am-pm") {
                  return {
                    ...state,
                    selectedHour: "12",
                    selectedMinute: "00",
                    selectedSecond: "00",
                    time: `12:00:00 ${newTimeFormat}`,
                    show: toggleTime,
                  };
                } else {
                  return {
                    ...state,
                    selectedHour: "00",
                    selectedMinute: "00",
                    selectedSecond: "00",
                    time: `00:00:00 ${newTimeFormat}`,
                    show: toggleTime,
                  };
                }
              } else {
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
            }
            if (state.time !== null || state.time !== "") {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  selectedHour: state.selectedHour,
                  selectedMinute: state.selectedMinute,
                  selectedSecond: state.selectedSecond,
                  time: `${state.selectedHour}:${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
                  show: toggleTime,
                };
              } else {
                return {
                  ...state,
                  selectedHour: state.selectedHour,
                  selectedMinute: state.selectedMinute,
                  selectedSecond: state.selectedSecond,
                  time: `${state.selectedHour}:${state.selectedMinute}:${hideSecond} ${newTimeFormat}`,
                  show: toggleTime,
                };
              }
            }
          }
          // start date selection :: end
        } else {
          // end date selection :: begin
          if (
            state.selectedEndHour &&
            state.selectedEndMinute &&
            state.selectedSecond
          ) {
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1
            ) {
              return {
                ...state,
                endTime: `0${state.selectedEndHour}:${state.selectedEndMinute}:${hideEndSecond} ${newEndTimeFormat}`,
                show: "",
              };
            }
            if (
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1
            ) {
              return {
                ...state,
                endTime: `${state.selectedEndHour}:0${state.selectedEndMinute}:${hideEndSecond} ${newEndTimeFormat}`,
                show: "",
              };
            }
            if (
              state.selectedEndSecond < 10 &&
              state.selectedEndSecond.length === 1
            ) {
              return {
                ...state,
                time: `${state.selectedEndHour}:${state.selectedMinute}:${hideEndSingleSecond} ${newEndTimeFormat}`,
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
                endTime: `0${state.selectedEndHour}:0${state.selectedEndMinute}:${hideEndSecond} ${newEndTimeFormat}`,
                show: "",
              };
            }
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1 &&
              state.selectedEndSecond < 10 &&
              state.selectedEndSecond.length === 1
            ) {
              return {
                ...state,
                endTime: `0${state.selectedEndHour}:${state.selectedEndMinute}:${hideEndSingleSecond} ${newEndTimeFormat}`,
                show: "",
              };
            }
            if (
              state.selectedEndSecond < 10 &&
              state.selectedEndSecond.length === 1 &&
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1
            ) {
              return {
                ...state,
                endTime: `${state.selectedEndHour}:0${state.selectedEndMinute}:${hideEndSingleSecond} ${newEndTimeFormat}`,
                show: "",
              };
            }
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1 &&
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1 &&
              state.selectedEndSecond < 10 &&
              state.selectedEndSecond.length === 1
            ) {
              return {
                ...state,
                endTime: `0${state.selectedEndHour}:0${state.selectedEndMinute}:${hideEndSingleSecond} ${newEndTimeFormat}`,
                show: "",
              };
            }

            return {
              ...state,
              endTime: `${state.selectedEndHour}:${state.selectedEndMinute}:${hideEndSecond} ${newEndTimeFormat}`,
              show: "",
            };
          }
          if (
            state.selectedEndHour === null &&
            state.selectedEndMinute !== null &&
            state.selectedEndSecond !== null
          ) {
            if (
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `11:0${state.selectedEndMinute}:${hideEndSecond} ${newEndTimeFormat}`,
                  selectedEndHour: "11",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `23:0${state.selectedEndMinute}:${hideEndSecond} ${newEndTimeFormat}`,
                  selectedEndHour: "23",
                  show: "",
                };
              }
            }
            if (
              state.selectedEndSecond < 10 &&
              state.selectedEndSecond.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `11:${state.selectedEndMinute}:${hideEndSingleSecond} ${newEndTimeFormat}`,
                  selectedEndHour: "11",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `23:${state.selectedEndMinute}:${hideEndSingleSecond} ${newEndTimeFormat}`,
                  selectedEndHour: "23",
                  show: "",
                };
              }
            }
            if (
              state.selectedEndSecond < 10 &&
              state.selectedEndSecond.length === 1 &&
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `11:0${state.selectedEndMinute}:${hideEndSingleSecond} ${newEndTimeFormat}`,
                  selectedEndHour: "11",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `23:0${state.selectedEndMinute}:${hideEndSingleSecond} ${newEndTimeFormat}`,
                  selectedEndHour: "23",
                  show: "",
                };
              }
            }
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                endTime: `11:0${state.selectedEndMinute}:${hideEndSecond} ${newEndTimeFormat}`,
                selectedEndHour: "11",
                show: "",
              };
            } else {
              return {
                ...state,
                endTime: `23:0${state.selectedEndMinute}:${hideEndSecond} ${newEndTimeFormat}`,
                selectedEndHour: "23",
                show: "",
              };
            }
          }
          if (
            state.selectedEndHour === null &&
            state.selectedEndMinute === null &&
            state.selectedEndSecond !== null
          ) {
            if (
              state.selectedEndSecond < 10 &&
              state.selectedEndSecond.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `11:00:${hideEndSingleSecond} ${newEndTimeFormat}`,
                  selectedEndHour: "11",
                  selectedEndMinute: "00",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `23:00:${hideEndSingleSecond} ${newEndTimeFormat}`,
                  selectedEndHour: "23",
                  selectedEndMinute: "00",
                  show: "",
                };
              }
            }
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                endTime: `11:00${hideEndSecond} ${newEndTimeFormat}`,
                selectedEndHour: "11",
                selectedEndMinute: "00",
                show: "",
              };
            } else {
              return {
                ...state,
                endTime: `23:00${hideEndSecond} ${newEndTimeFormat}`,
                selectedEndHour: "23",
                selectedEndMinute: "00",
                show: "",
              };
            }
          }
          if (
            state.selectedEndHour === null &&
            state.selectedEndMinute !== null &&
            state.selectedEndSecond === null
          ) {
            if (
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `11:0${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                  selectedEndHour: "11",
                  selectedEndSecond: "00",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `23:0${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                  selectedEndHour: "23",
                  selectedEndSecond: "00",
                  show: "",
                };
              }
            }
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                endTime: `11:${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                selectedEndHour: "11",
                selectedEndSecond: "00",
                show: "",
              };
            } else {
              return {
                ...state,
                endTime: `23:${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                selectedEndHour: "23",
                selectedEndSecond: "00",
                show: "",
              };
            }
          }
          if (
            state.selectedEndHour !== null &&
            state.selectedEndMinute !== null &&
            state.selectedEndSecond === null
          ) {
            if (
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `${state.selectedEndHour}:0${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                  selectedEndSecond: "00",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `${state.selectedEndHour}:0${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                  selectedEndSecond: "00",
                  show: "",
                };
              }
            }
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `0${state.selectedEndHour}:${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                  selectedEndSecond: "00",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `0${state.selectedEndHour}:${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                  selectedEndSecond: "00",
                  show: "",
                };
              }
            }
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1 &&
              state.selectedEndMinute < 10 &&
              state.selectedEndMinute.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `0${state.selectedEndHour}:0${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                  selectedEndSecond: "00",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `0${state.selectedEndHour}:0${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                  selectedEndSecond: "00",
                  show: "",
                };
              }
            }
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                endTime: `${state.selectedEndHour}:0${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                selectedEndSecond: "00",
                show: "",
              };
            } else {
              return {
                ...state,
                endTime: `${state.selectedEndHour}:0${state.selectedEndMinute}:00 ${newEndTimeFormat}`,
                selectedEndSecond: "00",
                show: "",
              };
            }
          }
          if (
            state.selectedEndHour !== null &&
            state.selectedEndMinute === null &&
            state.selectedEndSecond !== null
          ) {
            if (
              state.selectedEndSecond < 10 &&
              state.selectedEndSecond.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `${state.selectedEndHour}:00:${hideEndSingleSecond} ${newEndTimeFormat}`,
                  selectedEndMinute: "00",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `${state.selectedEndHour}:00:${hideEndSingleSecond} ${newEndTimeFormat}`,
                  selectedEndMinute: "00",
                  show: "",
                };
              }
            }
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `0${state.selectedEndHour}:00${hideEndSecond} ${newEndTimeFormat}`,
                  selectedEndMinute: "00",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `0${state.selectedEndHour}:00${hideEndSecond} ${newEndTimeFormat}`,
                  selectedEndMinute: "00",
                  show: "",
                };
              }
            }
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1 &&
              state.selectedEndSecond < 10 &&
              state.selectedEndSecond.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `0${state.selectedEndHour}:00:${hideEndSingleSecond} ${newEndTimeFormat}`,
                  selectedEndMinute: "00",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `0${state.selectedEndHour}:00:${hideEndSingleSecond} ${newEndTimeFormat}`,
                  selectedEndMinute: "00",
                  show: "",
                };
              }
            }
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                endTime: `${state.selectedEndHour}:00:${hideEndSingleSecond} ${newEndTimeFormat}`,
                selectedEndMinute: "00",
                show: "",
              };
            } else {
              return {
                ...state,
                endTime: `${state.selectedEndHour}:00:${hideEndSingleSecond} ${newEndTimeFormat}`,
                selectedEndMinute: "00",
                show: "",
              };
            }
          }
          if (
            state.selectedEndHour !== null &&
            state.selectedEndMinute === null &&
            state.selectedEndSecond === null
          ) {
            if (
              state.selectedEndHour < 10 &&
              state.selectedEndHour.length === 1
            ) {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  endTime: `0${state.selectedEndHour}:00:00 ${newEndTimeFormat}`,
                  selectedEndMinute: "00",
                  selectedEndSecond: "00",
                  show: "",
                };
              } else {
                return {
                  ...state,
                  endTime: `0${state.selectedEndHour}:00:00 ${newEndTimeFormat}`,
                  selectedEndMinute: "00",
                  selectedEndSecond: "00",
                  show: "",
                };
              }
            }
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                endTime: `${state.selectedEndHour}:00:00 ${newEndTimeFormat}`,
                selectedEndMinute: "00",
                selectedEndSecond: "00",
                show: "",
              };
            } else {
              return {
                ...state,
                endTime: `${state.selectedEndHour}:00:00 ${newEndTimeFormat}`,
                selectedEndMinute: "00",
                selectedEndSecond: "00",
                show: "",
              };
            }
          }

          if (
            (state.endTime === null && state.selectedEnd === null) ||
            (state.endTime === "" && state.selectedEnd === null) ||
            state.selectedEnd === null
          ) {
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                selectedEnd: state.selectedStart,
                selectedEndHour: "11",
                selectedEndMinute: "59",
                selectedEndSecond: "00",
                endTime: `11:59:00 ${newTimeFormat}`,
                show: "",
              };
            } else {
              return {
                ...state,
                selectedEnd: state.selectedStart,
                selectedEndHour: "23",
                selectedEndMinute: "59",
                selectedEndSecond: "00",
                endTime: `23:59:00 ${newTimeFormat}`,
                show: "",
              };
            }
          }
          if (state.selectedEnd) {
            if (state.endTime === null || state.endTime === "") {
              if (props.clockTimeFormat === "am-pm") {
                return {
                  ...state,
                  selectedEndHour: "11",
                  selectedEndMinute: "59",
                  selectedEndSecond: "00",
                  endTime: `11:59:00 ${newTimeFormat}`,
                  show: "",
                };
              } else {
                return {
                  ...state,
                  selectedEndHour: "23",
                  selectedEndMinute: "59",
                  selectedEndSecond: "00",
                  endTime: `23:59:00 ${newTimeFormat}`,
                  show: "",
                };
              }
            }
          }
          if (state.endTime !== null || state.endTime !== "") {
            if (props.clockTimeFormat === "am-pm") {
              return {
                ...state,
                selectedEndHour: state.selectedEndHour,
                selectedEndMinute: state.selectedEndMinute,
                selectedEndSecond: state.selectedEndSecond,
                endTime: `${state.selectedEndHour}:${state.selectedEndMinute}:${hideEndSecond} ${newTimeFormat}`,
                show: "",
              };
            } else {
              return {
                ...state,
                selectedEndHour: state.selectedEndHour,
                selectedEndMinute: state.selectedEndMinute,
                selectedEndSecond: state.selectedEndSecond,
                endTime: `${state.selectedEndHour}:${state.selectedEndMinute}:${hideEndSecond} ${newTimeFormat}`,
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
        let selectedDate;
        if (state.showClock === "") {
          toggle = "";
        }
        const selected = new Date(action.year, action.month, action.day);
        if (!props.range) {
          return {
            ...state,
            selectedStart: selected,
            selectedEnd: null,
            show: toggle,
          };
        } else {
          if (state.show === "show") {
            return {
              ...state,
              selectedStart: selected,
              show: state.showClock === "" ? "show-end" : "show",
            };
          } else {
            if (selected < state.selectedStart) {
              return {
                ...state,
                selectedStart: selected,
                show: "show",
              };
            } else {
              return {
                ...state,
                selectedEnd: selected,
                show: state.showEndClock === "" ? "" : state.show,
              };
            }
          }
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

      // set input value into selectedEnd :: begin
      case "SET_SELECTED_END":
        return {
          ...state,
          show: "",
          selectedEnd: action.payload,
          month: action.payload.getMonth(),
          year: action.payload.getFullYear(),
        };
      // set input value into selectedEnd :: end

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

      // find time from input field text :: begin
      case "SET_TIME":
        let startTimeFormat = state.timeFormat;
        let startHour = state.selectedHour;
        let startMinute = state.selectedMinute;
        let startSecond = state.selectedSecond;
        let startTime;
        if (!props.isSecondHide) {
          if (props.clockTimeFormat === "am-pm") {
            startTimeFormat = action.format;
            startMinute = action.minute;
            startSecond = action.second;
            if (action.hour <= 12) {
              startHour = action.hour;
            } else {
              startMinute = action.minute;
            }
            startTime = `${startHour}:${startMinute}:${startSecond} ${startTimeFormat}`;
          } else {
            startHour = action.hour;
            startMinute = action.minute;
            startSecond = action.second;
            startTimeFormat = "";
            startTime = `${startHour}:${startMinute}:${startSecond}`;
          }
        } else {
          if (props.clockTimeFormat === "am-pm") {
            startTimeFormat = action.format;
            startMinute = action.minute;
            startSecond = action.second;

            if (action.hour <= 12) {
              startHour = action.hour;
            } else {
              startMinute = action.minute;
            }
            startTime = `${startHour}:${startMinute} ${startTimeFormat}`;
          } else {
            startHour = action.hour;
            startMinute = action.minute;
            startSecond = action.second;
            startTimeFormat = "";
            startTime = `${startHour}:${startMinute}`;
          }
        }

        return {
          ...state,
          selectedHour: startHour,
          selectedMinute: startMinute,
          selectedSecond: startSecond,
          timeFormat: startTimeFormat,
          time: startTime,
          showClock: "show",
          show: "",
        };
      // find time from input field text :: end

      // find end time from input field text :: begin
      case "SET_END_TIME":
        let endTimeFormat = state.endTimeFormat;
        let endHour = state.selectedEndHour;
        let endMinute = state.selectedEndMinute;
        let endSecond = state.selectedEndSecond;
        let endTimeValue;

        if (!props.isSecondHide) {
          if (props.clockTimeFormat === "am-pm") {
            endTimeFormat = action.format;
            endMinute = action.minute;
            endSecond = action.second;
            if (action.hour <= 12) {
              endHour = action.hour;
            } else {
              endMinute = action.minute;
            }
            endTimeValue = `${endHour}:${endMinute}:${endSecond} ${state.endTimeFormat}`;
          } else {
            endHour = action.hour;
            endMinute = action.minute;
            endSecond = action.second;
            endTimeFormat = "";
            endTimeValue = `${endHour}:${endMinute}:${endSecond}`;
          }
        } else {
          if (props.clockTimeFormat === "am-pm") {
            endTimeFormat = action.format;
            endMinute = action.minute;
            endSecond = action.second;
            if (action.hour <= 12) {
              endHour = action.hour;
            } else {
              endMinute = action.minute;
            }
            endTimeValue = `${endHour}:${endMinute} ${state.endTimeFormat}`;
          } else {
            endHour = action.hour;
            endMinute = action.minute;
            endSecond = action.second;
            endTimeFormat = "";
            endTimeValue = `${endHour}:${endMinute}`;
          }
        }
        return {
          ...state,
          showEndClock: "show",
          show: "",
          selectedEndHour: endHour,
          selectedEndMinute: endMinute,
          selectedEndSecond: endSecond,
          endTime: endTimeValue,
        };
      case "SET_END_HOUR":
        return {
          ...state,
          selectedEndHour: action.payload,
        };
      case "SET_END_MINUTE":
        return {
          ...state,
          selectedEndMinute: action.payload,
        };
      case "SET_END_TIME_FORMAT":
        return {
          ...state,
          endTimeFormat: action.payload,
          show: "",
        };
      // find end time from input field text :: end
      // validate start input field :: start
      case "VALIDATE_START":
        return {
          ...state,
          validateStart: action.payload,
        };
      // validate start input field :: end
      // validate end input field :: start
      case "VALIDATE_END":
        return {
          ...state,
          validateEnd: action.payload,
        };
      // validate end input field :: end
      case "SHOW_ERROR_MSG":
        const errorToggle = !state.hideError;
        return {
          ...state,
          hideError: errorToggle,
        };
      case "SHOW_END_ERROR_MSG":
        const errorEndToggle = !state.hideErrorEnd;
        return {
          ...state,
          hideErrorEnd: errorEndToggle,
        };

      case "HIDE_ERROR_MSG":
        return {
          ...state,
          hideError: true,
          hideErrorEnd: true,
        };
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
    selectedSecond,
    selectedEndHour,
    selectedEndMinute,
    selectedEndSecond,
    time,
    endTime,
    showEndClock,
    presentYear,
    timeFormat,
    endTimeFormat,
    previousSelectedStartDate,
    previousSelectedEndDate,
    undoDate,
    validateStart,
    validateEnd,
    hideError,
    hideErrorEnd,
  } = state;
  // reducer hook :: end

  let day;

  if (selectedStart === null) {
    day = new Date().getDate();
  } else {
    day = selectedStart.getDate();
  }

  const fullDateFormat = new Date(
    year,
    month,
    day,
    selectedHour,
    selectedMinute,
    selectedSecond
  );

  const dateWithTime = `${year}-${
    month + 1
  }-${day} ${selectedHour}:${selectedMinute}:${selectedSecond}`;

  const endDay = selectedEnd && selectedEnd.getDate();
  const fullEndDateFormat =
    endDay &&
    new Date(
      year,
      month,
      endDay,
      selectedEndHour,
      selectedEndMinute,
      selectedEndSecond
    );

  // default variables :: begin
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const numOfRows = Math.ceil((firstDayOfMonth + lastDayOfMonth) / 7);
  const prevMonth = month === 0 ? 11 : month + 1;
  const prevYear = month === 0 ? year + 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 20;
  const maxYear = currentYear + 40;
  const years = [];
  const yearOptions = [];
  const hourOptions = [];
  const minuteOptions = [];
  const secondsOptions = [];
  let startDate = "";
  let endDate = "";
  let disableSelect = true;
  const id = props.id;
  // default variables :: end

  // disable select dropodwn :: begin
  if (props.isMinTime && selectedStart) {
    if (
      selectedStart > currentDate ||
      selectedStart.toDateString() === currentDate.toDateString()
    ) {
      disableSelect = false;
    }
  }
  // disable select dropodwn :: end

  // form variables
  const startTime = props.range
    ? props.isSecondHide
      ? `${selectedHour}:${selectedMinute}`
      : `${selectedHour}:${selectedMinute}:${selectedSecond}`
    : "";
  const startTimeFormat = props.clockTimeFormat === "am-pm" ? timeFormat : "";
  const startInputValue =
    selectedStart &&
    `${selectedStart.getDate()}-${
      selectedStart.getMonth() + 1
    }-${selectedStart.getFullYear()} ${startTime} ${startTimeFormat}`;

  // ===============================================

  const endTimeValue = props.range
    ? props.isSecondHide
      ? `${selectedEndHour}:${selectedEndMinute}`
      : `${selectedEndHour}:${selectedEndMinute}:${selectedEndSecond}`
    : "";
  const endTimeFormatValue =
    props.clockTimeFormat === "am-pm" ? endTimeFormat : "";
  const endInputValue =
    selectedEnd &&
    `${selectedEnd.getDate()}/${
      selectedEnd.getMonth() + 1
    }/${selectedEnd.getFullYear()} ${endTimeValue} ${endTimeFormatValue}`;
  // form variables

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

  const handleSecondChange = (e) => {
    dispatch({ type: "CHANGE_SECOND", payload: e.target.value });
  };

  const handleEndSecondChange = (e) => {
    dispatch({ type: "CHANGE_END_SECOND", payload: e.target.value });
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
  // changes //
  const handleStartUndo = () => {
    let pervious =
      previousSelectedStartDate[previousSelectedStartDate.length - 2];
    if (previousSelectedStartDate.length > 1) {
      dispatch({ type: "UNDO_START", payload: pervious });
      previousSelectedStartDate.pop();
    }
  };
  const handleEndUndo = () => {
    let next = previousSelectedEndDate[previousSelectedEndDate.length - 2];

    if (previousSelectedEndDate.length > 1) {
      previousSelectedEndDate.pop();
      dispatch({ type: "UNDO_END", payload: next });
    }
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
  // let isStartDateSelected = false

  // changes //
  const handleDayClick = (day) => {
    if (show === "show") {
      previousSelectedStartDate.push(`${year}-${month + 1}-${day}`);
      dispatch({ type: "UNDO_STATE", payload: "start" });
    } else {
      previousSelectedEndDate.push(`${year}-${month + 1}-${day}`);
      dispatch({ type: "UNDO_STATE", payload: "end" });
    }

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
      dispatch({ type: "HIDE_ERROR_MSG" });
      dispatch({ type: "VALIDATE_START", payload: true });
      dispatch({ type: "VALIDATE_END", payload: true });
    }
  };

  const handleShowError = () => {
    dispatch({ type: "SHOW_ERROR_MSG" });
  };

  const handleShowEndError = () => {
    dispatch({ type: "SHOW_END_ERROR_MSG" });
  };
  // handle event listeners :: end

  // useEffect hook :: begin
  useEffect(() => {
    props.onChange && props.onChange(startInputValue);
  }, [selectedStart, selectedHour, selectedMinute, timeFormat, selectedSecond]);

  useEffect(() => {
    props.onEndChange && props.onEndChange(endInputValue);
  }, [
    selectedEnd,
    selectedEndHour,
    selectedEndMinute,
    endTimeFormat,
    selectedEndSecond,
  ]);

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
    if (props.defaultValue) {
      dispatch({ type: "DEFAULT_VALUES" });
    }
  }, []);

  useEffect(() => {
    if (props.defaultValue) {
      dispatch({ type: "DEFAULT_VALUES" });
    }
  }, [props.defaultValue, props.range, props.isSecondHide]);

  useEffect(() => {
    dispatch({ type: "TOGGLE_SHOW" });
  }, [props.range]);

  // useEffect hook :: end

  // logics for calendar :: begin
  for (let i = minYear; i <= maxYear; i++) {
    yearOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }
  // changes
  let currentHour = currentDate.getHours();
  let currentMinute = currentDate.getMinutes();
  let currentSecond = currentDate.getSeconds();

  // Check if selected date is greater than current date
  const isStartDateSelected = selectedStart > currentDate;

  if (props.clockTimeFormat) {
    for (let i = 1; i <= 12; i++) {
      const value = i < 10 ? `0${i}` : i.toString();
      let disabled = true;
      let eveHour;

      if (timeFormat === "PM") {
        eveHour = selectedHour + 12;
      }

      if (isStartDateSelected) {
        disabled = false; // Enable all options if selected date is greater than current date
      } else {
        if (show === "show") {
          if (
            selectedStart &&
            selectedStart.toDateString() === currentDate.toDateString()
          ) {
            if (currentHour > 12 && currentHour !== 12 && timeFormat === "PM") {
              currentHour -= 12;
              disabled = i < currentHour;
            } else if (
              (currentHour > 12 && timeFormat === "AM") ||
              (currentHour <= 12 && timeFormat === "PM")
            ) {
              disabled = false;
            } else {
              disabled = i < currentHour;
            }
          }
        } else if (show === "show-end") {
          if (selectedEnd && selectedEnd > selectedStart) {
            disabled = false;
          } else {
            if (eveHour > 12 && eveHour !== 12 && timeFormat === "PM") {
              disabled = i < selectedHour;
            } else if (
              (eveHour > 12 && timeFormat === "AM") ||
              (eveHour <= 12 && timeFormat === "PM")
            ) {
              disabled = false;
            } else {
              disabled = i < selectedHour;
            }
          }
        }
      }

      hourOptions.push(
        <option value={value} key={value} disabled={disabled}>
          {value}
        </option>
      );
    }
  } else {
    for (let i = 0; i < 24; i++) {
      const value = i < 10 ? `0${i}` : i.toString();
      let disabled = true;

      if (isStartDateSelected) {
        disabled = false; // Enable all options if selected date is greater than current date
      } else {
        if (show === "show") {
          if (
            selectedStart &&
            selectedStart.toDateString() === currentDate.toDateString()
          ) {
            disabled = i < currentHour;
          }
        } else if (show === "show-end") {
          if (selectedEnd && selectedEnd > selectedStart) {
            disabled = false;
          } else {
            disabled = i < selectedHour;
          }
        }
      }

      hourOptions.push(
        <option value={value} key={value} disabled={disabled}>
          {value}
        </option>
      );
    }
  }

  for (let i = 0; i < 60; i++) {
    const value = i < 10 ? `0${i}` : i.toString();
    let disabled = false;

    if (isStartDateSelected) {
      disabled = false; // Enable all options if selected date is greater than current date
    } else {
      if (show === "show") {
        if (
          selectedStart &&
          selectedStart.toDateString() === currentDate.toDateString() &&
          currentHour === selectedHour
        ) {
          disabled = i < currentMinute;
        }
      } else if (show === "show-end") {
        if (selectedEnd && selectedEnd > selectedStart) {
          disabled = false;
        }
        if (
          selectedEnd &&
          selectedEnd.toDateString() === selectedStart.toDateString() &&
          currentHour === selectedHour
        ) {
          disabled = i < selectedMinute;
        }
      }
    }

    minuteOptions.push(
      <option value={value} key={value} disabled={disabled}>
        {value}
      </option>
    );
  }

  for (let i = 0; i < 60; i++) {
    const value = i < 10 ? `0${i}` : i.toString();
    let disabled = false;

    if (isStartDateSelected) {
      disabled = false; // Enable all options if selected date is greater than current date
    } else if (
      selectedStart &&
      selectedStart.toDateString() === currentDate.toDateString() &&
      currentHour === selectedHour &&
      currentMinute === selectedMinute
    ) {
      disabled = i < currentSecond;
    }

    secondsOptions.push(
      <option value={value} key={value} disabled={disabled}>
        {value}
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
    if (month === minCalDate.getMonth() && year === minCalDate.getFullYear()) {
      prevBtn = (
        <button disabled className="table-btn" onClick={handlePrevious}>
          &#x276E;
        </button>
      );
    }
  } else if (show === "show-end") {
    if (month === new Date(selectedStart).getMonth()) {
      prevBtn = (
        <button disabled className="table-btn" onClick={handlePrevious}>
          &#x276E;
        </button>
      );
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

    let isDateValid;
    let isTimeValid;

    const lowercaseFormat = format.toLowerCase();
    const lowercaseValue = value.toLowerCase();

    const str = lowercaseFormat
      .replace("dd", "\\d{2}")
      .replace("mm", "\\d{2}")
      .replace("yyyy", "\\d{4}");

    const regex = new RegExp(`^${str}$`);
    isDateValid = lowercaseValue.match(regex);

    if (isDateValid) {
      const dd = value.slice(
        lowercaseFormat.indexOf("dd"),
        lowercaseFormat.indexOf("dd") + 2
      );
      const mm = value.slice(
        lowercaseFormat.indexOf("mm"),
        lowercaseFormat.indexOf("mm") + 2
      );
      const yyyy = value.slice(
        lowercaseFormat.indexOf("yyyy"),
        lowercaseFormat.indexOf("yyyy") + 4
      );

      const dateArr = [yyyy, mm, dd];
      const rearrangedDateStr = dateArr.join("-");

      dispatch({
        type: "SET_SELECTED_START",
        payload: new Date(rearrangedDateStr),
      });

      previousSelectedStartDate.push(rearrangedDateStr);
    }

    let timeRegex;
    let amPm = "";
    let capitalMeridiem;

    if (props.isSecondHide) {
      timeRegex = /(\d{2}:\d{2})/;
    } else {
      timeRegex = /(\d{2}:\d{2}:\d{2})/;
    }

    const matches = lowercaseValue.match(timeRegex);
    isTimeValid = matches && matches.length > 1;

    if (isTimeValid) {
      var time = matches[0];
      var hour = value.substr(matches.index, 2);
      var minute = value.substr(matches.index + 3, 2);
      let second;

      if (!props.isSecondHide) {
        second = value.substr(matches.index + 6, 2);
        amPm = value.substr(matches.index + 9, 2);
        capitalMeridiem = amPm.toUpperCase();
      } else {
        amPm = value.substr(matches.index + 6, 2);
        capitalMeridiem = amPm.toUpperCase();
      }

      dispatch({
        type: "SET_TIME",
        format: capitalMeridiem,
        hour,
        minute,
        second,
      });
    }

    // check valitity of input text
    if (!props.hideError) {
      let dateTimeRegex = regex;

      if (props.selectedMode === "dateTime") {
        dateTimeRegex = new RegExp(`^${str} ${timeRegex.source}$`, "i");

        if (props.clockTimeFormat === "am-pm") {
          dateTimeRegex = new RegExp(
            `^${str} ${timeRegex.source} (AM|PM)$`,
            "i"
          );
        }
      }

      const validate = value.match(dateTimeRegex);

      if (validate) {
        const year = parseInt(validate[0].substring(6, 11));
        const month = parseInt(validate[0].substring(3, 5)); // Months are zero-based (0-11)
        const day = parseInt(validate[0].substring(0, 2));
        let hour = parseInt("00");
        let minute = parseInt("00");
        let second = parseInt("00");
        let meridiem;

        if (props.selectedMode === "dateTime") {
          hour = parseInt(validate[0].substring(11, 13));
          minute = parseInt(validate[0].substring(14, 16));

          if (props.clockTimeFormat === "am-pm") {
            if (!props.isSecondHide) {
              second = parseInt(validate[0].substring(17, 19));
              meridiem = validate[0].substring(20, 23);
            } else {
              meridiem = validate[0].substring(17, 19);
            }

            if (meridiem === "PM") {
              hour += 12; // Convert to 24-hour format
            }
          }
        } else {
          if (!props.isSecondHide) {
            second = parseInt(validate[0].substring(17, 19));
          }
        }

        const dateObject = new Date(year, month, day, hour, minute, second);
        const isValidDateTime =
          !isNaN(dateObject) && dateObject instanceof Date;

        dispatch({ type: "VALIDATE_START", payload: isValidDateTime });
      } else {
        dispatch({ type: "VALIDATE_START", payload: false });
      }
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

  function handleClearClick() {
    props.clearClick && props.clearClick();
  }

  //  =========================================================

  const handleEndDateChange = (event) => {
    const value = event.target.value;
    const format = props.format || "DD/MM/YYYY";

    const lowercaseFormat = format.toLowerCase();
    const lowercaseValue = value.toLowerCase();

    const str = lowercaseFormat
      .replace("dd", "\\d{2}")
      .replace("mm", "\\d{2}")
      .replace("yyyy", "\\d{4}");

    const regex = new RegExp(`^${str}$`);

    if (lowercaseValue.match(regex)) {
      const dd = lowercaseValue.slice(
        lowercaseFormat.indexOf("dd"),
        lowercaseFormat.indexOf("dd") + 2
      );
      const mm = lowercaseValue.slice(
        lowercaseFormat.indexOf("mm"),
        lowercaseFormat.indexOf("mm") + 2
      );
      const yyyy = lowercaseValue.slice(
        lowercaseFormat.indexOf("yyyy"),
        lowercaseFormat.indexOf("yyyy") + 4
      );

      const dateArr = [yyyy, mm, dd];
      const rearrangedDateStr = dateArr.join("-");

      if (new Date(rearrangedDateStr) > selectedStart) {
        dispatch({
          type: "SET_SELECTED_END",
          payload: new Date(rearrangedDateStr),
        });
      } else {
        dispatch({
          type: "SET_SELECTED_END",
          payload: selectedStart,
        });
      }

      previousSelectedEndDate.push(rearrangedDateStr);
    }

    let timeRegex;
    let amPm = "";
    let capitalMeridiem;

    if (props.isSecondHide) {
      timeRegex = /(\d{2}:\d{2})/;
    } else {
      timeRegex = /(\d{2}:\d{2}:\d{2})/;
    }

    const matches = lowercaseValue.match(timeRegex);

    if (matches && matches.length > 1) {
      var time = matches[0];
      var hour = value.substr(matches.index, 2);
      var minute = value.substr(matches.index + 3, 2);
      let second;

      if (!props.isSecondHide) {
        second = value.substr(matches.index + 6, 2);
        amPm = value.substr(matches.index + 8, 2);
        capitalMeridiem = amPm.toUpperCase();
      } else {
        amPm = value.substr(matches.index + 6, 2);
        capitalMeridiem = amPm.toUpperCase();
      }

      dispatch({
        type: "SET_END_TIME",
        format: capitalMeridiem,
        hour,
        minute,
        second,
      });
    }

    // check valitity of input text
    if (!props.hideError) {
      let dateTimeRegex = regex;

      if (props.selectedMode === "dateTime") {
        dateTimeRegex = new RegExp(`^${str} ${timeRegex.source}$`, "i");

        if (props.clockTimeFormat === "am-pm") {
          dateTimeRegex = new RegExp(
            `^${str} ${timeRegex.source} (AM|PM)$`,
            "i"
          );
        }
      }

      const validate = value.match(dateTimeRegex);

      if (validate) {
        const year = parseInt(validate[0].substring(6, 11));
        const month = parseInt(validate[0].substring(3, 5)); // Months are zero-based (0-11)
        const day = parseInt(validate[0].substring(0, 2));
        let hour = parseInt("00");
        let minute = parseInt("00");
        let second = parseInt("00");
        let meridiem;

        if (props.selectedMode === "dateTime") {
          hour = parseInt(validate[0].substring(11, 13));
          minute = parseInt(validate[0].substring(14, 16));

          if (props.clockTimeFormat === "am-pm") {
            if (!props.isSecondHide) {
              second = parseInt(validate[0].substring(17, 19));
              meridiem = validate[0].substring(20, 23);
            } else {
              meridiem = validate[0].substring(17, 19);
            }

            if (meridiem === "PM") {
              hour += 12; // Convert to 24-hour format
            }
          }
        } else {
          if (!props.isSecondHide) {
            second = parseInt(validate[0].substring(17, 19));
          }
        }

        const dateObject = new Date(year, month, day, hour, minute, second);
        const isValidDateTime =
          !isNaN(dateObject) && dateObject instanceof Date;

        dispatch({ type: "VALIDATE_END", payload: isValidDateTime });
      } else {
        dispatch({ type: "VALIDATE_END", payload: false });
      }
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

  function handleClearClickEnd() {
    props.clearClickEnd && props.clearClickEnd();
  }

  /* =================================
     =================================
     function for input value :: end
     =================================
     ================================= */
  return (
    <div
      className={`date-time-range-picker ${props.className}`}
      style={props.style}
    >
      <div className="calendar-wrap" id={id}>
        <div className={`calendar ${show}`}>
          <>
            {/* ===== calendar :: begin ===== */}
            <div className="calendar-header">
              <>
                {month === minCalDate.getMonth() &&
                year === minCalDate.getFullYear() ? (
                  <button
                    disabled
                    className="table-btn"
                    onClick={handlePrevious}
                  >
                    &#x276E;
                  </button>
                ) : (
                  <button className="table-btn" onClick={handlePrevious}>
                    &#x276E;
                  </button>
                )}
                <div>
                  <select
                    className="table-select"
                    value={month}
                    onChange={handleMonthChange}
                  >
                    {months.map((month, index) => {
                      return (
                        <option key={index} value={index}>
                          {month}
                        </option>
                      );
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
                {month === maximumDate.getMonth() &&
                year === maximumDate.getFullYear() ? (
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
                                day < 1 ||
                                day > lastDayOfMonth ||
                                currentDate < minCalDate ||
                                currentDate > maximumDate
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
                                      year === selectedEnd.getFullYear() &&
                                      props.range
                                    ? "last-date"
                                    : props.range && "in-range"
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
                              } ${currentDate < minCalDate ? "disabled" : ""} ${
                                currentDate > maximumDate ? "disabled" : ""
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
                {props.selectedMode === "dateTime" && (
                  <div className="clock-wrap">
                    <button
                      className="clock-btn"
                      onClick={
                        show === "show"
                          ? handleShowClock
                          : show === "show-end"
                          ? handleShowEndClock
                          : undefined
                      }
                    >
                      🕒
                    </button>

                    {showClock === "show" ? (
                      <div className="show-clock">
                        <select
                          disabled={disableSelect}
                          className="table-select"
                          value={selectedHour}
                          onChange={handleHourChange}
                          isMinTime={selectedHour}
                        >
                          {hourOptions}
                        </select>
                        <span>:</span>
                        <select
                          disabled={disableSelect}
                          className="table-select"
                          value={selectedMinute}
                          onChange={handleMinuteChange}
                        >
                          {minuteOptions}
                        </select>
                        {!props.isSecondHide && (
                          <>
                            <span>:</span>
                            <select
                              disabled={disableSelect}
                              className="table-select"
                              value={selectedSecond}
                              onChange={handleSecondChange}
                            >
                              {secondsOptions}
                            </select>
                          </>
                        )}
                        {props.clockTimeFormat === "am-pm" && (
                          <button
                            disabled={disableSelect}
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
                          disabled={disableSelect}
                          className="table-select"
                          value={selectedHour}
                          onChange={handleEndHourChange}
                        >
                          {hourOptions}
                        </select>
                        <span>:</span>
                        <select
                          disabled={disableSelect}
                          className="table-select"
                          value={selectedEndMinute}
                          onChange={handleEndSecondChange}
                        >
                          {secondsOptions}
                        </select>
                        {!props.isSecondHide && (
                          <>
                            <span>:</span>
                            <select
                              disabled={disableSelect}
                              className="table-select"
                              value={selectedEndSecond}
                              onChange={handleEndMinuteChange}
                            >
                              {minuteOptions}
                            </select>
                          </>
                        )}

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
        <div className={props.range && "date-selection-input-wrap"}>
          <div
            className={`text-box ${props.isDisabled ? "disabled" : ""} ${
              show === "show" ? "focus" : ""
            } ${props.isReadOnly ? "read-only" : ""} ${
              validateStart ? "" : "error"
            }`}
            disabled={props.isDisabled || props.isReadOnly}
          >
            {state.isFocused ? (
              <input
                style={{ padding: "12px" }}
                type="text"
                onChange={handleDateChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onClick={handleShow}
                className={`${selectedStart ? "selected" : ""} ${
                  validateStart ? "error" : ""
                }`}
                placeholder={
                  props.placeholder
                    ? props.placeholder
                    : props.format
                    ? props.format
                    : "DD/MM/YYYY"
                }
                disabled={props.isDisabled || props.isReadOnly}
                name={props.name}
                tabIndex={props.startTabIndex}
              />
            ) : (
              <input
                style={{ padding: "12px" }}
                type="text"
                onClick={handleShow}
                onChange={handleDateChange}
                value={`${selectedStart ? startDate : ""}${
                  props.selectedMode
                    ? showClock !== ""
                      ? time !== ""
                        ? ` ${time}`
                        : ""
                      : ""
                    : ""
                }`}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`${selectedStart ? "selected" : ""} ${
                  validateStart ? "error" : ""
                }`}
                placeholder={
                  props.placeholder
                    ? props.placeholder
                    : props.format
                    ? props.format
                    : "DD/MM/YYYY"
                }
                disabled={props.isDisabled || props.isReadOnly}
                name={props.name}
                tabIndex={props.startTabIndex}
              />
            )}

            {props.isUndo && (
              <button className="icon-btn" onClick={handleStartUndo}>
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
            {!validateStart && (
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
          <div
            className={
              props.range
                ? `text-box ${props.isDisabled ? "disabled" : ""} ${
                    show === "show-end" ? "focus" : ""
                  } ${props.isReadOnly ? "read-only" : ""} ${
                    validateEnd ? "" : "error"
                  }`
                : "d-none"
            }
            disabled={props.isDisabled || props.isReadOnly}
          >
            {state.isEndFocused ? (
              <input
                style={{ padding: "12px" }}
                type="text"
                onClick={handleShowEnd}
                onChange={handleEndDateChange}
                onBlur={handleEndBlur}
                onFocus={handleEndFocus}
                className={selectedEnd ? "selected" : ""}
                placeholder={
                  props.placeholder
                    ? props.placeholder
                    : props.format
                    ? props.format
                    : "DD/MM/YYYY"
                }
                disabled={props.isDisabled || props.isReadOnly}
                readOnly={selectedStart === null ? true : false}
                name={props.eName}
                tabIndex={props.endTabIndex}
              />
            ) : (
              <input
                style={{ padding: "12px" }}
                type="text"
                onClick={handleShowEnd}
                onChange={handleEndDateChange}
                disabled={props.isDisabled || props.isReadOnly}
                readOnly={selectedStart === null ? true : false}
                name={props.eName}
                value={`${selectedEnd ? endDate : ""}${
                  props.selectedMode
                    ? showEndClock !== ""
                      ? endTime !== ""
                        ? ` ${endTime}`
                        : ""
                      : ""
                    : ""
                }`}
                onBlur={handleEndBlur}
                onFocus={handleEndFocus}
                className={selectedEnd ? "selected" : ""}
                placeholder={
                  props.placeholder
                    ? props.placeholder
                    : props.format
                    ? props.format
                    : "DD/MM/YYYY"
                }
                tabIndex={props.endTabIndex}
              />
            )}

            {props.isUndo && (
              <button className="icon-btn" onClick={handleEndUndo}>
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
              <button onClick={handleClearClickEnd} className="clear-btn">
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
            {!validateEnd && (
              <button onClick={handleShowEndError} className="error-icon">
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
            <p className={`error-msg-wrap${hideErrorEnd ? " hide" : ""}`}>
              {props.errorMsg ? props.errorMsg : "Invalid value in input"}
            </p>
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
