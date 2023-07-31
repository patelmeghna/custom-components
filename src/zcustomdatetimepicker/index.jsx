import React, {useEffect, useState} from "react";
import { Container } from "react-bootstrap";
import ReactDateTimePicker from "./ReactDateTimePicker";
import ReactMonth from "./ReactMonth";

function DatePicker() {
  // const [isDisabled, setIsDisabled] = useState(false);
  const [monthValue, setMonthValue] = useState("02/2022");
  const [dateValue, setDateValue] = useState("");
  const [undoValue, setUndoValue] = useState([""]);
  
  const onDateChange = (data) => {
    setDateValue(data);
  }

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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDateValue('21/09/2023');
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);
  // console.log(dateValue);

  return (
    <Container className="py-5">
      <ReactDateTimePicker
        name="undo-date"
        id="undo-date"
        isUndo={true}
        range
        undoClick={onUndoChange}
        onChange={onDateChange}
        value={dateValue}
        clockTimeFormat="am-pm"
        minDate
        isMinCurrentTime
        selectedMode="dateTime"
        isSecondHide
      />
        <p>Result: {dateValue}</p>
        {/* 
      <div className="d-flex">
        <button className="btn btn-secondary me-2" onClick={() => setIsDisabled(!isDisabled)}>Disable</button>
        <button className="btn btn-danger" onClick={handleReset}>Reset</button>
      </div> */}

      <h4>Month only</h4>

      <ReactMonth
        // defaultSelectedMonth="2022-02"
        id="month"
        isUndo
        // disableControl
        // setIsDisabled={setIsDisabled}
        // isReadOnly
        // resetControl
        // placeholder="Add month"
        // tabIndex
        // hideError
        // errorMsg
        // isClear
        // clearClick
        onChange={(data) => setMonthValue(data)}
        value={monthValue}
      />
      <p>Result: {monthValue}</p>
    </Container>
  );
}

export default DatePicker;
