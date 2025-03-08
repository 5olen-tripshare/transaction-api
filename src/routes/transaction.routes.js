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
  checkUserTransactionConflict,
  filterAccommodations,
} = require("../services/transaction.service");

const router = express.Router();

router.post("/check", verifyJWT, async (req, res) => {
  try {
    const userIdFromToken = req.user.sub;
    const { accommodationId, startDate, endDate } = req.body;

    const check = await checkUserTransactionConflict(
      userIdFromToken,
      accommodationId,
      new Date(startDate),
      new Date(endDate)
    );

    res.json(check);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/filter", async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        message: "La date de début doit être antérieure à la date de fin",
      });
    }

    const availableAccommodations = await filterAccommodations(
      search,
      startDate,
      endDate
    );
    res.json(availableAccommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/count/accommodation", async (req, res) => {
  try {
    const { accommodationId, startDate, endDate } = req.body;

    const transactionCount = await countTransactionsByAccommodation(
      accommodationId,
      new Date(startDate),
      new Date(endDate)
    );
    res.json({ accommodationId: accommodationId, transactionCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user", verifyJWT, async (req, res) => {
  try {
    const userIdFromToken = req.user.sub;

    const transactions = await getAllTransactionsByUser(userIdFromToken);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    await deleteTransaction(req.params.id);
    res.json({ message: "Réservation annulée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
