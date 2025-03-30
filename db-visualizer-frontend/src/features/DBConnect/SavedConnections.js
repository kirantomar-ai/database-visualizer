import React, { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../../services/apiClient";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDbInfo } from "../../store/dbSlice";

const SavedConnections = ({ userId = 1 }) => {
  const [connections, setConnections] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchConnections();
  }, []);
  useEffect(() => {
    if (Array.isArray(connections) && connections.length > 1) {
      connections.forEach((connection) => {
        if (connection.is_active) {
          fetchMeta(connection.id);
        }
      });
    }
  }, [connections]);

  const fetchConnections = async () => {
    try {
      const res = await apiGet(`connections?user_id=${userId}`);
      setConnections(res.data.data || []);
    } catch (err) {
      console.error("Error fetching connections:", err.message);
    }
  };

  const handleActivate = async (id) => {
    try {
      await apiPatch(`connections/activate/${id}`, { user_id: userId });
      fetchConnections(); // Refresh list
    } catch (err) {
      alert("Failed to activate connection: " + err.message);
    }
  };
  const handleNavigateToInfo = async (id) => {
    navigate(`/db/${id}`);
  };
  const fetchMeta = async (id) => {
    try {
      const res = await apiGet(`/connections/${id}/meta`);
      console.log({ res: res.data });
      dispatch(setDbInfo(res.data));
    } catch (err) {
      console.error("Error loading DB info", err);
    }
  };
  return (
    <div className="container mt-4">
      <h3>Your Saved Database Connections</h3>

      {connections.length === 0 ? (
        <p>No connections found.</p>
      ) : (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Host / URI</th>
              <th>Status</th>
              <th style={{ minWidth: "150px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {connections.map((conn) => (
              <tr key={conn.id}>
                <td>{conn.name}</td>
                <td>{conn.db_type}</td>
                <td>{conn.host}</td>
                <td>
                  {conn.is_active ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-secondary">Inactive</span>
                  )}
                </td>
                <td>
                  {!conn.is_active ? (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleActivate(conn.id)}
                    >
                      Set Active
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleNavigateToInfo(conn.id)}
                    >
                      View DB Info
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SavedConnections;
