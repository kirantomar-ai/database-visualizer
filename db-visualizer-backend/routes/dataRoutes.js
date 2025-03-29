const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/collections", async (req, res) => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  res.json({ data: collections.map((col) => col.name) });
});

router.get("/collection/:name", async (req, res) => {
  const { name } = req.params;
  const collection = mongoose.connection.db.collection(name);
  const docs = await collection.find({}).limit(100).toArray();
  res.json({ data: docs });
});

module.exports = router;
