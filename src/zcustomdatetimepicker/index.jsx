import React from "react";
import ModifiedDatePicker from "./ModifiedDatePicker";
import { Container } from "react-bootstrap";

function DatePicker() {
  // const handleClick = (data) => {
  //   console.log(data);
  // };

  return (
    <Container className="py-5">
      <ModifiedDatePicker id="date-picker-1" />
    </Container>
  );
}

export default DatePicker;
