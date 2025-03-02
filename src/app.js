const express = require("express");
const path = require("path");
const cors = require("cors");
const transactionRoutes = require("./routes/transaction.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Microservice transaction is running...");
});

module.exports = app;
