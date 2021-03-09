const Discord = require("discord.js");
const Ticket = require("../../../models/ticket.js");

module.exports = {
    name: "close",
    aliases: ["closeticket"],
    category: "ticket",
    usage: "close [ticket id | @member]",
    description: "Closes your current ticket or closes someone else ticket if you have the permissions",
    run: async(bot,message,args) => {

        if(!args[0]) {
            Ticket.findOne({
                guildID: message.guild.id,
                userID: message.author.id,
                allowNewTicket: false
            }, (err, ticket) => {
                if(err) console.error(err);

                if(!ticket) return message.channel.send("You do not have a ticket open...");

                Ticket.updateOne({
                    status: "Closed",
                    allowNewTicket: true
                }).catch(err => console.error(err));

                var ticketRole = message.guild.roles.cache.find(role => role.id === ticket.roleID);
                ticketRole.delete();

                var ticketChannel = message.guild.channels.cache.find(channel => channel.id === ticket.channelID);
                ticketChannel.delete();
            }).catch(err => console.error(err));
        }
    }
}