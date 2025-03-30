const express = require("express");
const router = express.Router();
const {
  handleDbConnect,
  saveDbConnection,
  activateConnection,
  getUserConnections,
  getConnectionMeta,
  getTableData,
  getActiveConnection,
} = require("../controllers/connectController");

router.get("/", getUserConnections);
router.post("/save", saveDbConnection);
router.patch("/activate/:id", activateConnection);
router.get("/:id/meta", getConnectionMeta);
router.get("/:id/tables/:tableName", getTableData);
router.get("/active", getActiveConnection);

module.exports = router;
