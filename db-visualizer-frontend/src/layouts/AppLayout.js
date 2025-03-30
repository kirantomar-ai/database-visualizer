import React, { useState } from "react";
import SideNavbar from "./SideNavbar";
import TopNavbar from "./TopNavbar";
import "./layouts.css";

export default function AppLayout(props) {
  const [showSideNavbar, setShowSideNavbar] = useState(false);
  const handleShowSideNavbar = () => {
    setShowSideNavbar(!showSideNavbar);
  };
  const handleClose = () => setShowSideNavbar(false);
  return (
    <>
      <TopNavbar handleMenuclick={handleShowSideNavbar} />
      <SideNavbar
        showSideNavbar={showSideNavbar}
        handleClose={handleClose}
        navLinks={props.navLinks}
      />
      <div className="app-body">{props.children}</div>
    </>
  );
}
