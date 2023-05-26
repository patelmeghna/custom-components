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
        // defaultValue={"2022-02-12 To 2022-03-21"}
        // minDate
        // range
        selectedMode="dateTime"
        format="YYYY/MM/DD"
        clockTimeFormat="am-pm"
        placeholder="Add date"
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
