import React from "react";
import DBCredential from "./DBCredential";
import SavedConnections from "./SavedConnections";

export default function index() {
  return (
    <div>
      <DBCredential />
      <SavedConnections />
    </div>
  );
}
