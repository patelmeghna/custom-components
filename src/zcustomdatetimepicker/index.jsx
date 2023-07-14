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
        name="date-disable-reset"
        format="dd-mm-yyyy"
        selectedMode="dateTime"
        onChange={(data) => setStartValue(data)}
        value={startValue}
        id="disable-reset-demo"
        range
        minDate="2023-07-14"
        isClear
        // clearClick

      />

      <br />

      <VDateTimePicker
        name="demo-date"
        format="yyyy/mm/dd"
        placeholder="Add date in formate of yyyy/mm/dd"
        onChange={(data) => setEndValue(data)}
        value={endValue}
        id="placeholder-demo"
        minDate="2023-07-14"
        maxDate="2024-04-29"
      />
      {/* <p>from {startValue} To {endValue}</p> */}
      <br />
      {/* <VDateTimePicker id="date-picker" onChange={(e) => setStartValue(e)} />
      <p>second {startValue}</p> */}

      <h4>Month only</h4>

      <VMonth
        defaultSelectedMonth="2022-02"
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
        // onChange={(data) => setMonthValue(data)}
        // value={monthValue}
      />
      <p>Result: {monthValue}</p>
    </Container>
  );
}

export default DatePicker;
