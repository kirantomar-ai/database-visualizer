// ✅ FRONTEND: TableData.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../services/apiClient";
import DataTable from "react-data-table-component";

export default function TableData() {
  const { id, tableName } = useParams();
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const fetchData = async (id, tableName, page) => {
    setLoading(true);
    try {
      const res = await apiGet(
        `/connections/${id}/tables/${tableName}?page=${page}&limit=${perPage}`
      );
      const { data, total } = res.data;

      if (data.length > 0) {
        const dynamicColumns = Object.keys(data[0]).map((key) => ({
          name: key,
          selector: (row) => row[key],
          sortable: true,
        }));
        setColumns(dynamicColumns);
      }

      setTableData(data);
      setTotalRows(total);
    } catch (err) {
      console.error("Failed to load table data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(id, tableName, page);
  }, [id, tableName, page]);

  const handlePageChange = (page) => {
    setPage(page);
  };
  const formattedTableData = useMemo(() => {
    if (tableData) {
      console.log({ tableData });
      return tableData.map((row) => {
        Object.keys(row).forEach((key) => {
          if (typeof row[key] !== "string") {
            row[key] = JSON.stringify(row[key]);
          }
        });
        return row;
      });
    }
  }, [tableData]);

  return (
    <div className="container mt-4">
      <h4>Table: {tableName}</h4>
      <DataTable
        columns={columns}
        data={formattedTableData}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationPerPage={perPage}
        onChangePage={handlePageChange}
        highlightOnHover
        responsive
      />
    </div>
  );
}
