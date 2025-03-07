const express = require("express");
const path = require("path");
const cors = require("cors");
const transactionRoutes = require("./routes/transaction.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("Microservice transaction is running...");
});

module.exports = app;
