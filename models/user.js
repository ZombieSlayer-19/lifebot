const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    warnCount: Number,
    kickCount: Number,
    banCount: Number,
    xp: Number,
    xpForLevelUp: Number,
    level: Number,
    levelForRankUp: Number,
    rank: Number,
    coins: Number,
    bio: String
});

module.exports = mongoose.model("User", userSchema, "users");