const mongoose = require("mongoose");
const settingsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    prefix: String,
});

module.exports = mongoose.model("Settings", settingsSchema, "settings");