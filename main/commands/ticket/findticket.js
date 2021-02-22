const Discord = require("discord.js");
const Ticket = require("../../../models/ticket.js");

module.exports = {
    name: "findticket",
    aliases: ["ft", "myticket"],
    category: "ticket",
    usage: "!findticket <ticket id>",
    description: "Finds the ticket in the database to give you information on the ticket",
    run: async(bot,message,args) => {
        if(!args[0]) return message.channel.send("Please provide a ticket id or user id to lookup a ticket..");

        var member = message.mentions.members.first();

        if(args[0].includes("<@")){
            var toFindTicket = {
                guildID: message.guild.id,
                userID: member.user.id
            }

            var noneFound = `the user of \`${member.user.username}\``;
        }else {
            var  toFindTicket = {
                guildID: message.guild.id,
                ticketID: args[0]
            }

            var noneFound = `the id of \`${args[0]}\``;
        }

        var msg = await message.channel.send("Searching Tickets...");
        
        Ticket.findOne(toFindTicket, async(err, ticket) => {
            if(err) console.error(err);

            if(!ticket) {
                setTimeout(() => {
                    msg.delete();

                    var noTicket = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                    .setTitle("No Ticket Found...")
                    .setDescription(`There was no ticket found for ${noneFound} Please make sure the id or mention is typed in correctly..`)

                    message.channel.send(noTicket);
                }, 1500);
            }else {
                var members = await bot.users.fetch(`${ticket.userID}`, { cache: true });

                setTimeout(() => {
                    msg.delete();

                    var yesTicket = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(members.displayAvatarURL({dynamic: true}))
                    .setTitle(`${members.username}'s Ticket`)
                    .addField("Ticket Author:", "===============")
                    .addField("Username:", members.username, true)
                    .addField("Tag:", members.tag.split(members.username).pop(","), true)
                    .addField("ID:", members.id)
                    .addField("Ticket Info:", "===============")
                    .addField("Ticket ID:", ticket.ticketID, true)
                    .addField("Status:", ticket.status, true)
                    .addField("Claimed Info:", `Claimed By: ${ticket.claimedUserID}`)
                    .addField("Ticket Created Date:", ticket.createdDate, true)
                    .addField("Ticket Closed Date:", ticket.closedDate, true)
                    .addField("Ticket Reason:", ticket.ticketReason)
                    .addField("Ticket Solution:", ticket.ticketSolution)

                    message.channel.send(yesTicket);
                }, 1500);
            }
        })
    }
}