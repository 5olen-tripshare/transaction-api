const express = require("express");
const path = require("path");
const verifyJWT = require("../middlewares/auth.middleware");
const multer = require("multer");
const upload = multer();
const app = express();

const {
  getAllTransactionsByAccommodation,
  createTransaction,
  deleteTransaction,
  getAllTransactionsByUser,
  countTransactionsByAccommodation,
} = require("../services/transaction.service");

const router = express.Router();

router.post("/", upload.none(), verifyJWT, async (req, res) => {
  try {
    const userIdFromToken = req.user.sub;
    const { totalPrice, startDate, endDate, accommodationId } = req.body;

    const newTransaction = {
      userId: userIdFromToken,
      totalPrice: totalPrice,
      startDate: startDate,
      endDate: endDate,
      accommodationId: accommodationId,
    };

    console.log(newTransaction);

    const transaction = await createTransaction(newTransaction);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/accommodation/:id", verifyJWT, async (req, res) => {
  try {
    const transactions = await getAllTransactionsByAccommodation(req.params.id);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:id", verifyJWT, async (req, res) => {
  try {
    const userIdFromToken = req.user.sub;

    const transactions = await getAllTransactionsByUser(userIdFromToken);
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
