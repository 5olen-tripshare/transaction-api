const Transaction = require("../models/transaction.model");

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
  return await Transaction.find({ userId });
};

const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};

const countTransactionsByAccommodation = async (accommodationId) => {
  try {
    const transactionCount = await Transaction.countDocuments({
      accommodationId,
    });
    return transactionCount;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createTransaction,
  getAllTransactionsByAccommodation,
  getAllTransactionsByUser,
  deleteTransaction,
  countTransactionsByAccommodation,
};
