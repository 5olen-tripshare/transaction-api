const Transaction = require("../models/transaction.model");
const axios = require("axios");

const API_URL = process.env.GATEWAY_URI;

const createTransaction = async (data) => {
  try {
    const newTransaction = new Transaction(data);
    return await newTransaction.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllTransactionsByAccommodation = async (accommodationId) => {
  return await Transaction.find({ accommodationId });
};

const getAllTransactionsByUser = async (userId) => {
  const transactions = await Transaction.find({ userId });

  const transactionsDetail = transactions.map(async (transaction) => {
    try {
      const transactionObj = transaction.toObject();

      const response = await axios.get(
        `${API_URL}/api/accommodations/${transaction.accommodationId}`
      );

      return {
        ...transactionObj,
        accommodation: response.data,
      };
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'hébergement ${transaction.accommodationId}:`,
        error.message
      );

      return transaction.toObject();
    }
  });

  const transactionsResults = await Promise.all(transactionsDetail);
  return transactionsResults;
};

const checkUserTransactionConflict = async (
  userId,
  accommodationId,
  startDate,
  endDate
) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const existingTransaction = await Transaction.findOne({
      userId,
      accommodationId,
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    return !!existingTransaction;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};

const countTransactionsByAccommodation = async (
  accommodationId,
  startDate,
  endDate
) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const transactionCount = await Transaction.countDocuments({
      accommodationId,
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    });

    return transactionCount;
  } catch (error) {
    throw new Error(error.message);
  }
};

const filterAccommodations = async (search, startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const response = await axios.get(`${API_URL}/api/accommodations/search`, {
      params: { search },
    });

    const accommodations = response.data;

    const availability = accommodations.map(async (accommodation) => {
      const transactions = await Transaction.find({
        accommodationId: accommodation._id,
        $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
      });

      const totalPlaces = transactions.length;

      const available = totalPlaces < accommodation.totalPlaces;

      return {
        ...accommodation,
        available,
      };
    });

    const availabilityResults = await Promise.all(availability);

    return availabilityResults.filter((acc) => acc.available);
  } catch (error) {
    throw new Error(
      `Erreur lors de la vérification de disponibilité: ${error.message}`
    );
  }
};

module.exports = {
  createTransaction,
  getAllTransactionsByAccommodation,
  getAllTransactionsByUser,
  deleteTransaction,
  countTransactionsByAccommodation,
  checkUserTransactionConflict,
  filterAccommodations,
};
