import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header style={headerStyle}>
      <h1>Know your Bitcoin rate!</h1>
      <Link style={linkStyle} to="/">Main</Link>
      {" "}|{" "}
      <Link style={linkStyle} to="/about">About</Link>
    </header>
  );
}

const headerStyle = {
  height: "100px",
  background: "#000",
  color: "#fff",
  textAlign: "center",
  padding: "10px",
  borderBottom: "3px solid #fcc118"

};

const linkStyle = {
  color: "#fff",
  textDecoration: "none"
};

export default Header;
