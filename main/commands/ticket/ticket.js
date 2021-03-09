const Discord = require("discord.js");
const dualox = require("dualox-js");
const mongoose = require("mongoose");
const Ticket = require("../../../models/ticket.js");

module.exports = {
    name: "ticket",
    aliases: ["tic", "tick"],
    category: "ticket",
    usage: "!ticket",
    description: "Creates a help ticket for a moderator to help you with your problems..",
    run: async(bot,message,args) => {
        var generatedTicketID = dualox.randomId(10, "123");

        Ticket.findOne({
            guildID: message.guild.id,
            userID: message.author.id,
            allowNewTicket: false 
        }, async(err, ticket) => {
            if(err) console.error(err);

            if(!ticket) {
                var msg = await message.channel.send("Creating Ticket...");
                makeTicket();
                msg.delete();
            }else {
                if(ticket.allowNewTicket == false) {
                    return message.channel.send(`You already have a ticket that is not closed yet with the id of \`${ticket.ticketID}\``);
                }else if(ticket.allowNewTicket == true) makeTicket();
            }

            async function makeTicket() {
                const newTicket = new Ticket({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    ticketID: generatedTicketID,
                    status: "Open / Unclaimed",
                    userID: message.author.id,
                    channelID: "n/a",
                    roleID: "n/a",
                    ticketAuthor: message.author,
                    claimedUserID: "No claim yet",
                    createdDate: dualox.currentDate(),
                    claimedDate: "No claim yet",
                    closedDate: "Ticket Still Open",
                    ticketReason: "N/A",
                    ticketSolution: "No Solution Found Yet",
                    allowNewTicket: false
                });

                await newTicket.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));

                var ticketColors = [
                    "RED",
                    "GREEN",
                    "YELLOW",
                    "PINK",
                    "PURPLE",
                    "ORANGE",
                    "BLUE"
                ];

                var randomTicketColor = Math.floor(Math.random() * (ticketColors.length));
                var ticketColor = ticketColors[randomTicketColor];

                var ticketRole = await message.guild.roles.create({
                    data: {
                        name: `${generatedTicketID}`,
                        color: ticketColor,
                    },
                    reason: "New Ticket Created"
                })
                .catch(err => console.error(err));

                var ticketRole = message.guild.roles.cache.find(role => role.name === `${generatedTicketID}`);
                var everyoneRole = await message.guild.roles.cache.find(role => role.name === "@everyone");

                message.member.roles.add(ticketRole.id);

                const ticketChannel = await message.guild.channels.create(`🟢${message.author.username}-${generatedTicketID}`, {
                    reason: "New Ticket Created",
                    parent: "812867928827232276",
                    permissionOverwrites: [
                        {
                            id: ticketRole.id,
                            allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]
                        },

                        {
                            id: everyoneRole.id,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ]
                });

                Ticket.updateOne({
                    guildID: message.guild.id,
                    userID: message.author.id
                }, {
                    $set: {
                        channelID: ticketChannel.id,
                        roleID: ticketRole.id
                    }
                }).catch(err => console.error(err));

                var newTicketEmbed = new Discord.MessageEmbed()
                .setColor(ticketColor)
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle("Ticket Created!")
                .setDescription(`Please go to the new created channel named \`🟢${message.author.username}-${generatedTicketID}\` This is where your ticket will be handled :)`)
                .addField("Ticket ID:", `\`${generatedTicketID}\` Keep this ticket ID in case you need the information of the ticket later on..`)
                .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()

                message.channel.send(newTicketEmbed);

                var ticketChannelEmbed = new Discord.MessageEmbed()
                .setColor(ticketColor)
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .setTitle("Welcome To Your Ticket Channel!")
                .setDescription("This channel will be where your ticket is handled, a moderator will claim your ticket soon to help you with your issue, but before someone claims your ticket, we'd perfer if you let us know your issue now, so go ahead! Type in your question or concern you have now so the process will go faster when a moderator claims your ticket. :slight_smile:")
                .addField("Ticket ID:", `\`${generatedTicketID}\` This is your ticket ID, keep it in case you need this tickets information in the future..`)
                .setFooter(`${bot.user.username} | ${bot.commands.size} Total Commands`, bot.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()

                ticketChannel.send(ticketChannelEmbed);
            }
        });
    }
}