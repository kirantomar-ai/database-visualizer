import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../features/HomePage";
import DatabaseInfo from "../features/DatabaseInfo";
import TableData from "../features/TableData";
import DBConnect from "../features/DBConnect";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dbconnect" element={<DBConnect />} />
        <Route path="/db/:id" element={<DatabaseInfo />} />
        <Route path="/db/:id/table/:tableName" element={<TableData />} />
        <Route path="*" element={<div>404! Page Not Found.</div>} />
      </Routes>
    </>
  );
}
