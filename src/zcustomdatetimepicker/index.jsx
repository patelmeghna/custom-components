import React, {useState} from "react";
import { Container } from "react-bootstrap";
import ReactDateTimePicker from "./ReactDateTimePicker";
import ReactMonth from "./ReactMonth";

function DatePicker() {
  // const [isDisabled, setIsDisabled] = useState(false);
  const [startValue, setStartValue] = useState("");
  const [monthValue, setMonthValue] = useState("02/2022");

  // console.log('length', startValue)

  return (
    <Container className="py-5">
      <ReactDateTimePicker
        name="date-disable-reset"
        format="yyyy/mm/dd"
        selectedMode="dateTime"
        onChange={(data) => setStartValue(data)}
        value={startValue}
        id="disable-reset-demo"
        range
        minDate
        isClear
        clearClick={() => {alert("hello")}}
        isSecondHide={true}
        clockTimeFormat="am-pm"
        error
        isUndo
        // isMinCurrentTime
      />

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
