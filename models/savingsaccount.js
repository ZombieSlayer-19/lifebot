const mongoose = require("mongoose");
const savingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    bank: String,
    savingsID: String,
    name: String,
    coins: Number,
    pos: Number,
    latestAcc: Boolean
});

module.exports = mongoose.model("Saving", savingSchema, "savings");