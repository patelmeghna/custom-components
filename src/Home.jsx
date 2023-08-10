import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Container className="py-5">
      <h2 className="mb-3 text-center">Custom Components</h2>
      <div className="d-flex align-items-center justify-content-center flex-wrap">
        <Link className="btn btn-primary m-1" to="/table1">
          Custom Table
        </Link>
        <Link className="btn btn-primary m-1" to="/table1">
          Custom Assignment Panel
        </Link>
        <Link className="btn btn-primary m-1" to="/date-picker">
          Custom Date Time Picker
        </Link>
        <Link className="btn btn-primary m-1" to="/tab-coms">
          Custom Tab
        </Link>
        <Link className="btn btn-primary m-1" to="/customize-map">Map Customization</Link>
      </div>
    </Container>
  );
};

export default Home;
