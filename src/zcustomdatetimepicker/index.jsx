import React, {useState} from "react";
import { Container } from "react-bootstrap";
import ReactDateTimePicker from "./ReactDateTimePicker";
import ReactMonth from "./ReactMonth";

function DatePicker() {
  // const [isDisabled, setIsDisabled] = useState(false);
  const [startValue, setStartValue] = useState("");
  const [monthValue, setMonthValue] = useState("02/2022");
  const [reset, setReset] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false);

  // const handleReset = () => {
  //   setStartValue("");
  //   setReset(true);
  // }
  // console.log(startValue)

  return (
    <Container className="py-5">
      <ReactDateTimePicker
        name="min-current-time"
        id="min-current-time"
        selectedMode="dateTime"
        value={startValue}
        onChange={(date) => setStartValue(date)}
        minDate={true}
        isMinCurrentTime={true}
        range
        clockTimeFormat={"am-pm"}
      />
        <p>Result: {startValue}</p>
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
