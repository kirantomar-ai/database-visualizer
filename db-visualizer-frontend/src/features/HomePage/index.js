import React from "react";
import { useNavigate } from "react-router-dom";
import { MongoIcon, MySQLIcon } from "../../assets";

export default function HomePage() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    navigate(`/dbconnect?type=${type}`);
  };

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4 fw-bold">Welcome to Database Visualizer</h1>
      <p className="lead mb-5">
        Start exploring your data visually — begin by selecting a database type
        below.
      </p>

      <div className="row justify-content-center">
        {/* MongoDB Card */}
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-sm h-100 cursor-pointer"
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect("mongodb")}
          >
            <MongoIcon
              className="card-img-top p-4"
              alt="MongoDB"
              style={{ height: "200px", objectFit: "contain" }}
            />
            <div className="card-body">
              <h5 className="card-title fw-semibold">Connect to MongoDB</h5>
              <p className="card-text">
                NoSQL database for flexible document-based storage.
              </p>
            </div>
          </div>
        </div>

        {/* MySQL Card */}
        <div className="col-md-4 mb-4">
          <div
            className="card shadow-sm h-100 cursor-pointer"
            style={{ cursor: "pointer" }}
            onClick={() => handleSelect("mysql")}
          >
            <MySQLIcon
              className="card-img-top p-4"
              alt="MySQL"
              style={{ height: "200px", objectFit: "contain" }}
            />
            <div className="card-body">
              <h5 className="card-title fw-semibold">Connect to MySQL</h5>
              <p className="card-text">
                Relational database for structured data and fast querying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
