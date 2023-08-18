import React, { useState, useEffect } from "react";
import ReactDateTimePicker from "./ReactDateTimePicker";
import ReactMonth from "./ReactMonth";

const titleStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#130f5f",
  marginTop: "45px",
};

const DateWithResetAndDisabled = () => {
  const [dateValue, setDateValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [reset, setReset] = useState(false);

  setTimeout(() => {
    setDateValue("28-10-2029");
  }, 5000);
  const [date ,setDate] = useState([])

  const previousDate = (date) => {
    console.log('date' , date)
    setDate(date);
  }

  return (
    <>
      <ReactDateTimePicker
        key={1}
        name="date-disable-reset"
        format="dd-mm-yyyy"
        selectedMode="dateTime"
        onChange={(data) => setDateValue(data)}
        isDisabled={isDisabled}
        value={date[date.length]}
        previousDate={previousDate}
        reset={reset}
        id="disable-reset-demo"
        startTabIndex={"1"}
      />
      <small>Result: </small> {date[date.length-1]}
      <button
        className="btn btn-secondary mr-2 ml-1 btn-sm"
        onClick={() => setIsDisabled(!isDisabled)}
      >
        {!isDisabled ? "Disable" : "Enable"}
      </button>
      <button
        className="btn btn-danger btn-sm"
        onClick={() => {
          setReset(true);
          setDateValue("");
        }}
      >
        Reset
      </button>
    </>
  );
};

const DateWithMinDateMaxDateNPlaceholder = () => {
  const [dateValue, setDateValue] = useState("");


  const [date ,setDate] = useState([])

  const previousDate = (date) => {
    console.log('date' , date)
    setDate(date);
  }

  return (
    <>
      <ReactDateTimePicker
        key={2}
        onChange={(data) => setDateValue(data)}
        name="demo-date"
        format="dd/mm/yyyy"
        placeholder="Add date in formate of yyyy/mm/dd"
        value={date[date.length]}
        previousDate={previousDate}
        id="placeholder-demo"
        minDate="2023-01-14"
        maxDate="2029-04-19"
      />
      <small>Result: </small> {date[date.length-1]}
    </>
  );
};

const DateTime = () => {
  const [dateValue, setDateValue] = useState("");

  const [date ,setDate] = useState([])

  const previousDate = (date) => {
    console.log('date' , date.length-1)
    setDate(date);
  }

  return (
    <>
      <ReactDateTimePicker
        key={3}
        name="demo-datetime"
        format="mm/dd/yyyy"
        selectedMode="dateTime"
        placeholder="MM/DD/YYYY HH:mm"
        onChange={(data) => setDateValue(data)}
        value={date[date.length]}
        previousDate={previousDate}
        id="datetime-demo"
      />
      <small>Result: </small> {date[date.length-1]}
    </>
  );
};

const Month = () => {
  const [monthValue, setMonthValue] = useState("");
 
  
  return (
    <>
      <ReactMonth
        key={4}
        name="demo-month"
        id="demo-month"
        value={monthValue}
        onChange={(data) => setMonthValue(data)}
        />
      <small>Result: </small> {monthValue}
    </>
  );
};

const DateWithValidation = () => {
  const [dateValue, setDateValue] = useState("");
  const[date ,setDate] = useState([]);
  const previousDate = (date) => {
    setDate(date)
  }
  return (
    <>
      <ReactDateTimePicker
        key={5}
        name="demo-date-validation"
        id="date-validation"
        error={true}
        errorMsg="This is invalid selection"
        onChange={(data) => setDateValue(data)}
        previousDate={previousDate}
        value={date[date.length]}
      />
      <small>Result: </small> {date[date.length-1]}
    </>
  );
};

const DatetimeWithRange = () => {
  const [dateValue, setDateValue] = useState("");

  return (
    <>
      <ReactDateTimePicker
        key={6}
        name="date-time-range"
        selectedMode="dateTime"
        range={true}
        id="range-demo"
        isSecondHide
        onChange={(data) => setDateValue(data)}
        value={dateValue}
      />
      <small>Result: </small> {dateValue}
    </>
  );
};

const DateTimeWithDefaultValue = () => {
  const [defValue, setDefValue] = useState("14/07/2023 15:25:55");

  return (
    <>
      <ReactDateTimePicker
        key={7}
        name="date-time-with-value"
        id="date-time-with-value"
        selectedMode="dateTime"
        value={defValue}
        onChange={(data) => setDefValue(data)}
      />
      <small>Result: </small> {defValue}
    </>
  );
};

const DateTimeRangeWithDefaultValue = () => {
  const [defValue, setDefValue] = useState(
    "24/07/2023 15:25:55 To 29/07/2023 02:10:00"
  );

  return (
    <>
      <ReactDateTimePicker
        key={8}
        name="date-time-with-value"
        id="date-time-with-value"
        selectedMode="dateTime"
        value={defValue}
        onChange={(data) => setDefValue(data)}
        range={true}
      />
      <small>Result: </small> {defValue}
    </>
  );
};

const DateTimeWith12HourFormat = () => {
  const [defValue, setDefValue] = useState("12/08/2018 03:25:55 AM");

  return (
    <>
      <ReactDateTimePicker
        key={9}
        name="short-time-format"
        id="short-time-format"
        selectedMode="dateTime"
        value={defValue}
        onChange={(data) => setDefValue(data)}
        clockTimeFormat={"am-pm"}
      />
      <small>Result: </small> {defValue}
    </>
  );
};

const MinDateWithMinCurrentTime = () => {
  const [dateValue, setDateValue] = useState("");
  const [date ,setDate] = useState([])

  const previousDate = (date) => {
    setDate(date)
  }
  return (
    <>
      <ReactDateTimePicker
        key={10}
        name="min-current-time"
        id="min-current-time"
        selectedMode="dateTime"
        value={date[date.length]}
        previousDate={previousDate}
        onChange={(date) => setDateValue(date)}
        minDate={true}
        isMinCurrentTime={true}
      />
      <small>Result: </small> {date[date.length-1]}
    </>
  );
};

const DateTimeUndo = () => {
  const [dateValue, setDateValue] = useState("");
  const [undoValue, setUndoValue] = useState([]);
 

  const onDateChange = (data) => {
    setDateValue(data);
    if (undoValue[undoValue.length - 1] !== dateValue && dateValue !== null) {
      setUndoValue([...undoValue, dateValue]);
    }
 console.log('date',setDateValue(data))
    
  };

  const onUndoChange = () => {
    if (undoValue.length >= 2) {
      setDateValue(undoValue[undoValue.length - 2]);
      setUndoValue((newValue) => newValue.slice(0, -1));
    
    }
  };

  return (
    <>
      <ReactDateTimePicker
        key={11}
        name="undo-date"
        id="undo-date"
        isUndo={true}
        undoClick={onUndoChange}
        onChange={onDateChange}
        value={dateValue}
        selectedMode={"dateTime"}
        isSecondHide={true}
      />

      <small>Result: </small>
      {dateValue}
    </>
  );
};

const DateTimeRangeUndo = () => {
  const [dateValue, setDateValue] = useState("");
  const [undoValue, setUndoValue] = useState([]);

  const onDateChange = (data) => {
    setDateValue(data);
    if (undoValue[undoValue.length - 1] !== dateValue) {
      setUndoValue([...undoValue, dateValue]);
    }
  };

  const onUndoChange = () => {
    if (undoValue.length >= 3) {
      setDateValue(undoValue[undoValue.length - 2]);
      setUndoValue((newValue) => newValue.slice(0, -1));
    }
  };

  useEffect(() => {
    if (undoValue[undoValue.length - 1] !== dateValue && dateValue !== null) {
      setUndoValue([...undoValue, dateValue]);
    }
  }, [dateValue]);

  return (
    <>
      <ReactDateTimePicker
        key={12}
        name="undo-date"
        id="undo-date"
        isUndo={true}
        undoClick={onUndoChange}
        onChange={onDateChange}
        value={dateValue}
        range={true}
      />

      <small>Result: </small>
      {dateValue}
    </>
  );
};

// disable format
const DisabledDateWithValue = () => {
  return (
    <>
      <ReactDateTimePicker
        key={13}
        name="disable-date"
        id="disable-date"
        isDisabled={true}
        value={"2023-05-14"}
        format="DD/MM/YYYY"
      />
    </>
  );
};

const DisabledDatetimeWithValue = () => {
  return (
    <>
      <ReactDateTimePicker
        key={14}
        name="disable-date-time"
        id="disable-date-time"
        isDisabled={true}
        selectedMode="dateTime"
        value={"2023-05-14 15:20"}
      />
    </>
  );
};

const DisabledMonthWithValue = () => {
  return (
    <>
      <ReactMonth
        key={15}
        name="demo-month-disable"
        id="disable-month-demo"
        isDisabled={true}
        value="04/2022"
      />
    </>
  );
};

const DisabledDatetimeRangewithvalue = () => {
  return (
    <>
      <ReactDateTimePicker
        key={16}
        name="disable-range"
        id="disable-range"
        selectedMode="dateTime"
        range={true}
        isDisabled={true}
        value={"2022-02-12 12:12:00 To 2022-01-23 12:20:10"}
      />
    </>
  );
};

// readonly format
const ReadonlyDatewithvalue = () => {
  return (
    <>
      <ReactDateTimePicker
        key={17}
        name="readonly-demo"
        id="readonly-demo"
        value={"2023-03-12"}
        isReadOnly={true}
      />
    </>
  );
};

const ReadonlyDateTimeWithValue = () => {
  return (
    <>
      <ReactDateTimePicker
        key={18}
        name="date=time-readonly"
        id="date-time-readonly"
        isReadOnly={true}
        value={"2023-08-15 12:23"}
      />
    </>
  );
};

const ReadonlyMonthWithValue = () => {
  return (
    <>
      <ReactMonth
        key={19}
        name="readonly-month"
        id="readonly-month"
        value={"2023-09"}
        isReadOnly={true}
      />
    </>
  );
};

const ReadonlyDatetimeRangeWithValue = () => {
  return (
    <>
      <ReactDateTimePicker
        key={20}
        range={true}
        selectedMode="dateTime"
        name="readonly-datetime"
        id="readonly-datetime"
        value={"2023-03-12 12:20 To 2023-04-03"}
        isReadOnly={true}
      />
    </>
  );
};

const DateTimePicker = () => {
  return (
    <div style={{ padding: "120px" }}>
      <h3>DateTimePicker</h3>
      <p className="lead">
        <code>DateTimePicker</code> is used to choose date time values
      </p>
      <h4 id="examples" className="code-headings">
        Examples
      </h4>

      {/* 
      =====================
        example :: begin
      =====================
      */}

      <div>
        {/* date with min max date :: begin */}
        <p style={titleStyle}>Date With minDate, maxDate</p>
        <DateWithMinDateMaxDateNPlaceholder />
        {/* date with min max date :: end */}

        {/* date with disable & reset :: begin */}
        <p style={titleStyle}>Date With Disabled & Reset Handler</p>
        <DateWithResetAndDisabled />
        {/* date with disable & reset :: end */}

        {/* date time :: begin */}
        <p style={titleStyle}>DateTime</p>
        <DateTime />
        {/* date time :: end */}

        {/* date time with range :: begin */}
        <p style={titleStyle}>DateTime with Range</p>
        <DatetimeWithRange />
        {/* date time with range :: end */}

        {/* date time with default value :: begin */}
        <p style={titleStyle}>DateTime with Default Value</p>
        <DateTimeWithDefaultValue />
        {/* date time with default value :: end */}

        {/* date time range with default value :: begin */}
        <p style={titleStyle}>DateTime Range with Default Value</p>
        <DateTimeRangeWithDefaultValue />
        {/* date time range with default value :: end */}

        {/* short time format :: begin */}
        <p style={titleStyle}>Short time format with Default Value</p>
        <DateTimeWith12HourFormat />
        {/* short time format :: end */}

        {/* currentmin time with current min time :: begin */}
        <p style={titleStyle}>Min current date with Min current time</p>
        <MinDateWithMinCurrentTime />
        {/* currentmin time with current min time :: end */}

        {/* undo functionality :: begin */}
        <p style={titleStyle}>Undo value</p>
        <DateTimeUndo />
        {/* undo functionality :: end */}

        {/* undo functionality in range :: begin */}
        <p style={titleStyle}>Undo value</p>
        <DateTimeRangeUndo />
        {/* undo functionality in range :: end */}

        {/* date with validation :: begin */}
        <p style={titleStyle}>Date with Validation</p>
        <DateWithValidation />
        {/* date with validation :: end */}

        {/* month :: begin */}
        <p style={titleStyle}>Month</p>
        <Month />
        {/* month :: end */}

        {/* disable date with value :: begin */}
        <p style={titleStyle}>Disabled Date with value</p>
        <DisabledDateWithValue />
        {/* disable date with value :: end */}

        {/* disable date time with value :: begin */}
        <p style={titleStyle}>Disabled Datetime with value</p>
        <DisabledDatetimeWithValue />
        {/* disable date time with value :: end */}

        {/* disable month with value :: begin */}
        <p style={titleStyle}>Disabled Month with value</p>
        <DisabledMonthWithValue />
        {/* disable month with value :: end */}

        {/* disable date time range with value :: begin */}
        <p style={titleStyle}>Disabled Datetime Range with value</p>
        <DisabledDatetimeRangewithvalue />
        {/* disable date time range with value :: end */}

        {/* readonly date with value :: begin */}
        <p style={titleStyle}>Readonly Date with value</p>
        <ReadonlyDatewithvalue />
        {/* readonly date with value :: end */}

        {/* readonly date time with value :: begin */}
        <p style={titleStyle}>Readonly Datetime with value</p>
        <ReadonlyDateTimeWithValue />
        {/* readonly date time with value :: end */}

        {/* readonly month with value :: begin */}
        <p style={titleStyle}>Readonly Month with value</p>
        <ReadonlyMonthWithValue />
        {/* readonly month with value :: end */}

        {/* readonly date time range with value :: begin */}
        <p style={titleStyle}>Readonly Datetime Range with value</p>
        <ReadonlyDatetimeRangeWithValue />
        {/* readonly date time range with value :: end */}
      </div>

      {/* 
      =====================
        example :: end
      =====================
      */}
    </div>
  );
};

export default DateTimePicker;
