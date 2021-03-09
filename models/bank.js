const mongoose = require("mongoose");
const bankSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    bank: String,
    maxCoins: Number,
    savingsAccounts: Number,
    totalSavings: Number,
    safety: String,
    accountID: String,
    coins: Number
});

module.exports = mongoose.model("Bank", bankSchema, "banks");