const { connectToDatabase } = require("../services/dbConnectService");
const { MongoClient } = require("mongodb");
const mysql = require("mysql2/promise");
const db = require("../config/db");

const handleDbConnect = async (req, res) => {
  try {
    const result = await connectToDatabase(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const saveDbConnection = async (req, res) => {
  try {
    let {
      user_id = 1, // TEMP: Replace with JWT-based user ID later
      dbType,
      name,
      host,
      port,
      user,
      password,
      database,
      mongoUri,
    } = req.body;
    console.log({ req: req.body });
    if (dbType === "mongodb" && mongoUri) {
      host = mongoUri;
    }

    const sql = `
      INSERT INTO db_connections
        (user_id, db_type, name, host, port, user, password, database_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      user_id,
      dbType,
      name,
      host || null,
      port || null,
      user || null,
      password || null,
      database || null,
    ];

    await db.execute(sql, values);

    res.json({ success: true, message: "Connection saved successfully" });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ success: false, error: err.message });
  }
};

const activateConnection = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const userId = req.body.user_id || 1; // Replace with JWT later

    // Deactivate all user's connections
    await db.execute(
      "UPDATE db_connections SET is_active = FALSE WHERE user_id = ?",
      [userId]
    );

    // Activate selected connection
    await db.execute(
      "UPDATE db_connections SET is_active = TRUE WHERE id = ? AND user_id = ?",
      [connectionId, userId]
    );

    res.json({ success: true, message: "Connection activated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getUserConnections = async (req, res) => {
  const userId = req.query.user_id;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM db_connections WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getConnectionMeta = async (req, res) => {
  const connectionId = req.params.id;

  try {
    // Step 1: Get saved credentials
    const [rows] = await db.execute(
      "SELECT * FROM db_connections WHERE id = ?",
      [connectionId]
    );
    console.log({ connectionId, rows });
    if (rows.length === 0)
      return res.status(404).json({ error: "Connection not found" });

    const connection = rows[0];
    const dbName = connection.database_name;
    if (!(dbName || connection.host))
      return res
        .status(400)
        .json({ error: "Database name or host not set for this connection." });

    let metadata = [];

    // Step 2: Fetch table/collection list from known database
    if (connection.db_type === "mysql") {
      const conn = await mysql.createConnection({
        host: connection.host,
        port: connection.port,
        user: connection.user,
        password: connection.password,
        database: dbName,
      });

      const [tables] = await conn.query(`SHOW TABLE STATUS FROM \`${dbName}\``);

      metadata = tables.map((t) => ({
        name: t.Name,
        engine: t.Engine,
        rows: t.Rows,
        size: (t.Data_length / (1024 * 1024)).toFixed(2) + " MB",
      }));

      await conn.end();
    }

    if (connection.db_type === "mongodb") {
      const client = new MongoClient(connection.host);
      await client.connect();
      console.log({ dbName, a: 1 });
      const dbObj = client.db(dbName);
      console.log(dbObj);
      const collections = await dbObj.listCollections().toArray();

      metadata = collections.map((col) => ({
        name: col.name,
        type: col.type,
      }));

      await client.close();
    }

    res.json({
      id: connection.id,
      name: connection.name,
      db_type: connection.db_type,
      host: connection.host,
      database_name: dbName,
      is_active: connection.is_active,
      created_at: connection.created_at,
      metadata,
    });
  } catch (err) {
    console.error("Meta Fetch Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
const getTableData = async (req, res) => {
  const { id, tableName } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // Fetch the DB connection info from your base MySQL
    const [rows] = await db.execute(
      "SELECT * FROM db_connections WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Connection not found" });

    const connection = rows[0];
    const dbName = connection.database_name;
    if (!dbName)
      return res
        .status(400)
        .json({ error: "Database name is not set for this connection." });

    let data = [];
    let total = 0;

    if (connection.db_type === "mysql") {
      const conn = await mysql.createConnection({
        host: connection.host,
        port: connection.port,
        user: connection.user,
        password: connection.password,
        database: dbName,
      });

      const [result] = await conn.query(
        `SELECT * FROM \`${tableName}\` LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      const [countResult] = await conn.query(
        `SELECT COUNT(*) AS total FROM \`${tableName}\``
      );

      data = result;
      total = countResult[0].total;

      await conn.end();
    }

    if (connection.db_type === "mongodb") {
      const client = new MongoClient(connection.host);
      await client.connect();

      const dbObj = client.db(dbName);
      const collection = dbObj.collection(tableName);

      total = await collection.countDocuments();
      data = await collection.find().skip(offset).limit(limit).toArray();

      await client.close();
    }

    res.json({ data, total });
  } catch (err) {
    console.error("Table Data Fetch Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
const getActiveConnection = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM db_connections WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1"
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "No active connection found." });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  handleDbConnect,
  saveDbConnection,
  activateConnection,
  getUserConnections,
  getConnectionMeta,
  getTableData,
  getActiveConnection,
};
