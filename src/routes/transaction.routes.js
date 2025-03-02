const express = require("express");
const path = require("path");
const verifyJWT = require("../middlewares/auth.middleware");
const app = express();

const {
  getAllTransactionsByAccommodation,
  createTransaction,
  deleteTransaction,
  getAllTransactionsByUser,
} = require("../services/transaction.service");

const router = express.Router();

router.post("/", verifyJWT, async (req, res) => {
  try {
    const newTransaction = await createTransaction(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/accommodation/:id", verifyJWT, async (req, res) => {
  try {
    const transactions = await getAllTransactionsByAccommodation(
      req.params.accommodationId
    );
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:id", verifyJWT, async (req, res) => {
  try {
    const transactions = await getAllTransactionsByUser(req.params.userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    await deleteTransaction(req.params.id);
    res.json({ message: "Réservation annulée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/count/accommodation/:id", async (req, res) => {
  try {
    const transactionCount = await countTransactionsByAccommodation(
      req.params.accommodationId
    );
    res.json({ accommodationId: req.params.accommodationId, transactionCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
