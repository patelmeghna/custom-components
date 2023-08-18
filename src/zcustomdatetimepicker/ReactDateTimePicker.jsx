import "./zcustomdatetimepicker.css";
import { useReducer, useEffect, useRef, Children } from "react";

export default function ReactDateTimePicker(props) {
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
    shownId: "",
  };
  // initial value :: end

  const renderCount = useRef(0);

  const maximumDate = new Date(props.maxDate);
  let minCalDate = props.minDate;

  let defaultDate,
    defaultEnd,
    defaultTime,
    defaultEndTime,
    defaultStartDate,
    startDateTime,
    defaultEndDate,
    endDateTime,
    defaultTimeFormat = "",
    defaultEndTimeFormat = "";

  const dateTimeRange = props.value;

  // ============ Default value :: begin ============
  const inputChangedValue = (value) => {
    let format = props.format || "DD/MM/YYYY";
    const lowercaseValue = value.toLowerCase();
    let lowercaseFormat = format.toLowerCase();
    console.log("000");

    let str = lowercaseFormat
      .replace("dd", "\\d{2}")
      .replace("mm", "\\d{2}")
      .replace("yyyy", "\\d{4}");

    let regex = new RegExp(`^${str}$`);

    if (!regex.test(lowercaseValue)) {
      format = "YYYY-MM-DD";
      lowercaseFormat = format.toLowerCase();

      str = lowercaseFormat
        .replace("dd", "\\d{2}")
        .replace("mm", "\\d{2}")
        .replace("yyyy", "\\d{4}");

      regex = new RegExp(`^${str}$`);
    }

    let isDateValid;
    let dateValue;
    let rearrangedDateStr;

    isDateValid = lowercaseValue.match(regex);

    if (lowercaseValue.includes(" ")) {
      [dateValue] = lowercaseValue.split(" ");

      isDateValid = dateValue.match(regex);
    }

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
      rearrangedDateStr = dateArr.join("-");
    }

    return new Date(rearrangedDateStr);
  };
  // ============ Default value :: end ============

  if (props.value && props.value.length !== null) {
    if (dateTimeRange.includes(" To ")) {
      [startDateTime, endDateTime] = dateTimeRange.split(" To ");

      if (startDateTime.includes(" ")) {
        [defaultStartDate, defaultTime, defaultTimeFormat] =
          startDateTime.split(" ");

        defaultDate = inputChangedValue(defaultStartDate);
      } else {
        defaultDate = inputChangedValue(startDateTime);
      }

      if (endDateTime.includes(" ")) {
        [defaultEndDate, defaultEndTime, defaultEndTimeFormat] =
          endDateTime.split(" ");
        defaultEnd = inputChangedValue(defaultEndDate);
      } else {
        defaultEnd = inputChangedValue(endDateTime);
      }
    } else {
      if (dateTimeRange.includes(" ")) {
        [defaultStartDate, defaultTime, defaultTimeFormat] =
          dateTimeRange.split(" ");
        defaultDate = inputChangedValue(defaultStartDate);
      } else {
        defaultDate = inputChangedValue(dateTimeRange);
      }
    }
  }

  if (defaultTimeFormat === undefined) {
    defaultTimeFormat = "";
  }
  if (defaultEndTimeFormat === undefined) {
    defaultEndTimeFormat = "";
  }

  if (typeof props.minDate !== "boolean") {
    const date = `${new Date(props.minDate).getFullYear()}-${new Date(props.minDate).getMonth() + 1
      }-${new Date(props.minDate).getDate()}`;
    minCalDate = new Date(date);
  } else {
    const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1
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

        rangeStartDate = defaultDate;

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
          time:
            props.clockTimeFormat === "am-pm"
              ? `${defaultStartTime} ${defaultTimeFormat}`
              : defaultStartTime,
          endTime:
            props.clockTimeFormat === "am-pm"
              ? `${defaultEndSelectedTime} ${defaultEndTimeFormat}`
              : defaultEndSelectedTime,
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
      // Toggle the showStart value based on various conditions
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
          shownId: action.payload,
        };
      // Toggle the showEnd value based on various conditions
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

      case "END_FORMAT_CHANGE":
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
        let startHourTime = state.selectedHour;
        let startSecondTime = state.selectedSecond;
        let startMinuteTime = state.selectedMinute;
        let endHourTime = state.selectedEndHour;
        let endMinuteTime = state.selectedEndMinute;
        let endSecondTime = state.selectedEndSecond;

        if (props.clockTimeFormat !== "am-pm") {
          newTimeFormat = "";
          newEndTimeFormat = "";
        } else {
          if (newTimeFormat === "PM") {
            if (
              state.selectedEnd &&
              state.selectedStart.toDateString() ===
              state.selectedEnd.toDateString()
            ) {
              newEndTimeFormat = "PM";
            }
          }
        }
        if (state.show === "show") {
          // start date selection :: begin
          if (props.clockTimeFormat === "am-pm") {
            if (
              state.selectedHour === undefined ||
              state.selectedHour === null
            ) {
              // start
              if (
                props.minDate &&
                state.selectedStart &&
                state.selectedStart.toDateString() === minCalDate.toDateString()
              ) {
                if (new Date().getHours() > 12) {
                  newTimeFormat = "PM";
                  newEndTimeFormat = "PM";
                }
              }
              if (new Date().getHours() > 12) {
                if ((new Date().getHours() - 12).toString().length === 1) {
                  startHourTime = `0${new Date().getHours() - 12}`;
                } else {
                  startHourTime = new Date().getHours() - 12;
                }
              } else {
                if (new Date().getHours().toString().length === 1) {
                  startHourTime = `0${new Date().getHours()}`;
                } else {
                  startHourTime = new Date().getHours();
                }
              }
              // end
            } else {
              if (startHourTime > 12) {
                if (
                  startHourTime - 12 >= 0 &&
                  startHourTime - 12 < 10 &&
                  (state.selectedHour - 12).toString().length === 1
                ) {
                  startHourTime = `0${state.selectedHour - 12}`;
                } else {
                  startHourTime = state.selectedHour - 12;
                }
              } else if (startHourTime <= 12) {
                if (
                  startHourTime >= 0 &&
                  startHourTime < 10 &&
                  state.selectedHour.toString().length === 1
                ) {
                  startHourTime = `0${state.selectedHour}`;
                } else {
                  startHourTime = state.selectedHour;
                }
              }
            }
          } else {
            if (startHourTime === undefined || startHourTime === null) {
              if (new Date().getHours().toString().length === 1) {
                startHourTime = `0${new Date().getHours()}`;
              } else {
                startHourTime = new Date().getHours();
              }
            } else {
              if (
                startHourTime >= 0 &&
                startHourTime < 10 &&
                state.selectedHour.toString().length === 1
              ) {
                startHourTime = `0${state.selectedHour}`;
              } else {
                startHourTime = state.selectedHour;
              }
            }
          }
          if (startMinuteTime === undefined || startMinuteTime === null) {
            if (new Date().getMinutes().toString().length === 1) {
              startMinuteTime = `0${new Date().getMinutes()}`;
            } else {
              startMinuteTime = new Date().getMinutes();
            }
          } else {
            if (
              startMinuteTime >= 0 &&
              startMinuteTime < 10 &&
              startMinuteTime.toString().length === 1
            ) {
              startMinuteTime = `0${state.selectedMinute}`;
            } else {
              startMinuteTime = state.selectedMinute;
            }
          }
          if (startSecondTime === undefined || startSecondTime === null) {
            if (new Date().getSeconds().toString().length === 1) {
              startSecondTime = `0${new Date().getSeconds()}`;
            } else {
              startSecondTime = new Date().getSeconds();
            }
          } else {
            if (
              startSecondTime >= 0 &&
              startSecondTime < 10 &&
              state.selectedSecond.toString().length === 1
            ) {
              startSecondTime = `0${state.selectedSecond}`;
            } else {
              startSecondTime = state.selectedSecond;
            }
          }

          if (!props.isSecondHide) {
            return {
              ...state,
              time: `${startHourTime}:${startMinuteTime}:${startSecondTime} ${newTimeFormat}`,
              selectedHour: startHourTime,
              selectedMinute: startMinuteTime,
              selectedSecond: startSecondTime,
              show: props.range ? "show-end" : "",
              timeFormat: newTimeFormat,
            };
          } else {
            return {
              ...state,
              time: `${startHourTime}:${startMinuteTime} ${newTimeFormat}`,
              selectedHour: startHourTime,
              selectedMinute: startMinuteTime,
              show: props.range ? "show-end" : "",
              timeFormat: newTimeFormat,
            };
          }

          // start date selection :: end
        } else {
          if (props.clockTimeFormat === "am-pm") {
            if (endHourTime === undefined || endHourTime === null) {
              // start
              if (startHourTime === undefined || startHourTime === null) {
                if (new Date().getHours() > 12) {
                  if ((new Date().getHours() - 12).toString().length === 1) {
                    startHourTime = `0${new Date().getHours() - 12}`;
                    endHourTime = `0${new Date().getHours() - 12}`;
                  } else {
                    startHourTime = new Date().getHours() - 12;
                    endHourTime = new Date().getHours() - 12;
                  }
                } else {
                  if (new Date().getHours().toString().length === 1) {
                    startHourTime = `0${new Date().getHours()}`;
                  } else {
                    startHourTime = new Date().getHours();
                  }
                }
              } else {
                if (startHourTime.toString().length === 1) {
                  endHourTime = `0${startHourTime}`;
                } else {
                  endHourTime = startHourTime;
                }
              }
              // end
            } else {
              if (endHourTime > 12) {
                if (
                  endHourTime - 12 >= 0 &&
                  endHourTime - 12 < 10 &&
                  (state.selectedEndHour - 12).toString().length === 1
                ) {
                  endHourTime = `0${state.selectedEndHour - 12}`;
                } else {
                  endHourTime = state.selectedEndHour - 12;
                }
              } else {
                if (
                  endHourTime >= 0 &&
                  endHourTime < 10 &&
                  state.selectedEndHour.toString().length === 1
                ) {
                  endHourTime = `0${state.selectedEndHour}`;
                } else {
                  endHourTime = state.selectedEndHour;
                }
              }
            }
          } else {
            if (endHourTime === undefined || endHourTime === null) {
              // start
              if (startHourTime === undefined || startHourTime === null) {
                if (new Date().getHours().toString().length === 1) {
                  startHourTime = `0${new Date().getHours()}`;
                  endHourTime = `0${new Date().getHours()}`;
                } else {
                  endHourTime = new Date().getHours();
                  startHourTime = new Date().getHours();
                }
              } else {
                if (startHourTime.toString().length === 1) {
                  endHourTime = `0${startHourTime}`;
                } else {
                  endHourTime = startHourTime;
                }
              }
              // end
            } else {
              if (
                endHourTime >= 0 &&
                endHourTime < 10 &&
                state.selectedEndHour.toString().length === 1
              ) {
                endHourTime = `0${state.selectedEndHour}`;
              } else {
                endHourTime = state.selectedEndHour;
              }
            }
          }

          if (endMinuteTime === undefined || endMinuteTime === null) {
            if (startMinuteTime === undefined || startMinuteTime === null) {
              if (new Date().getMinutes().toString().length === 1) {
                startMinuteTime = `0${new Date().getMinutes()}`;
                endMinuteTime = `0${new Date().getMinutes()}`;
              } else {
                endMinuteTime = new Date().getMinutes();
                startMinuteTime = new Date().getMinutes();
              }
            } else {
              if (startMinuteTime.toString().length === 1) {
                endMinuteTime = `0${startMinuteTime}`;
              } else {
                endMinuteTime = startMinuteTime;
              }
            }
          } else {
            if (
              endMinuteTime >= 0 &&
              endMinuteTime < 10 &&
              state.selectedEndMinute.toString().length === 1
            ) {
              endMinuteTime = `0${state.selectedEndMinute}`;
            } else {
              endMinuteTime = state.selectedEndMinute;
            }
          }

          if (endSecondTime === undefined || endSecondTime === null) {
            if (startSecondTime === undefined || startSecondTime === null) {
              if (new Date().getSeconds().toString().length === 1) {
                startSecondTime = `0${new Date().getSeconds()}`;
                endSecondTime = `0${new Date().getSeconds()}`;
              } else {
                startSecondTime = new Date().getSeconds();
                endSecondTime = new Date().getSeconds();
              }
            } else {
              if (startSecondTime.toString().length === 1) {
                endSecondTime = `0${startSecondTime}`;
              } else {
                endSecondTime = startSecondTime;
              }
            }
          } else {
            if (
              endSecondTime >= 0 &&
              endSecondTime < 10 &&
              state.selectedEndSecond.toString().length === 1
            ) {
              endSecondTime = `0${state.selectedEndSecond}`;
            } else {
              endSecondTime = state.selectedEndSecond;
            }
          }

          if (state.showEndClock === "show") {
            if (!props.isSecondHide) {
              return {
                ...state,
                endTime: `${endHourTime}:${endMinuteTime}:${endSecondTime} ${newEndTimeFormat}`,
                selectedEndHour: endHourTime,
                selectedEndMinute: endMinuteTime,
                selectedEndSecond: endSecondTime,
                show: "",
                endTimeFormat: newEndTimeFormat,
              };
            }
            if (props.isSecondHide) {
              return {
                ...state,
                endTime: `${endHourTime}:${endMinuteTime} ${newEndTimeFormat}`,
                selectedEndHour: endHourTime,
                selectedEndMinute: endMinuteTime,
                show: "",
                endTimeFormat: newEndTimeFormat,
              };
            }
          }

          // end date selection :: end

          // if (
          //   state.selectedEnd &&
          //   state.selectedStart &&
          //   state.selectedStart > state.selectedEnd &&
          //   props.range
          // ) {
          //   return {
          //     ...state,
          //     selectedEnd: state.selectedStart,
          //   };
          // }
        }

      // return {
      //   ...state,
      //   endTime: ``,
      //   show: "",
      // };
      // apply event handler :: end

      // apply current date handler :: begin
      case "APPLY_CURRENT_DATETIME":
        let defaultCurrentHour = state.selectedHour,
          defaultCurrentMinute = state.selectedMinute,
          defaultCurrentSecond = state.selectedSecond,
          defaultCurrentFormat = "",
          calendarState;

        if (props.clockTimeFormat === "am-pm") {
          defaultCurrentFormat = state.timeFormat;
          // cond 1
          if (new Date().getHours() < 12 && state.timeFormat === "AM") {
            if (state.selectedHour < new Date().getHours()) {
              if (new Date().getHours().toString().length === 1) {
                defaultCurrentHour = `0${new Date().getHours()}`;
              } else {
                defaultCurrentHour = new Date().getHours();
              }
            }
            if (state.selectedHour === new Date().getHours()) {
              if (state.selectedMinute < new Date().getMinutes()) {
                if (new Date().getMinutes().toString().length === 1) {
                  defaultCurrentMinute = `0${new Date().getMinutes()}`;
                } else {
                  defaultCurrentMinute = new Date().getMinutes();
                }
              }

              if (state.selectedMinute === new Date().getMinutes()) {
                if (state.selectedSecond < new Date().getSeconds()) {
                  if (new Date().getSeconds().toString().length === 1) {
                    defaultCurrentSecond = `0${new Date().getSeconds()}`;
                  } else {
                    defaultCurrentSecond = new Date().getSeconds();
                  }
                }
              }
            }
          }
          // cond 2
          if (
            props.minDate &&
            state.selectedStart &&
            state.selectedStart.toDateString() === minCalDate.toDateString()
          ) {
            if (props.isMinCurrentTime) {
              if (new Date().getHours() === 12 && state.timeFormat === "PM") {
                defaultCurrentFormat = "PM";
                if (state.selectedHour === new Date().getHours()) {
                  if (state.selectedMinute < new Date().getMinutes()) {
                    if (new Date().getMinutes().toString().length === 1) {
                      defaultCurrentMinute = `0${new Date().getMinutes()}`;
                    } else {
                      defaultCurrentMinute = new Date().getMinutes();
                    }
                  }

                  if (state.selectedMinute === new Date().getMinutes()) {
                    if (state.selectedSecond < new Date().getSeconds()) {
                      if (new Date().getSeconds().toString().length === 1) {
                        defaultCurrentSecond = `0${new Date().getSeconds()}`;
                      } else {
                        defaultCurrentSecond = new Date().getSeconds();
                      }
                    }
                  }
                }
              }
              if (new Date().getHours() === 12 && state.timeFormat === "AM") {
                defaultCurrentFormat = "PM";
              }
            }
          }
          // cond 3
          if (new Date().getHours() > 12 && state.timeFormat === "PM") {
            if (state.selectedHour < new Date().getHours() - 12) {
              if ((new Date().getHours() - 12).toString().length === 1) {
                defaultCurrentHour = `0${new Date().getHours() - 12}`;
              } else {
                defaultCurrentHour = new Date().getHours() - 12;
              }
            }
            if (state.selectedHour === new Date().getHours() - 12) {
              if (state.selectedMinute < new Date().getMinutes()) {
                if (new Date().getMinutes().toString().length === 1) {
                  defaultCurrentMinute = `0${new Date().getMinutes()}`;
                } else {
                  defaultCurrentMinute = new Date().getMinutes();
                }
              }

              if (state.selectedMinute === new Date().getMinutes()) {
                if (state.selectedSecond < new Date().getSeconds()) {
                  if (new Date().getSeconds().toString().length === 1) {
                    defaultCurrentSecond = `0${new Date().getSeconds()}`;
                  } else {
                    defaultCurrentSecond = new Date().getSeconds();
                  }
                }
              }
            }
          }
        } else {
          if (state.selectedHour < new Date().getHours()) {
            defaultCurrentHour = new Date().getHours();
          }
          if (state.selectedHour === new Date().getHours()) {
            if (state.selectedMinute < new Date().getMinutes()) {
              defaultCurrentMinute = new Date().getMinutes();
            }

            if (state.selectedMinute === new Date().getMinutes()) {
              if (state.selectedSecond < new Date().getSeconds()) {
                defaultCurrentSecond = new Date().getSeconds();
              }
            }
          }
        }

        if (props.range) {
          if (state.show === "show") {
            calendarState = "show-end";
          } else {
            calendarState = "";
          }
        } else {
          if (state.show === "show") {
            calendarState = "";
          }
        }

        if (!props.isSecondHide) {
          return {
            ...state,
            selectedHour: defaultCurrentHour,
            selectedMinute: defaultCurrentMinute,
            selectedSecond: defaultCurrentSecond,
            time: `${defaultCurrentHour}:${defaultCurrentMinute}:${defaultCurrentSecond} ${defaultCurrentFormat}`,
            show: calendarState,
          };
        } else {
          return {
            ...state,
            selectedHour: defaultCurrentHour,
            selectedMinute: defaultCurrentMinute,
            selectedSecond: defaultCurrentSecond,
            time: `${defaultCurrentHour}:${defaultCurrentMinute} ${defaultCurrentFormat}`,
            show: calendarState,
          };
        }

      // apply current date handler :: end

      // apply start date :: begin
      case "APPLY_START_DATE":
        console.log("app", state)
        if (state.show === "show" && state.selectedStarzzzt) {
          return {
            ...state,
            selectedStart: new Date(),
          };
        }
      // apply start date :: end

      // apply end date :: begin
      case "APPLY_END_DATE":
        if (state.show === "show-end" && state.selectedEnd === null) {
          return {
            ...state,
            selectedEnd: state.selectedStart,
          };
        }
      // apply end date :: end

      // date select :: begin
      case "SELECT_DATE":
        // console.log("Action Parameters:", action.year, action.month + 1, action.day);



        const updatedState = {
          ...state,
          selectedStart: new Date(action.year, action.month, action.day),

        };
        console.log("Updated State:", updatedState);
       


        let toggle = state.show;
        if (state.showClock === "" || state.showClock === undefined) {
          console.log("Current State:", {...state} );
          if (props.range) {
            toggle = "show-end";
          } else {
            toggle = "";
          }
        }

        const selected =
          new Date(action.year, action.month, action.day) ||
          (props.minDate && minCalDate);
        
        console.log('sel', selected)
       
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
              show:
              state.showClock === undefined || state.showClock === ""
              ? "show-end"
              : "show",
            };
       
          } else if (state.show === "show-end") {
            if (state.selectedStart === null) {
              return {
                ...state,
                selectedStart: selected,
                show: "show",
              };
            }
            if (
              props.selectedMode === "dateTime" &&
              state.showEndClock === "show" &&
              selected.toDateString() === state.selectedStart.toDateString()
            ) {
              if (!props.clockTimeFormat) {

                if (
                  state.selectedEndHour &&
                  state.selectedHour &&
                  state.selectedEndHour < state.selectedHour
                ) {
                  return {
                    ...state,
                    selectedEndHour: state.selectedHour,
                    selectedEndMinute: state.selectedMinute,
                    selectedEndSecond: state.selectedSecond,
                    endTime: `${state.selectedEndHour}:${state.selectedEndMinute
                      }${!props.isSecondHide && `:${state.selectedEndSecond}`}`,
                    selectedEnd: selected,
                  };
                }
                if (
                  state.selectedEndHour &&
                  state.selectedHour &&
                  state.selectedEndHour === state.selectedHour
                ) {
                  if (
                    state.selectedEndMinute &&
                    state.selectedEndMinute < state.selectedMinute
                  ) {
                    return {
                      ...state,
                      selectedEndMinute: state.selectedMinute,
                      selectedEndSecond: state.selectedSecond,
                      endTime: `${state.selectedEndHour}:${state.selectedEndMinute
                        }${!props.isSecondHide && `:${state.selectedEndSecond}`}`,
                      selectedEnd: selected,
                    };
                  }
                  if (!props.isSecondHide) {
                    if (
                      state.selectedEndMinute &&
                      state.selectedEndMinute === state.selectedMinute
                    ) {
                      if (
                        state.selectedEndSecond &&
                        state.selectedEndSecond < state.selectedSecond
                      ) {
                        return {
                          ...state,
                          selectedEndSecond: state.selectedSecond,
                          endTime: `${state.selectedEndHour}:${state.selectedEndMinute}:${state.selectedEndSecond}`,
                          selectedEnd: selected,
                        };
                      }
                    }
                  }
                }
              }
              if (props.clockTimeFormat === "am-pm") {

                if (
                  state.selectedEnd &&
                  state.selectedEnd.toDateString() ===
                  state.selectedStart.toDateString()
                ) {

                  if (
                    state.timeFormat === "AM" &&
                    state.endTimeFormat !== "PM"
                  ) {
                    if (
                      (state.timeFormat === "PM" &&
                        state.endTimeFormat === "AM") ||
                      state.timeFormat === state.endTimeFormat
                    ) {
                      if (
                        state.selectedEndHour &&
                        state.selectedHour &&
                        state.selectedEndHour < state.selectedHour
                      ) {
                        return {
                          ...state,
                          endTimeFormat: state.timeFormat,
                          selectedEndHour: state.selectedHour,
                          selectedEndMinute: state.selectedMinute,
                          selectedEndSecond: state.selectedSecond,
                          endTime: `${state.selectedEndHour}:${state.selectedEndMinute
                            }${!props.isSecondHide && `:${state.selectedEndSecond}`
                            } ${state.endTimeFormat}`,
                          selectedEnd: selected,
                        };
                      }
                      if (
                        state.selectedEndHour &&
                        state.selectedHour &&
                        state.selectedEndHour === state.selectedHour
                      ) {
                        if (
                          state.selectedEndMinute &&
                          state.selectedEndMinute < state.selectedMinute
                        ) {
                          return {
                            ...state,
                            endTimeFormat: state.timeFormat,
                            selectedEndMinute: state.selectedMinute,
                            selectedEndSecond: state.selectedSecond,
                            endTime: `${state.selectedEndHour}:${state.selectedEndMinute
                              }${!props.isSecondHide &&
                              `:${state.selectedEndSecond}`
                              } ${state.endTimeFormat}`,
                            selectedEnd: selected,
                          };
                        }
                        if (!props.isSecondHide) {
                          if (
                            state.selectedEndMinute &&
                            state.selectedEndMinute === state.selectedMinute
                          ) {
                            if (
                              state.selectedEndSecond &&
                              state.selectedEndSecond < state.selectedSecond
                            ) {
                              return {
                                ...state,
                                endTimeFormat: state.timeFormat,
                                selectedEndSecond: state.selectedSecond,
                                endTime: `${state.selectedEndHour}:${state.selectedEndMinute}:${state.selectedEndSecond} ${state.endTimeFormat}`,
                                selectedEnd: selected,
                              };
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (
              selected.toDateString() === state.selectedStart.toDateString() ||
              selected > state.selectedStart
            ) {

              return {
                ...state,
                selectedEnd: selected,
                show:
                  state.showEndClock === "" || state.showEndClock === undefined
                    ? ""
                    : "show-end",
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
        let hiddenState = state.show;
        if (state.show === "show" || state.show === "show-end") {
          hiddenState = "";
        }
        return {
          ...state,
          show: hiddenState,
          showYear: "",
          shownId: "",
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

      // empty end field :: begin
      case "EMPTY_END_FIELD":
        if (props.range) {
          if (state.selectedEnd && state.selectedStart > state.selectedEnd) {
            return {
              ...state,
              selectedEnd: state.selectedStart,
            };
          }

          if (
            state.selectedStart &&
            state.selectedEnd &&
            state.selectedStart.toDateString() ===
            state.selectedEnd.toDateString()
          ) {
            if (props.clockTimeFormat === "am-pm") {
              if (state.endTimeFormat === state.timeFormat) {
                if (state.selectedEndHour < state.selectedHour) {
                  return {
                    ...state,
                    selectedEndHour: state.selectedHour,
                  };
                } else if (state.selectedEndHour === state.selectedHour) {
                  if (state.selectedEndMinute < state.selectedMinute) {
                    return {
                      ...state,
                      selectedEndMinute: state.selectedMinute,
                    };
                  } else if (!props.isSecondHide) {
                    if (state.selectedEndMinute === state.selectedMinute) {
                      if (state.selectedSecond > state.selectedEndSecond) {
                        return {
                          ...state,
                          selectedEndSecond: state.selectedSecond,
                        };
                      }
                    }
                  }
                }
              } else if (
                state.endTimeFormat === "AM" &&
                state.timeFormat === "PM"
              ) {
                return {
                  ...state,
                  endTime: "",
                  endTimeFormat: state.timeFormat,
                };
              }
            } else {
              if (
                state.selectedEndHour &&
                state.selectedEndHour < state.selectedHour
              ) {
                return {
                  ...state,
                  selectedEndHour: state.selectedHour,
                };
              }
              if (state.selectedEndHour == state.selectedHour) {
                if (state.selectedEndMinute < state.selectedMinute) {
                  return {
                    ...state,
                    selectedEndMinute: state.selectedMinute,
                  };
                } else if (!props.isSecondHide) {
                  if (state.selectedEndMinute == state.selectedMinute) {
                    if (
                      state.selectedSecond > state.selectedEndSecond
                    ) {
                      return {
                        ...state,
                        selectedEndSecond: state.selectedSecond,
                      };
                    }
                  }
                }
              }
            }
          }
        }
      // empty end field :: end

      // case "REMOVE_END_DATE":
      //   if (props.value && props.value === null) {
      //     return { ...state, selectedEnd: state.selectedStart };
      //   }

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
        let startTimeFormat;
        let startHour;
        let startMinute;
        let startSecond;
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
          // show: "",
        };
      // find time from input field text :: end

      // find end time from input field text :: begin
      case "SET_END_TIME":
        let inputEndTimeFormat = state.endTimeFormat;
        let endHour = state.selectedEndHour;
        let endMinute = state.selectedEndMinute;
        let endSecond = state.selectedEndSecond;
        let endTimeValue;

        if (
          state.selectedEnd.toDateString() ===
          state.selectedStart.toDateString()
        ) {
          if (state.timeFormat === "PM") {
            inputEndTimeFormat = "PM";
          }
        }

        if (!props.isSecondHide) {
          if (props.clockTimeFormat === "am-pm") {
            inputEndTimeFormat = action.format;
            endMinute = action.minute;
            endSecond = action.second;
            if (action.hour <= 12) {
              endHour = action.hour;
            } else {
              endMinute = action.minute;
            }
            endTimeValue = `${endHour}:${endMinute}:${endSecond} ${inputEndTimeFormat}`;
          } else {
            endHour = action.hour;
            endMinute = action.minute;
            endSecond = action.second;
            inputEndTimeFormat = "";
            endTimeValue = `${endHour}:${endMinute}:${endSecond}`;
          }
        } else {
          if (props.clockTimeFormat === "am-pm") {
            inputEndTimeFormat = action.format;
            endMinute = action.minute;
            endSecond = action.second;
            if (action.hour <= 12) {
              endHour = action.hour;
            } else {
              endMinute = action.minute;
            }
            endTimeValue = `${endHour}:${endMinute} ${inputEndTimeFormat}`;
          } else {
            endHour = action.hour;
            endMinute = action.minute;
            endSecond = action.second;
            inputEndTimeFormat = "";
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
          endTimeFormat: inputEndTimeFormat,
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

      case "CHANGE_TIME_FORMAT":
        let changedFormat = "AM";
        if (props.isMinCurrentTime && props.minDate) {
          if (
            state.selectedStart &&
            state.selectedStart.toDateString() === minCalDate.toDateString()
          ) {
            if (props.clockTimeFormat) {
              if (state.currentDate.getHours() >= 12) {
                changedFormat = "PM";
              }
            }
          }
        }
        return {
          ...state,
          timeFormat: changedFormat,
          endTimeFormat: changedFormat,
        };

      case "HIDE_CALENDAR_AT_START":
        return {
          ...state,
          show: "",
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
    isFocused,
    isEndFocused,
    shownId,
  } = state;
  // reducer hook :: end

  let day;

  // Determine the day value based on the selectedStart date or the current date
  if (selectedStart === null) {
    // console.log('null4',selectedStart === null)
    day = new Date().getDate();
  } else {
    day = selectedStart.getDate();
  }

  // Create a new Date object with the full date and time information

  const fullDateFormat = new Date(
    year,
    month,
    day,
    selectedHour,
    selectedMinute,
    selectedSecond
  );

  const dateWithTime = `${year}-${month + 1
    }-${day} ${selectedHour}:${selectedMinute}:${selectedSecond}`;

  const endDay = selectedEnd && selectedEnd.getDate();
  // Create a new Date object with the full end date and time information if endDay is available
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
  let disableSelect = false;
  const id = props.id;
  // default variables :: end

  // disable select dropodwn :: begin
  if (props.isMinCurrentTime && props.minDate && selectedStart) {
    // Extract the year, month, and day components from the dates
    var currentYear2 = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentDay = currentDate.getDate();

    var selectedYear = selectedStart.getFullYear();
    var selectedMonth = selectedStart.getMonth();
    var selectedDay = selectedStart.getDate();

    // Compare the dates
    if (show === "show") {
      if (
        selectedYear > currentYear2 ||
        (selectedYear === currentYear2 && selectedMonth > currentMonth) ||
        (selectedYear === currentYear2 &&
          selectedMonth === currentMonth &&
          selectedDay > currentDay)
      ) {
        disableSelect = false;
      } else if (
        selectedYear < currentYear2 ||
        (selectedYear === currentYear2 && selectedMonth < currentMonth) ||
        (selectedYear === currentYear2 &&
          selectedMonth === currentMonth &&
          selectedDay < currentDay)
      ) {
        disableSelect = true;
      } else {
        disableSelect = false;
      }
    }
    if (show === "show-end" && selectedEnd) {
      disableSelect = false;
    }
  } else if (!props.isMinCurrentTime) {
    if (show === "show" || (show === "show-end" && selectedEnd)) {
      disableSelect = false;
    }
  }

  // disable select dropodwn :: end

  // handle event listeners :: begin
  const handleFormatChange = () => {
    console.log("01");
    dispatch({ type: "FORMAT_CHANGE" });
  };

  const handleEndFormatChange = () => {
    console.log("02");
    dispatch({ type: "END_FORMAT_CHANGE" });
  };

  const handleEndHourChange = (e) => {
    console.log("03");
    dispatch({ type: "CHANGE_END_HOUR", payload: e.target.value });
  };

  const handleEndMinuteChange = (e) => {
    console.log("04");
    dispatch({ type: "CHANGE_END_MINUTE", payload: e.target.value });
  };

  const handleHourChange = (e) => {
    console.log("05");
    dispatch({ type: "CHANGE_HOUR", payload: e.target.value });

    if (selectedEndHour && e.target.value > selectedEndHour) {
      dispatch({ type: "CHANGE_END_HOUR", payload: e.target.value });
    }
  };

  const handleMinuteChange = (e) => {
    console.log("06");
    dispatch({ type: "CHANGE_MINUTE", payload: e.target.value });

    if (selectedEndMinute && e.target.value > selectedEndMinute) {
      dispatch({ type: "CHANGE_END_MINUTE", payload: e.target.value });
    }
  };

  const handleSecondChange = (e) => {
    console.log("07");
    dispatch({ type: "CHANGE_SECOND", payload: e.target.value });

    if (selectedEndHour && e.target.value > selectedEndSecond) {
      dispatch({ type: "CHANGE_END_SECOND", payload: e.target.value });
    }
  };

  const handleEndSecondChange = (e) => {
    console.log("08");
    dispatch({ type: "CHANGE_END_SECOND", payload: e.target.value });
  };

  const handlePrevious = () => {
    console.log("09");
    dispatch({ type: "PREVIOUS" });
  };

  const handleNext = () => {
    console.log("10");
    dispatch({ type: "NEXT" });
  };

  const handleShow = () => {
    console.log(`11`);
    if (!props.isDisabled || !props.isReadOnly) {
      dispatch({ type: "TOGGLE_SHOW", payload: id });
    }
  };

  const handleShowEnd = () => {
    console.log("012");
    if (!props.isDisabled || !props.isReadOnly) {
      dispatch({ type: "TOGGLE_SHOW_END" });
    }
  };

  const handleShowClock = () => {
    console.log("013");
    dispatch({ type: "TOGGLE_SHOW_CLOCK" });
  };

  const handleShowEndClock = () => {
    console.log("014");
    dispatch({ type: "TOGGLE_SHOW_END_CLOCK" });
  };

  const handleReset = () => {
    console.log("015");
    dispatch({ type: "RESET" });
  };

  // useEffect(() => {
  //   handleReset();
  // }, [props.reset]);

  const handleStartUndo = () => {
    console.log("016");
    props.undoClick && props.undoClick();
    // if (props.value && props.value !== null) {
    //   dispatch({ type: "DEFAULT_VALUES" });
    // }
  };

  const handleEndUndo = () => {
    console.log("017");
    let next = previousSelectedEndDate[previousSelectedEndDate.length - 2];

    if (previousSelectedEndDate.length > 1) {
      previousSelectedEndDate.pop();
      dispatch({ type: "UNDO_END", payload: next });
    }
  };
  const handleEnable = () => {
    console.log("018");
    props.setIsDisabled(!props.isDisabled);
  };

  const handleMonthChange = (e) => {
    console.log("019");
    dispatch({ type: "CHANGE_MONTH", payload: e.target.value });
  };

  const handleYearChange = (e) => {
    console.log("20");
    dispatch({ type: "CHANGE_YEAR_LIST", payload: e.target.value });
  };

  const handleApply = () => {
    console.log("021");
    if (show === "show") {
      if (selectedStart === null) {
        dispatch({ type: "APPLY_START_DATE" });
      }
      if ((props.isMinCurrentTime && props.minDate) || props.isMinCurrentTime) {
        if (selectedStart > minCalDate) {
          dispatch({ type: "APPLY" });
        }

        if (props.clockTimeFormat === "am-pm") {
          if (selectedStart > minCalDate) {
            dispatch({ type: "APPLY" });
          }
          if (minCalDate.getHours() <= 11) {
            if (timeFormat === "AM") {
              if (selectedStart.toDateString() === minCalDate.toDateString()) {
                if (selectedHour >= minCalDate.getHours()) {
                  dispatch({ type: "APPLY" });
                }
              }
            }
          } else {
            if (timeFormat === "PM") {
              if (selectedStart.toDateString() === minCalDate.toDateString()) {
                if (parseInt(selectedHour) + 12 >= minCalDate.getHours()) {
                  dispatch({ type: "APPLY" });
                }
              }
            }
          }
        } else {
          dispatch({ type: "APPLY" });
        }

        if (selectedStart.toDateString() === minCalDate.toDateString()) {
          dispatch({ type: "APPLY" });
        }
      } else {
        dispatch({ type: "APPLY" });
      }
    } else if (show === "show-end") {
      if (selectedEnd === null) {
        dispatch({ type: "APPLY_END_DATE" });
      }
      if (selectedStart.toDateString() === selectedEnd.toDateString()) {
        if (timeFormat === endTimeFormat) {
          if (selectedEndHour >= selectedHour) {
            dispatch({ type: "APPLY" });
          }
        }

        if (
          (timeFormat === "AM" && endTimeFormat === "PM") ||
          (timeFormat === "PM" && endTimeFormat === "PM")
        ) {
          dispatch({ type: "APPLY" });
        }
      }

      if (
        selectedEnd > selectedStart ||
        selectedEnd.toDateString() === selectedStart.toDateString()
      ) {
        dispatch({ type: "APPLY" });
      }
    }
  };

  const handleShowError = () => {
    console.log("023");
    dispatch({ type: "SHOW_ERROR_MSG" });
  };

  const handleShowEndError = () => {
    console.log("024");
    dispatch({ type: "SHOW_END_ERROR_MSG" });
  };

  let handleDocumentClick;

  if (shownId !== "" && id === shownId) {
    handleDocumentClick = (e) => {
      if (!e.target.closest(`#${id}`)) {
        console.log("Dispatch actions");
        dispatch({ type: "HIDE_CALENDAR" });
        dispatch({ type: "HIDE_ERROR_MSG" });
        dispatch({ type: "VALIDATE_START", payload: true });
        dispatch({ type: "VALIDATE_END", payload: true });
      }
    };
  }

  // ...

  useEffect(() => {
    if (shownId !== "") {
      document.addEventListener("click", handleDocumentClick);
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }
  }, [shownId]);

  let prevBtn = (
    <button className="table-btn prev" onClick={handlePrevious}>
      &#x276E;
    </button>
  );

  useEffect(() => {
    if (props.value && props.value.length !== null) {
      dispatch({ type: "DEFAULT_VALUES" });
    }

    if (props.isMinCurrentTime) {
      dispatch({ type: "CHANGE_TIME_FORMAT" });
    }

    // dispatch({ type: "REMOVE_END_DATE" });
  }, []);

  useEffect(() => {
    if (props.value && props.value !== null) {
      if (!isFocused) {
        dispatch({ type: "DEFAULT_VALUES" });
      }
    }
  }, [props.value]);

  // useEffect(() => {
  //   dispatch({ type: "TOGGLE_SHOW" });
  // }, [props.range]);

  // useEffect hook :: end

  // logics for calendar :: begin
  for (let i = minYear; i <= maxYear; i++) {
    yearOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  let currentHour = currentDate.getHours();
  let currentMinute = currentDate.getMinutes();
  let currentSecond = currentDate.getSeconds();
  let currentPmHour = null;
  let eveHour;

  // Check if selected date is greater than current date
  const isStartDateSelected = selectedStart > currentDate;

  // Generate options for hour selection based on condition
  if (props.clockTimeFormat) {
    for (let i = 1; i <= 12; i++) {
      const value = i < 10 ? `0${i}` : i.toString();
      let disabled = false;
      if (timeFormat === "PM") {
        eveHour = parseInt(selectedHour) + 12;
      } else {
        eveHour = parseInt(selectedHour);
      }

      if (show === "show") {
        if (isStartDateSelected) {
          disabled = false;
        }
      }

      if (currentHour > 11 && show === "show") {
        currentPmHour = currentHour - 12;

        if (
          selectedStart &&
          selectedStart.toDateString() === currentDate.toDateString()
        ) {
          if (timeFormat === "PM") {
            disabled = i < currentPmHour;
          } else if (timeFormat === "AM") {
            disabled = true;
          } else {
            disabled = i < currentPmHour;
          }
        }
      } else {
        if (
          selectedStart &&
          selectedStart.toDateString() === currentDate.toDateString()
        ) {
          if (timeFormat === "AM") {
            disabled = i < currentHour;
          } else {
            disabled = false;
          }
        }
      }

      if (show === "show-end") {
        if (selectedEnd && selectedEnd > selectedStart) {
          disabled = false;
        }

        if (selectedHour < 12) {
          if (timeFormat === "AM") {
            if (
              selectedEnd &&
              selectedEnd.toDateString() === selectedStart.toDateString()
            ) {
              if (endTimeFormat === "AM") {
                disabled = i < selectedHour;
              } else {
                disabled = false;
              }
            }
          } else {
            if (
              selectedEnd &&
              selectedEnd.toDateString() === selectedStart.toDateString()
            ) {
              if (endTimeFormat === "PM") {
                disabled = i < selectedHour;

                if (i === 12) {
                  disabled = true;
                }
              } else {
                disabled = true;
              }
            }
          }
        }

        if (
          selectedEnd &&
          selectedEnd.toDateString() === selectedStart.toDateString()
        ) {
          if (selectedHour >= 12) {
            eveHour = selectedHour - 12;
            if (endTimeFormat === "PM") {
              disabled = i < eveHour;
            } else if (endTimeFormat === "AM") {
              disabled = true;
            } else {
              disabled = i < eveHour;
            }
          }
        }
      }
      if ((props.isMinCurrentTime && props.minDate) || show === "show-end") {
        hourOptions.push(
          <option value={value} key={value} disabled={disabled}>
            {value}
          </option>
        );
      } else {
        hourOptions.push(
          <option value={value} key={value}>
            {value}
          </option>
        );
      }
    }
  } else {
    for (let i = 0; i < 24; i++) {
      const value = i < 10 ? `0${i}` : i.toString();
      let disabled = false;

      if (show === "show") {
        if (isStartDateSelected) {
          disabled = false; // Enable all options if selected date is greater than current date
        }

        if (
          selectedStart &&
          selectedStart.toDateString() === currentDate.toDateString()
        ) {
          disabled = i < currentHour;
        }
      }

      if (show === "show-end") {
        if (selectedEnd && selectedEnd > selectedStart) {
          disabled = false;
        }

        if (
          selectedEnd &&
          selectedEnd.toDateString() === selectedStart.toDateString()
        ) {
          disabled = i < selectedHour;
        }
      }

      if ((props.isMinCurrentTime && props.minDate) || show === "show-end") {
        hourOptions.push(
          <option value={value} key={value} disabled={disabled}>
            {value}
          </option>
        );
      } else {
        hourOptions.push(
          <option value={value} key={value}>
            {value}
          </option>
        );
      }
    }
  }
  // Generate options for minutes selection based on condition
  for (let i = 0; i < 60; i++) {
    const value = i < 10 ? `0${i}` : i.toString();
    let disabled = false;

    if (props.clockTimeFormat) {
      if (currentHour > 11 && show === "show") {
        if (isStartDateSelected) {
          disabled = false; // Enable all options if selected date is greater than current date
        }

        if (
          selectedStart &&
          selectedStart.toDateString() === currentDate.toDateString() &&
          currentHour === selectedHour
        ) {
          if (timeFormat === "PM") {
            disabled = i < currentMinute;
          } else if (timeFormat === "AM") {
            disabled = true;
          }
        }
      } else if (currentHour < 12 && show === "show") {
        if (
          selectedStart &&
          selectedStart.toDateString() === currentDate.toDateString() &&
          currentHour === selectedHour
        ) {
          if (timeFormat === "AM") {
            disabled = i < currentMinute;
          } else {
            disabled = false;
          }
        }
      } else if (show === "show-end") {
        if (selectedEnd && selectedEnd > selectedStart) {
          disabled = false;
        }

        if (
          selectedEnd &&
          selectedEnd.toDateString() === selectedStart.toDateString()
        ) {
          if (timeFormat === "PM" && endTimeFormat === "PM") {
            disabled = i < selectedMinute;
          } else if (timeFormat === "PM" && endTimeFormat === "AM") {
            disabled = true;
          }

          if (timeFormat === "AM") {
            if (endTimeFormat === "AM") {
              disabled = i < selectedMinute;
            } else {
              disabled = false;
            }
          }
        }
      }
    } else {
      if (show === "show") {
        if (isStartDateSelected) {
          disabled = false;
        }
        if (
          selectedStart &&
          selectedStart.toDateString() === currentDate.toDateString() &&
          selectedHour &&
          currentHour.toString() === selectedHour.toString()
        ) {
          disabled = i < currentMinute;
        }
      }

      if (show === "show-end") {
        if (selectedEnd && selectedEnd > selectedStart) {
          disabled = false;
        }

        if (
          selectedEnd &&
          selectedEnd.toDateString() === selectedStart.toDateString()
        ) {
          if (
            selectedEndHour &&
            selectedEndHour.toString() === selectedHour.toString()
          ) {
            disabled = i < selectedMinute;
          }
        }
      }
    }

    if ((props.isMinCurrentTime && props.minDate) || show === "show-end") {
      minuteOptions.push(
        <option value={value} key={value} disabled={disabled}>
          {value}
        </option>
      );
    } else {
      minuteOptions.push(
        <option value={value} key={value}>
          {value}
        </option>
      );
    }
  }

  // Generate options for seconds selection based on condition
  for (let i = 0; i < 60; i++) {
    const value = i < 10 ? `0${i}` : i.toString();
    let disabled = false;

    if (props.clockTimeFormat) {
      if (currentHour > 11 && show === "show") {
        if (isStartDateSelected) {
          disabled = false;
        }

        if (
          selectedStart &&
          selectedStart.toDateString() === currentDate.toDateString() &&
          currentHour === selectedHour &&
          currentMinute === selectedMinute
        ) {
          if (timeFormat === "PM") {
            disabled = i < currentSecond;
          } else if (timeFormat === "AM") {
            disabled = true;
          }
        }
      } else if (currentHour < 12 && show === "show") {
        if (
          selectedStart &&
          selectedStart.toDateString() === currentDate.toDateString() &&
          selectedHour &&
          currentHour.toString() === selectedHour.toString() &&
          selectedMinute &&
          currentMinute.toString() === selectedMinute.toString()
        ) {
          if (timeFormat === "AM") {
            disabled = i < currentSecond;
          } else {
            disabled = false;
          }
        }
      } else if (show === "show-end") {
        if (selectedEnd && selectedEnd > selectedStart) {
          disabled = false;
        }

        if (
          selectedEnd &&
          selectedEnd.toDateString() === selectedStart.toDateString() &&
          selectedMinute === selectedEndMinute
        ) {
          if (timeFormat === "PM" && endTimeFormat === "PM") {
            disabled = i < selectedSecond;
          } else if (timeFormat === "PM" && endTimeFormat === "AM") {
            disabled = true;
          }

          if (timeFormat === "AM") {
            if (endTimeFormat === "AM") {
              disabled = i < selectedSecond;
            } else {
              disabled = false;
            }
          }
        }
      }
    } else {
      if (show === "show") {
        if (isStartDateSelected) {
          disabled = false;
        }

        if (
          selectedStart &&
          selectedStart.toDateString() === currentDate.toDateString() &&
          selectedHour &&
          currentHour.toString() === selectedHour.toString() &&
          selectedMinute &&
          currentMinute.toString() === selectedMinute.toString()
        ) {
          disabled = i < currentSecond;
        }
      }

      if (show === "show-end") {
        if (selectedEnd && selectedEnd > selectedStart) {
          disabled = false;
        }

        if (
          selectedEnd &&
          selectedEnd.toDateString() === selectedStart.toDateString()
        ) {
          if (
            selectedEndHour &&
            selectedEndHour.toString() === selectedHour.toString()
          ) {
            if (selectedEndMinute.toString() === selectedMinute.toString()) {
              disabled = i < selectedSecond;
            }
          }
        }
      }
    }

    if ((props.isMinCurrentTime && props.minDate) || show === "show-end") {
      secondsOptions.push(
        <option value={value} key={value} disabled={disabled}>
          {value}
        </option>
      );
    } else {
      secondsOptions.push(
        <option value={value} key={value}>
          {value}
        </option>
      );
    }
  }
  // Determine the date format based on the props or use default "DD/MM/YYYY"
  const str = props.format || "DD/MM/YYYY";

  // Determine the separator based on the date format
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

  // Format the start date based on the given date format
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

  // Format the end date based on the given date format
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

  // form variables
  // Assign the start time based on selected hour, minute, and second
  let startInputValue;

  if (showClock === "show") {
    startInputValue = selectedStart && `${startDate} ${time}`;
  } else {
    startInputValue = selectedStart && `${startDate}`;
  }

  let endInputValue;

  if (showEndClock === "show") {
    endInputValue = selectedEnd && `${endDate} ${endTime}`;
  } else {
    endInputValue = selectedEnd && `${endDate}`;
  }

  useEffect(() => {
    renderCount.current += 1;

    if (renderCount.current > 4) {
      if (!props.range) {
        props.onChange &&
          props.onChange(startInputValue !== null ? startInputValue : "");
      } else {
        if (
          startInputValue !== null &&
          (endInputValue !== null || endInputValue !== undefined)
        ) {
          props.onChange &&
            props.onChange(`${startInputValue} To ${endInputValue}`);
        }
      }
    }
  }, [selectedEnd, selectedStart, time, endTime]);

    const handleDayClick = (day) => {
      console.log("025");

      if (show === "show") {
        previousSelectedStartDate.push(`${day}/${month + 1}/${year}`);
        console.log('selectedDate1',previousSelectedStartDate)
        props.previousDate && props.previousDate(previousSelectedStartDate)
        dispatch({ type: "UNDO_STATE", payload: "start" });
      } else {
        console.log("fixed")
        previousSelectedEndDate.push(`${day}/${month + 1}/${year}`);
        dispatch({ type: "UNDO_STATE", payload: "end" });
      }

      if (props.minDate && !props.maxDate) {
        if (
          new Date(year, month, day) > minCalDate ||
          new Date(year, month, day).toDateString() === minCalDate.toDateString()
        ) {
          dispatch({
            type: "SELECT_DATE",
            year,
            month,
            day,
          });
        }
      }

    if (!props.minDate && props.maxDate) {
      if (
        new Date(year, month, day) < maximumDate ||
        new Date(year, month, day).toDateString() === maximumDate.toDateString()
      ) {
        dispatch({
          type: "SELECT_DATE",
          year,
          month,
          day,
        });
      }
    }

    if (props.minDate && props.maxDate) {
      console.log("bugs")
      if (
        (new Date(year, month, day) < maximumDate ||
          new Date(year, month, day).toDateString() ===
          maximumDate.toDateString()) &&
        (new Date(year, month, day) > minCalDate ||
          new Date(year, month, day).toDateString() ===
          minCalDate.toDateString())
      ) {
        dispatch({
          type: "SELECT_DATE",
          year,
          month,
          day,
        });
      }
    }

    if (!props.minDate && !props.maxDate) {
      dispatch({
        type: "SELECT_DATE",
        year,
        month,
        day,
      });
    }

    if (!props.range) {
      props.onChange &&
        props.onChange(startInputValue !== null ? startInputValue : "");
    } else {
      if (
        startInputValue !== null &&
        (endInputValue !== null || endInputValue !== undefined)
      ) {
        props.onChange &&
          props.onChange(`${startInputValue} To ${endInputValue}`);
      }
    }
  };

  // ===============================================
  // form variables

  useEffect(() => {
    if (
      selectedStart &&
      selectedEnd &&
      (selectedStart > selectedEnd ||
        selectedStart.toDateString() === selectedEnd.toDateString())
    ) {
      dispatch({ type: "EMPTY_END_FIELD" });
    }
  }, [
    selectedStart,
    selectedHour,
    selectedMinute,
    timeFormat,
    selectedSecond,
    time,
  ]);

  // Determine the previous button state based on the "show" value and current month/year
  if (show === "show") {
    if (month === minCalDate.getMonth() && year === minCalDate.getFullYear()) {
      prevBtn = (
        <button disabled className="table-btn prev" onClick={handlePrevious}>
          &#x276E;
        </button>
      );
    }
  } else if (show === "show-end") {
    if (month === new Date(selectedStart).getMonth()) {
      prevBtn = (
        <button disabled className="table-btn prev" onClick={handlePrevious}>
          &#x276E;
        </button>
      );
    }
  }

  // Generate an array of years for selection
  for (let i = 0; i < 12; i++) {
    years.push(presentYear + i);
  }
  // logics for calendar :: end

  /* =================================
     =================================
     function for input value :: begin
     =================================
     ================================= */

  // Handle the change event of the date input

  const handleDateChange = (event) => {
    console.log("026");
    const value = event.target.value;
    const format = props.format || "DD/MM/YYYY";

    if (props.range) {
      if (endInputValue) {
        props.onChange && props.onChange(`${value} To ${endInputValue}`);
      }
    }

    props.onChange && props.onChange(value);

    let isDateValid;
    let isTimeValid;
    let dateValue;

    const lowercaseFormat = format.toLowerCase();
    const lowercaseValue = value.toLowerCase();

    const str = lowercaseFormat
      .replace("dd", "\\d{2}")
      .replace("mm", "\\d{2}")
      .replace("yyyy", "\\d{4}");

    const regex = new RegExp(`^${str}$`);
    isDateValid = lowercaseValue.match(regex);

    if (showClock === "show") {
      if (lowercaseValue.includes(" ")) {
        [dateValue] = lowercaseValue.split(" ");

        isDateValid = dateValue.match(regex);
      }
    }

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
      if (
        parseInt(dd) <= 31 &&
        parseInt(mm) <= 12 &&
        yyyy.length === 4 &&
        parseInt(yyyy) >= minYear &&
        parseInt(yyyy) <= maxYear
      ) {
        if (props.minDate && !props.maxDate) {
          if (
            minCalDate < new Date(rearrangedDateStr) ||
            new Date(rearrangedDateStr).toDateString() ===
            minCalDate.toDateString()
          ) {
            dispatch({
              type: "SET_SELECTED_START",
              payload: new Date(rearrangedDateStr),
            });
          }

          previousSelectedStartDate.push(rearrangedDateStr);
        }

        if (!props.minDate && props.maxDate) {
          if (
            maximumDate > new Date(rearrangedDateStr) ||
            new Date(rearrangedDateStr).toDateString() ===
            maximumDate.toDateString()
          ) {
            dispatch({
              type: "SET_SELECTED_START",
              payload: new Date(rearrangedDateStr),
            });
            previousSelectedStartDate.push(rearrangedDateStr);
          }
        }

        if (props.minDate && props.maxDate) {
          if (
            (minCalDate < new Date(rearrangedDateStr) ||
              new Date(rearrangedDateStr).toDateString() ===
              minCalDate.toDateString()) &&
            (maximumDate > new Date(rearrangedDateStr) ||
              new Date(rearrangedDateStr).toDateString() ===
              maximumDate.toDateString())
          ) {
            dispatch({
              type: "SET_SELECTED_START",
              payload: new Date(rearrangedDateStr),
            });
            previousSelectedStartDate.push(rearrangedDateStr);
          }
        }

        if (!props.minDate && !props.maxDate) {
          dispatch({
            type: "SET_SELECTED_START",
            payload: new Date(rearrangedDateStr),
          });
          previousSelectedStartDate.push(rearrangedDateStr);
        }
      } else {
        dispatch({
          type: "SET_SELECTED_START",
          payload: new Date(),
        });
      }
    }

    // Handle the change event of the time input
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
      let time;
      let hour;
      let minute;
      let second;

      if (props.clockTimeFormat === "am-pm") {
        let newDate;
        if (lowercaseValue.includes(" ")) {
          [newDate, time, amPm] = lowercaseValue.split(" ");
          if (amPm !== null || amPm !== undefined || amPm !== "") {
            capitalMeridiem = amPm.toUpperCase();
          }
        }

        if (time.includes(":")) {
          [hour, minute, second] = time.split(":");
        }
      } else {
        if (matches[0].includes(":")) {
          [hour, minute, second] = matches[0].split(":");
        }
      }

      if (
        props.isSecondHide
          ? minute <= 60 && hour <= 24
          : minute <= 60 && hour <= 24 && second <= 60
      ) {
        if (props.minDate && props.isMinCurrentTime) {
          if (selectedStart.toDateString() > minCalDate.toDateString()) {
            dispatch({
              type: "SET_TIME",
              format: capitalMeridiem,
              hour,
              minute,
              second,
            });
          }

          if (selectedStart.toDateString() === minCalDate.toDateString()) {
            if (new Date().getHours() > 12) {
              if (parseInt(hour) > new Date().getHours() - 12) {
                dispatch({
                  type: "SET_TIME",
                  format: capitalMeridiem,
                  hour,
                  minute,
                  second,
                });
              }
            } else {
              if (parseInt(hour) > new Date().getHours()) {
                dispatch({
                  type: "SET_TIME",
                  format: capitalMeridiem,
                  hour,
                  minute,
                  second,
                });
              }
            }
            // if(hour < currentHour || minute < currentMinute || second < currentSecond){
            //   dispatch({
            //     type: "SET_TIME",
            //     format: capitalMeridiem,
            //     hour:currentHour,
            //     minute:currentMinute,
            //     second:currentSecond,
            //   })
            // }

            if (selectedEnd && selectedEnd === selectedStart) {
              if (selectedEndHour && showEndClock === "show") {
                if (hour > selectedEndHour) {
                  dispatch({ type: "CHANGE_END_HOUR", payload: hour });
                  dispatch({
                    type: "SET_END_TIME",
                    hour,
                    minute: minute,
                    second: second,
                    format: capitalMeridiem,
                  });
                }
                if (hour === selectedEndHour) {
                  if (selectedEndMinute) {
                    if (minute > selectedEndMinute) {
                      dispatch({ type: "CHANGE_END_MINUTE", payload: minute });
                      dispatch({
                        type: "SET_END_TIME",
                        minute,
                        hour: selectedEndHour,
                        second: second,
                        format: capitalMeridiem,
                      });
                    }

                    if (minute === selectedEndMinute) {
                      if (second > selectedEndSecond) {
                        dispatch({
                          type: "CHANGE_END_SECOND",
                          payload: second,
                        });
                        dispatch({
                          type: "SET_END_TIME",
                          second,
                          hour: selectedEndHour,
                          minute: selectedEndMinute,
                          format: capitalMeridiem,
                        });
                      }
                    }
                  }
                }
              }
            }

            if (parseInt(hour) === new Date().getHours()) {
              if (parseInt(minute) > new Date().getMinutes()) {
                dispatch({
                  type: "SET_TIME",
                  format: capitalMeridiem,
                  hour,
                  minute,
                  second,
                });
              }

              if (parseInt(minute) === new Date().getMinutes()) {
                if (parseInt(second) > new Date().getSeconds()) {
                  dispatch({
                    type: "SET_TIME",
                    format: capitalMeridiem,
                    hour,
                    minute,
                    second,
                  });
                }
              }
            }
          }
        } else {
          dispatch({
            type: "SET_TIME",
            format: capitalMeridiem,
            hour,
            minute,
            second,
          });
        }

        if (
          selectedEnd &&
          selectedEnd.toDateString() === selectedStart.toDateString()
        ) {
          if (selectedEndHour && showEndClock === "show") {
            if (hour > selectedEndHour.toString()) {
              dispatch({ type: "CHANGE_END_HOUR", payload: hour });
              dispatch({
                type: "SET_END_TIME",
                hour,
                minute: selectedEndMinute,
                second: selectedEndSecond,
                format: capitalMeridiem,
              });
            }
            if (hour === selectedEndHour.toString()) {
              if (selectedEndMinute) {
                if (minute > selectedEndMinute) {
                  dispatch({ type: "CHANGE_END_MINUTE", payload: minute });
                  dispatch({
                    type: "SET_END_TIME",
                    minute,
                    hour: selectedEndHour,
                    second: selectedEndSecond,
                    format: capitalMeridiem,
                  });
                }

                if (minute === selectedEndMinute.toString()) {
                  if (second > selectedEndSecond.toString()) {
                    dispatch({ type: "CHANGE_END_SECOND", payload: second });
                    dispatch({
                      type: "SET_END_TIME",
                      second,
                      hour: selectedEndHour,
                      minute: selectedEndMinute,
                      format: capitalMeridiem,
                    });
                  }
                }
              }
            }
          }
        }
      }
      if (
        props.isMinCurrentTime &&
        props.clockTimeFormat === "am-pm" &&
        minute <= 60 &&
        second <= 60 &&
        hour <= 12
      ) {
        if (selectedStart.toDateString() > minCalDate.toDateString()) {
          dispatch({
            type: "SET_TIME",
            format: capitalMeridiem,
            hour,
            minute,
            second,
          });
        }
        if (selectedStart.toDateString() === minCalDate.toDateString()) {
          if (new Date().getHours() > 12) {
            if (
              parseInt(hour) + 12 >= new Date().getHours() &&
              parseInt(minute) >= new Date().getMinutes() &&
              parseInt(second) >= new Date().getSeconds()
            ) {
              dispatch({
                type: "SET_TIME",
                format: "PM",
                hour,
                minute,
                second,
              });
            }

            if (parseInt(hour) + 12 > new Date().getHours()) {
              dispatch({
                type: "SET_TIME",
                format: "PM",
                hour,
                minute,
                second,
              });
            }

            if (parseInt(hour) + 12 === new Date().getHours()) {
              if (parseInt(minute) > new Date().getMinutes()) {
                dispatch({
                  type: "SET_TIME",
                  format: "PM",
                  hour,
                  minute,
                  second,
                });
              }

              if (parseInt(minute) === new Date().getMinutes()) {
                if (parseInt(second) > new Date().getSeconds()) {
                  dispatch({
                    type: "SET_TIME",
                    format: "PM",
                    hour,
                    minute,
                    second,
                  });
                }
              }
            }
          }
          if (new Date().getHours() < 12) {
            if (capitalMeridiem === "PM") {
              dispatch({
                type: "SET_END_TIME",
                format: capitalMeridiem,
                hour,
                minute,
                second,
              });
            }
            if (capitalMeridiem === "AM") {
              if (
                parseInt(hour) >= new Date().getHours() &&
                parseInt(minute) >= new Date().getMinutes() &&
                parseInt(second) >= new Date().getSeconds()
              ) {
                dispatch({
                  type: "SET_TIME",
                  format: capitalMeridiem,
                  hour,
                  minute,
                  second,
                });
              }

              if (parseInt(hour) > new Date().getHours()) {
                dispatch({
                  type: "SET_TIME",
                  format: capitalMeridiem,
                  hour,
                  minute,
                  second,
                });
              }

              if (parseInt(hour) === new Date().getHours()) {
                if (parseInt(minute) > new Date().getMinutes()) {
                  dispatch({
                    type: "SET_TIME",
                    format: capitalMeridiem,
                    hour,
                    minute,
                    second,
                  });
                }

                if (parseInt(minute) === new Date().getMinutes()) {
                  if (parseInt(second) > new Date().getSeconds()) {
                    dispatch({
                      type: "SET_TIME",
                      format: capitalMeridiem,
                      hour,
                      minute,
                      second,
                    });
                  }
                }
              }
            }
          }

          if (showEndClock === "") {
            dispatch({ type: "CHANGE_END_HOUR", payload: hour });
            dispatch({ type: "CHANGE_END_MINUTE", payload: minute });
            dispatch({
              type: "CHANGE_END_SECOND",
              payload: second,
            });
          }
        }
      }
    }

    // check validity of input text
    if (props.error) {
      let dateTimeRegex = regex;

      if (props.selectedMode === "dateTime") {
        dateTimeRegex = new RegExp(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/);

        if (props.isSecondHide) {
          dateTimeRegex = new RegExp(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
        }

        if (props.clockTimeFormat === "am-pm") {
          dateTimeRegex = new RegExp(
            /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2} (AM|PM)$/i
          );

          if (props.isSecondHide) {
            dateTimeRegex = new RegExp(
              /^\d{2}-\d{2}-\d{4} \d{2}:\d{2} (AM|PM)$/i
            );
          }
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
          !isNaN(dateObject) || dateObject instanceof Date;

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

  // Handle the change event of the EndDate input

  const handleEndDateChange = (event) => {
    console.log("027");
    const value = event.target.value;
    const format = props.format || "DD/MM/YYYY";

    props.onChange && props.onChange(`${startInputValue} To ${value}`);

    let isDateValid;
    let isTimeValid;
    let dateValue;

    const lowercaseFormat = format.toLowerCase();
    const lowercaseValue = value.toLowerCase();

    const str = lowercaseFormat
      .replace("dd", "\\d{2}")
      .replace("mm", "\\d{2}")
      .replace("yyyy", "\\d{4}");

    const regex = new RegExp(`^${str}$`);
    isDateValid = lowercaseValue.match(regex);

    if (showEndClock === "show") {
      if (lowercaseValue.includes(" ")) {
        [dateValue] = lowercaseValue.split(" ");

        isDateValid = dateValue.match(regex);
      }
    }

    if (isDateValid) {
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

      if (props.maxDate && selectedStart) {
        if (
          (new Date(rearrangedDateStr) > selectedStart ||
            new Date(rearrangedDateStr).toDateString() ===
            selectedStart.toDateString()) &&
          (new Date(rearrangedDateStr) < maximumDate ||
            new Date(rearrangedDateStr).toDateString() ===
            maximumDate.toDateString())
        ) {
          dispatch({
            type: "SET_SELECTED_END",
            payload: new Date(rearrangedDateStr),
          });
        }
      }
      if (parseInt(yyyy) <= maxYear && !props.maxDate) {
        if (
          new Date(rearrangedDateStr) > selectedStart ||
          new Date(rearrangedDateStr).toDateString() ===
          selectedStart.toDateString()
        ) {
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
      }

      previousSelectedEndDate.push(rearrangedDateStr);
    }

    // Handle the change event of the Endtime input

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
      var time;
      var hour;
      var minute;
      let second;

      if (props.clockTimeFormat === "am-pm") {
        let newDate;
        if (lowercaseValue.includes(" ")) {
          [newDate, time, amPm] = lowercaseValue.split(" ");
          if (amPm !== null || amPm !== undefined || amPm !== "") {
            capitalMeridiem = amPm.toUpperCase();
          }
        }
        if (time.includes(":")) {
          [hour, minute, second] = time.split(":");
        }
      } else {
        if (matches[0].includes(":")) {
          [hour, minute, second] = matches[0].split(":");
        }
      }

      if (
        props.isSecondHide
          ? minute <= 60 && hour <= 24
          : minute <= 60 && hour <= 24 && second <= 60
      ) {
        if (selectedEnd.toDateString() === selectedStart.toDateString()) {
          if (
            timeFormat === "AM" ||
            (timeFormat === "PM" && capitalMeridiem === "PM")
          ) {
            if (hour > selectedHour) {
              dispatch({
                type: "SET_END_TIME",
                format: capitalMeridiem,
                hour,
                minute,
                second,
              });
            }
            if (hour === selectedHour.toString()) {
              if (minute > selectedMinute) {
                dispatch({
                  type: "SET_END_TIME",
                  format: capitalMeridiem,
                  hour,
                  minute,
                  second,
                });
              }
              if (minute === selectedMinute.toString()) {
                if (second > selectedSecond) {
                  dispatch({
                    type: "SET_END_TIME",
                    format: capitalMeridiem,
                    hour,
                    minute,
                    second,
                  });
                }
              }
            }
          } else {
            if (hour > selectedHour) {
              dispatch({
                type: "SET_END_TIME",
                format: "PM",
                hour,
                minute,
                second,
              });
            }
            if (hour === selectedHour.toString()) {
              if (minute > selectedMinute) {
                dispatch({
                  type: "SET_END_TIME",
                  format: "PM",
                  hour,
                  minute,
                  second,
                });
              }
              if (minute === selectedMinute.toString()) {
                if (second > selectedSecond) {
                  dispatch({
                    type: "SET_END_TIME",
                    format: "PM",
                    hour,
                    minute,
                    second,
                  });
                }
              }
            }
          }
        } else if (selectedEnd > selectedStart) {
          dispatch({
            type: "SET_END_TIME",
            format: capitalMeridiem,
            hour,
            minute,
            second,
          });
        }
      } else if (
        props.clockTimeFormat === "am-pm" &&
        minute <= 60 &&
        second <= 60 &&
        hour <= 12
      ) {
        if (
          new Date(
            selectedEnd.getFullYear(),
            selectedEnd.getMonth(),
            selectedEnd.getDate()
          ) >
          new Date(
            selectedStart.getFullYear(),
            selectedStart.getMonth(),
            selectedStart.getDate()
          )
        ) {
          dispatch({
            type: "SET_END_TIME",
            format: capitalMeridiem,
            hour,
            minute,
            second,
          });
        }

        if (selectedEnd.toDateString() === selectedStart.toDateString()) {
          if (timeFormat === "PM") {
            if (
              hour >= selectedHour &&
              minute >= selectedMinute &&
              second >= selectedSecond
            ) {
              dispatch({
                type: "SET_END_TIME",
                format: "PM",
                hour,
                minute,
                second,
              });
            }

            if (hour > selectedHour) {
              dispatch({
                type: "SET_END_TIME",
                format: "PM",
                hour,
                minute,
                second,
              });
            }

            if (hour === selectedHour.toString()) {
              if (minute > selectedMinute) {
                dispatch({
                  type: "SET_END_TIME",
                  format: "PM",
                  hour,
                  minute,
                  second,
                });
              }

              if (minute === selectedMinute.toDateString()) {
                if (second >= selectedSecond) {
                  dispatch({
                    type: "SET_END_TIME",
                    format: "PM",
                    hour,
                    minute,
                    second,
                  });
                }
              }
            }
          }
          if (timeFormat === "AM") {
            if (capitalMeridiem === "PM") {
              dispatch({
                type: "SET_END_TIME",
                format: capitalMeridiem,
                hour,
                minute,
                second,
              });
            }
            if (capitalMeridiem === "AM") {
              if (
                hour >= selectedHour &&
                minute >= selectedMinute &&
                second >= selectedSecond
              ) {
                dispatch({
                  type: "SET_END_TIME",
                  format: capitalMeridiem,
                  hour,
                  minute,
                  second,
                });
              }

              if (hour > selectedHour) {
                dispatch({
                  type: "SET_END_TIME",
                  format: capitalMeridiem,
                  hour,
                  minute,
                  second,
                });
              }

              if (hour === selectedHour.toString()) {
                if (minute > selectedMinute) {
                  dispatch({
                    type: "SET_END_TIME",
                    format: capitalMeridiem,
                    hour,
                    minute,
                    second,
                  });
                }

                if (minute === selectedMinute.toString()) {
                  if (second > selectedSecond) {
                    dispatch({
                      type: "SET_END_TIME",
                      format: capitalMeridiem,
                      hour,
                      minute,
                      second,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }

    // check validity of input text
    if (props.error) {
      let dateTimeRegex = regex;

      if (props.selectedMode === "dateTime") {
        dateTimeRegex = new RegExp(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/);

        if (props.isSecondHide) {
          dateTimeRegex = new RegExp(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
        }

        if (props.clockTimeFormat === "am-pm") {
          dateTimeRegex = new RegExp(
            /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2} (AM|PM)$/i
          );

          if (props.isSecondHide) {
            dateTimeRegex = new RegExp(
              /^\d{2}-\d{2}-\d{4} \d{2}:\d{2} (AM|PM)$/i
            );
          }
        }
      }

      const validate = value.match(dateTimeRegex);

      if (validate && validate.length > 0) {
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
                    className="table-btn prev"
                    onClick={handlePrevious}
                  >
                    &#x276E;
                  </button>
                ) : (
                  <button className="table-btn prev" onClick={handlePrevious}>
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
                  <button
                    disabled
                    className="table-btn next"
                    onClick={handleNext}
                  >
                    &#x276F;
                  </button>
                ) : (
                  <button className="table-btn next" onClick={handleNext}>
                    &#x276F;
                  </button>
                )}
              </>
            </div>
            {/* ===== calendar :: end ===== */}

            {/* ===== date time table :: begin ===== */}
            <table className="date-time-table alltd">
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
                              <td key={j} className="next-prev-month ">
                                {daysInPrevMonth + day}
                              </td>
                            );
                          }
                          if (day > lastDayOfMonth) {
                            return (
                              <td key={j} className="disabled next-prev-month ">
                                {day - lastDayOfMonth}
                              </td>
                            );
                          }

                          const currentDate = new Date(year, month, day);

                          return (
                            <td
                              key={j}
                              className={`day ${day < 1 ||
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
                                } ${currentDate < minCalDate ? "disabled" : ""} ${currentDate > maximumDate ? "disabled" : ""
                                }${selectedStart &&
                                  new Date(year, month, day) < selectedStart &&
                                  new Date(year, month, day).toDateString() !==
                                  selectedStart.toDateString()
                                  ? show === "show-end"
                                    ? "disabled"
                                    : ""
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
              className={`time-range-wrap ${show === "show"
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
                          className="table-select "
                          value={selectedHour === null ? "" : selectedHour}
                          onChange={handleHourChange}
                        >
                          {hourOptions}
                        </select>
                        <span>:</span>
                        <select
                          disabled={disableSelect}
                          className="table-select "
                          value={selectedMinute === null ? "" : selectedMinute}
                          onChange={handleMinuteChange}
                        >
                          {minuteOptions}
                        </select>
                        {!props.isSecondHide && (
                          <>
                            <span>:</span>
                            <select
                              disabled={disableSelect}
                              className="table-select "
                              value={
                                selectedSecond === null ? "" : selectedSecond
                              }
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
                          className="table-select "
                          value={
                            selectedEndHour === null ? "" : selectedEndHour
                          }
                          onChange={handleEndHourChange}
                        >
                          {hourOptions}
                        </select>
                        <span>:</span>
                        <select
                          disabled={disableSelect}
                          className="table-select "
                          value={
                            selectedEndMinute === null ? "" : selectedEndMinute
                          }
                          onChange={handleEndMinuteChange}
                        >
                          {minuteOptions}
                        </select>
                        {!props.isSecondHide && (
                          <>
                            <span>:</span>
                            <select
                              disabled={disableSelect}
                              className="table-select "
                              value={
                                selectedEndSecond === null
                                  ? ""
                                  : selectedEndSecond
                              }
                              onChange={handleEndSecondChange}
                            >
                              {secondsOptions}
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
            className={`text-box ${props.isDisabled ? "disabled" : ""} ${show === "show" ? "focus" : ""
              } ${props.isReadOnly ? "read-only" : ""} ${validateStart ? "" : "error"
              }`}
            disabled={props.isDisabled || props.isReadOnly}
          >
            {state.isFocused ? (
              <input
                type="text"
                onChange={handleDateChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onClick={handleShow}
                autoComplete="off"
                className={`${selectedStart ? "selected" : ""} ${validateStart ? "error" : ""
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
                type="text"
                onChange={handleDateChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onClick={handleShow}
                autoComplete="off"
                className={`${selectedStart ? "selected" : ""} ${validateStart ? "error" : ""
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
                value={startInputValue !== null ? startInputValue : ""}
              />
            )}

            {props.isUndo && !props.range && (
              <button
                disabled={props.isDisabled || props.isReadOnly}
                className="icon-btn"
                onClick={handleStartUndo}
              >
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

            {props.isClear && isFocused && (
              <button
                onClick={handleClearClick}
                className="clear-btn"
                disabled={props.isDisabled || props.isReadOnly}
              >
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
                    fontFamily="sans-serif"
                    fontWeight="400"
                    overflow="visible"
                    transform="translate(0 -280.067)"
                  ></path>
                </svg>
              </button>
            )}
            {!validateStart && (
              <button
                onClick={handleShowError}
                className="error-icon"
                disabled={props.isDisabled || props.isReadOnly}
              >
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
            <button
              onClick={handleShow}
              disabled={props.isDisabled || props.isReadOnly}
              className="calendar-btn"
            >
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="511.634px"
                height="511.634px"
                viewBox="0 0 511.634 511.634"
              // style="enable-background:new 0 0 511.634 511.634;"
              >
                <g>
                  <path
                    d="M482.513,83.942c-7.225-7.233-15.797-10.85-25.694-10.85h-36.541v-27.41c0-12.56-4.477-23.315-13.422-32.261
		C397.906,4.475,387.157,0,374.591,0h-18.268c-12.565,0-23.318,4.475-32.264,13.422c-8.949,8.945-13.422,19.701-13.422,32.261v27.41
		h-109.63v-27.41c0-12.56-4.475-23.315-13.422-32.261C178.64,4.475,167.886,0,155.321,0H137.05
		c-12.562,0-23.317,4.475-32.264,13.422c-8.945,8.945-13.421,19.701-13.421,32.261v27.41H54.823c-9.9,0-18.464,3.617-25.697,10.85
		c-7.233,7.232-10.85,15.8-10.85,25.697v365.453c0,9.89,3.617,18.456,10.85,25.693c7.232,7.231,15.796,10.849,25.697,10.849h401.989
		c9.897,0,18.47-3.617,25.694-10.849c7.234-7.234,10.852-15.804,10.852-25.693V109.639
		C493.357,99.739,489.743,91.175,482.513,83.942z M347.187,45.686c0-2.667,0.849-4.858,2.56-6.567
		c1.711-1.711,3.901-2.568,6.57-2.568h18.268c2.67,0,4.853,0.854,6.57,2.568c1.712,1.712,2.567,3.903,2.567,6.567v82.224
		c0,2.666-0.855,4.853-2.567,6.567c-1.718,1.709-3.9,2.568-6.57,2.568h-18.268c-2.669,0-4.859-0.855-6.57-2.568
		c-1.711-1.715-2.56-3.901-2.56-6.567V45.686z M127.915,45.686c0-2.667,0.855-4.858,2.568-6.567
		c1.714-1.711,3.901-2.568,6.567-2.568h18.271c2.667,0,4.858,0.854,6.567,2.568c1.711,1.712,2.57,3.903,2.57,6.567v82.224
		c0,2.666-0.855,4.856-2.57,6.567c-1.713,1.709-3.9,2.568-6.567,2.568H137.05c-2.666,0-4.856-0.855-6.567-2.568
		c-1.709-1.715-2.568-3.901-2.568-6.567V45.686z M456.812,475.088H54.823v-292.36h401.989V475.088z"
                  />
                </g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </svg>
            </button>
          </div>
          <div
            className={
              props.range
                ? `text-box ${props.isDisabled ? "disabled" : ""} ${show === "show-end" ? "focus" : ""
                } ${props.isReadOnly ? "read-only" : ""} ${validateEnd ? "" : "error"
                }`
                : "d-none"
            }
            disabled={props.isDisabled || props.isReadOnly}
          >
            {state.isEndFocused ? (
              <input
                type="text"
                onClick={handleShowEnd}
                onChange={handleEndDateChange}
                onBlur={handleEndBlur}
                onFocus={handleEndFocus}
                autoComplete="off"
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
                name={props.name}
                tabIndex={props.endTabIndex}
              />
            ) : (
              <input
                type="text"
                onClick={handleShowEnd}
                onChange={handleEndDateChange}
                disabled={props.isDisabled || props.isReadOnly}
                readOnly={selectedStart === null ? true : false}
                name={props.name}
                value={endInputValue !== null ? endInputValue : ""}
                onBlur={handleEndBlur}
                onFocus={handleEndFocus}
                autoComplete="off"
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

            {props.isUndo && props.range && (
              <button
                className="icon-btn"
                onClick={handleStartUndo}
                disabled={props.isDisabled || props.isReadOnly}
              >
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

            {props.isClear && isEndFocused && (
              <button
                onClick={handleClearClickEnd}
                className="clear-btn"
                disabled={props.isDisabled || props.isReadOnly}
              >
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
                    fontFamily="sans-serif"
                    fontWeight="400"
                    overflow="visible"
                    transform="translate(0 -280.067)"
                  ></path>
                </svg>
              </button>
            )}
            {!validateEnd && (
              <button
                onClick={handleShowEndError}
                className="error-icon"
                disabled={props.isDisabled || props.isReadOnly}
              >
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
            <button
              onClick={handleShow}
              disabled={props.isDisabled || props.isReadOnly}
              className="calendar-btn"
            >
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="511.634px"
                height="511.634px"
                viewBox="0 0 511.634 511.634"
              // style="enable-background:new 0 0 511.634 511.634;"
              >
                <g>
                  <path
                    d="M482.513,83.942c-7.225-7.233-15.797-10.85-25.694-10.85h-36.541v-27.41c0-12.56-4.477-23.315-13.422-32.261
		C397.906,4.475,387.157,0,374.591,0h-18.268c-12.565,0-23.318,4.475-32.264,13.422c-8.949,8.945-13.422,19.701-13.422,32.261v27.41
		h-109.63v-27.41c0-12.56-4.475-23.315-13.422-32.261C178.64,4.475,167.886,0,155.321,0H137.05
		c-12.562,0-23.317,4.475-32.264,13.422c-8.945,8.945-13.421,19.701-13.421,32.261v27.41H54.823c-9.9,0-18.464,3.617-25.697,10.85
		c-7.233,7.232-10.85,15.8-10.85,25.697v365.453c0,9.89,3.617,18.456,10.85,25.693c7.232,7.231,15.796,10.849,25.697,10.849h401.989
		c9.897,0,18.47-3.617,25.694-10.849c7.234-7.234,10.852-15.804,10.852-25.693V109.639
		C493.357,99.739,489.743,91.175,482.513,83.942z M347.187,45.686c0-2.667,0.849-4.858,2.56-6.567
		c1.711-1.711,3.901-2.568,6.57-2.568h18.268c2.67,0,4.853,0.854,6.57,2.568c1.712,1.712,2.567,3.903,2.567,6.567v82.224
		c0,2.666-0.855,4.853-2.567,6.567c-1.718,1.709-3.9,2.568-6.57,2.568h-18.268c-2.669,0-4.859-0.855-6.57-2.568
		c-1.711-1.715-2.56-3.901-2.56-6.567V45.686z M127.915,45.686c0-2.667,0.855-4.858,2.568-6.567
		c1.714-1.711,3.901-2.568,6.567-2.568h18.271c2.667,0,4.858,0.854,6.567,2.568c1.711,1.712,2.57,3.903,2.57,6.567v82.224
		c0,2.666-0.855,4.856-2.57,6.567c-1.713,1.709-3.9,2.568-6.567,2.568H137.05c-2.666,0-4.856-0.855-6.567-2.568
		c-1.709-1.715-2.568-3.901-2.568-6.567V45.686z M456.812,475.088H54.823v-292.36h401.989V475.088z"
                  />
                </g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </svg>
            </button>
          </div>
        </div>
        {/* ===== display value :: end ===== */}
      </div>
      {/* {props.disableControl && (
        <button className="table-btn functional" onClick={handleEnable}>
          {!props.isDisabled ? "Disable" : "Enable"}
        </button>
      )}

      {props.resetControl && (
        <button className="table-btn functional" onClick={handleReset}>
          Reset
        </button>
      )} */}
    </div>
  );
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];