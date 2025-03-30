// ✅ FRONTEND: DatabaseInfoPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../services/apiClient";

const DatabaseInfo = () => {
  const { id } = useParams(); // connectionId
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await apiGet(`/connections/${id}/meta`);
        setInfo(res.data);
      } catch (err) {
        console.error("Error loading DB info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, [id]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!info) return <div className="container mt-4">No info available.</div>;

  return (
    <div className="container mt-4">
      <h3>Database Info</h3>
      <div className="card p-3 mb-3">
        <p>
          <strong>Name:</strong> {info.name}
        </p>
        <p>
          <strong>Type:</strong> {info.db_type}
        </p>
        <p>
          <strong>Host:</strong> {info.host}
        </p>
        <p>
          <strong>Status:</strong> {info.is_active ? "Active" : "Inactive"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(info.created_at).toLocaleString()}
        </p>
      </div>

      {info.metadata && (
        <div>
          <h5>Tables</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {info.metadata.map((db) => (
                <tr key={db.name}>
                  <td>{db.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DatabaseInfo;
