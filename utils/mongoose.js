const mongoose = require("mongoose");
const {config} = require("dotenv");
config({
    path: __dirname + "../.env"
});

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        }

        mongoose.connect(process.env.database_link, dbOptions);
        mongoose.set("useFindAndModify", false);
        mongoose.Promise = global.Promise;

        mongoose.connection.on("connected", () => {
            console.warn("!WARNING! Mongoose Has Succesfully Connected! !WARNING!");
        });

        mongoose.connection.on("err", err => {
            console.error(err.stack);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("!WARNING! Mongoose Has Disconnected! !WARNING!");
        });
    }
}