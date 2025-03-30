const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const apiKeyValidator = require("./middleware/apiKeyValidator");

const app = express();
app.use(cors());
app.use(express.json());

// API Key protection
app.use(apiKeyValidator);

// Routes
const connectRoutes = require("./routes/connectRoutes");
app.use("/api/connections", connectRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
