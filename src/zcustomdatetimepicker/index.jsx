import React, { useState } from "react";
import VDateTimePicker from "./VDateTimePicker";
import { Container } from "react-bootstrap";
import VMonth from "./VMonth";

function DatePicker() {
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <Container className="py-5">
      <VDateTimePicker
        id="date-picker-1"
        className="custom-date-picker"
        // defaultValue={"2022-02-12 12:12"}
        // minDate
        range
        // selectedMode="dateTime"
        // hideError
        // errorMsg="Dummy error msg"
        isSecondHide
        format="dd-mm-yyyy"
        // clockTimeFormat="am-pm"
        placeholder="Add date"
        // isDisabled
        // maxDate="2023-07-12"
        // onChange={(data) => alert(data)}
        // onEndChange={(end) => alert(end)}
      />

      <h4>Month only</h4>

      <VMonth
        // defaultSelectedMonth={"2023-07"}
        id="month"
        disableControl
        setIsDisabled={setIsDisabled}
        // isDisabled={isDisabled}
        resetControl
        // placeholder="Add month"
      />
    </Container>
  );
}

export default DatePicker;
