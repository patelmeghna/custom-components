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
        minimumDate={"2020-02-12"}
      />

      <h4>Month only</h4>

      <VMonth
        defaultSelectedMonth={"2023-07"}
        id="month"
        disableControl
        setIsDisabled={setIsDisabled}
        isDisabled={isDisabled}
        resetControl
      />
    </Container>
  );
}

export default DatePicker;
