const expectedKey = process.env.CLIENT_API_KEY || "db-visualizer-client-key";

const apiKeyValidator = (req, res, next) => {
  console.log("REQUEST");
  const clientKey = req.headers["x-api-key"];
  if (!clientKey || clientKey !== expectedKey) {
    return res.status(403).json({ error: "Forbidden: Invalid API Key" });
  }
  next();
};

module.exports = apiKeyValidator;
