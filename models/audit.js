const mongoose = require("mongoose");
const auditSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    username: String,
    command_name: String,
    full_command: String,
    date_time: String
});

module.exports = mongoose.model("AuditLog", auditSchema, "audit_logs");