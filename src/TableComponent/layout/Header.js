import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation().pathname;

  return (
    <div className="header">
      <Link className={`header-link ${location === "/table1" && "active"}`} to="/">
        Table 1
      </Link>
      <Link
        className={`header-link ${location === "/table2" && "active"}`}
        to="/table2"
      >
        Table 2
      </Link>
      <Link
        className={`header-link ${location === "/table3" && "active"}`}
        to="/table3"
      >
        Table 3
      </Link>
      {/* <Link
        className={`header-link ${location === "/table4" && "active"}`}
        to="/table4"
      >
        Table4
      </Link> */}

      <Link
        to="/demo-code"
        className={`header-link ${location === "/demo-code" && "active"}`}
      >
        Demo Code
      </Link>
    </div>
  );
};

export default Header;
