import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiPost } from "../../services/apiClient";

const DBCredential = () => {
  const [params] = useSearchParams();
  const initialType = params.get("type") || "mongodb";

  const [dbType, setDbType] = useState(initialType);
  const [credentials, setCredentials] = useState({
    mongoUri: "",
    host: "",
    port: "",
    user: "",
    password: "",
    database: "",
  });

  // Sync state if URL changes (optional)
  useEffect(() => {
    setDbType(initialType);
  }, [initialType]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload =
      dbType === "mongodb"
        ? { dbType, mongoUri: credentials.mongoUri, name: credentials.name }
        : {
            dbType,
            name: credentials.name,
            host: credentials.host,
            port: credentials.port,
            user: credentials.user,
            password: credentials.password,
            database: credentials.database,
          };

    try {
      const res = await apiPost("connections/save", payload);
      alert("Connection saved successfully!");
    } catch (err) {
      alert("Error saving connection: " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Connect to a Database</h2>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Select Database Type</label>
          <select
            className="form-select"
            value={dbType}
            onChange={(e) => setDbType(e.target.value)}
          >
            <option value="mongodb">MongoDB</option>
            <option value="mysql">MySQL</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Connection Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={credentials.name || ""}
            onChange={handleChange}
            required
          />
        </div>

        {dbType === "mongodb" ? (
          <div className="mb-3">
            <label className="form-label">MongoDB URI</label>
            <input
              type="text"
              className="form-control"
              name="mongoUri"
              value={credentials.mongoUri}
              onChange={handleChange}
              placeholder="mongodb+srv://user:pass@cluster.mongodb.net"
              required
            />
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Host</label>
              <input
                type="text"
                className="form-control"
                name="host"
                value={credentials.host}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Port</label>
              <input
                type="text"
                className="form-control"
                name="port"
                value={credentials.port}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="user"
                value={credentials.user}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Initial Database Name (Optional)
              </label>
              <input
                type="text"
                className="form-control"
                name="database"
                value={credentials.database}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
};

export default DBCredential;
