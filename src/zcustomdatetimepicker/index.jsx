import React from "react";
import VDateTimePicker from "./VDateTimePicker";
import { Container } from "react-bootstrap";
import VMonth from "./VMonth";

function DatePicker() {
  // const [isDisabled, setIsDisabled] = useState(false);

  return (
    <Container className="py-5">
      <VDateTimePicker
        id="date-picker-1"
        className="custom-date-picker"
        // defaultValue={"2022-02-12 12:12:00 To 2022-01-23 12:20:10"}
        // minDate
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
        placeholder="Add date"
        // isDisabled
        // maxDate="2023-07-12"
        // onChange={(data) => console.log(data)}
        // onEndChange={(end) => alert(end)}
        // startTabIndex
        // endTabIndex
      />
      <br />

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
      />
    </Container>
  );
}

export default DatePicker;
