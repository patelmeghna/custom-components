import React, {useState} from "react";
import VDateTimePicker from "./VDateTimePicker";
import { Container } from "react-bootstrap";
import VMonth from "./VMonth";

function DatePicker() {
  // const [isDisabled, setIsDisabled] = useState(false);
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState("");
  const [monthValue, setMonthValue] = useState("");

  return (
    <Container className="py-5">
      <VDateTimePicker
        id="date-picker-1"
        className="custom-date-picker"
        // defaultValue={"2022-02-12 12:12:00 To 2022-01-23 12:20:10"}
        minDate
        range
        isMinCurrentTime
        // isClear
        // clearClick
        // clearClickEnd
        isUndo
        undoClick
        selectedMode="dateTime"
        // hideError
        // errorMsg="Dummy error msg"
        // isSecondHide
        format="dd-mm-yyyy"
        clockTimeFormat="am-pm"
        // placeholder="Add date"
        // isDisabled
        maxDate="2024-03-12"
        onChange={(data) => setStartValue(data)}
        onEndChange={(end) => setEndValue(end)}
        // startTabIndex
        // endTabIndex
        value={startValue}
        eValue={endValue}
      />
      <p>from {startValue} To {endValue}</p>
      <br />
      {/* <VDateTimePicker id="date-picker" onChange={(e) => setStartValue(e)} />
      <p>second {startValue}</p> */}

      <h4>Month only</h4>

      <VMonth
        // defaultSelectedMonth={"2023-07"}
        id="month"
        isUndo
        // disableControl
        // setIsDisabled={setIsDisabled}
        // isDisabled={isDisabled}
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
