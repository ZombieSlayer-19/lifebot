const mongoose = require("mongoose");
const ticketSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    ticketID: String,
    status: String,
    userID: String,
    channelID: String,
    roleID: String,
    ticketAuthor: String,
    claimedUserID: String,
    createdDate: String,
    claimedDate: String,
    closedDate: String,
    ticketReason: String,
    ticketSolution: String,
    allowNewTicket: Boolean
});

module.exports = mongoose.model("Ticket", ticketSchema, "tickets");