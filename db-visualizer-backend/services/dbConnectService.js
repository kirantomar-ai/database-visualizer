const mysql = require("mysql2/promise");
const { MongoClient } = require("mongodb");

// 👇 This does NOT touch the app's own DB. Just connects to user-supplied DB.
const connectToDatabase = async (config) => {
  const { dbType } = config;

  if (dbType === "mongodb") {
    return connectToMongo(config);
  } else if (dbType === "mysql") {
    return connectToMySQL(config);
  } else {
    throw new Error(`Unsupported database type: ${dbType}`);
  }
};

// 🔗 MongoDB: Temporary connection to user-provided URI
const connectToMongo = async ({ mongoUri }) => {
  try {
    const client = new MongoClient(mongoUri, { serverApi: "1" });
    await client.connect();

    const admin = client.db().admin();
    const dbs = await admin.listDatabases();

    // Close immediately after fetching
    await client.close();

    return {
      message: "MongoDB connection successful",
      databases: dbs.databases.map((db) => db.name),
    };
  } catch (err) {
    throw new Error(`MongoDB connection failed: ${err.message}`);
  }
};

// 🔗 MySQL: Temporary connection to user-supplied server
const connectToMySQL = async ({ host, port, user, password, database }) => {
  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database, // optional
    });

    const [rows] = await connection.query("SHOW DATABASES");
    await connection.end();

    return {
      message: "MySQL connection successful",
      databases: rows.map((row) => row.Database),
    };
  } catch (err) {
    throw new Error(`MySQL connection failed: ${err.message}`);
  }
};

module.exports = {
  connectToDatabase,
};
