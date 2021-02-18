const mongoose = require("mongoose");
const botSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    botID: String,
    xp: Number,
    level: Number,
    health: Number
});

module.exports = mongoose.model("Bot", botSchema, "bot");