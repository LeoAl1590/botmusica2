const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "canal", //the command name for execution & for helpcmd [OPTIONAL]

  category: "Ajustes",
  aliases: [],
  usage: "canal <add/remove> <#Canal>",

  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Hace que el bot hable en ciertos canales", //the command description for helpcmd [OPTIONAL]
  memberpermissions: ["MANAGE_GUILD "], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp
      } = message;
      const {
        guild
      } = member;

      if (!args[0]) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Pone un canal**`)
            .setDescription(`**Uso:**\n> \`${client.settings.get(message.guild.id, "prefix")}canal <add/remove> <#Canal>\``)
          ],
        });
      }
      let add_remove = args[0].toLowerCase();
      if (!["add", "remove"].includes(add_remove)) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Agrega un canal**`)
            .setDescription(`**Uso:**\n> \`${client.settings.get(message.guild.id, "prefix")}canal <add/remove> <#Canal>\``)
          ],
        });
      }
      let Channel = message.mentions.channels.first();
      if (!Channel) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Agrega un canal**`)
            .setDescription(`**Uso:**\n> \`${client.settings.get(message.guild.id, "prefix")}canal <add/remove> <#Canal>\``)
          ],
        });
      }
      client.settings.ensure(guild.id, {
        botchannel: []
      });

      if (add_remove == "add") {
        if (client.settings.get(guild.id, "botchannel").includes(Channel.id)) {
          return message.reply({
            embeds: [
              new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${client.allEmojis.x} **Este canal ya está en la whitelist**`)
            ],
          })
        }
        client.settings.push(guild.id, Channel.id, "botchannel");
        var djs = client.settings.get(guild.id, `botchannel`).map(r => `<#${r}>`);
        if (djs.length == 0) djs = "`no hay`";
        else djs.join(", ");
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.check_mark} **El canal \`${Channel.name}\` se agregó a la whitelist ${client.settings.get(guild.id, "djroles").length - 1}**`)
            .addField(`🎧 **Canal del bot${client.settings.get(guild.id, "botchannel").length > 1 ? "s": ""}:**`, `>>> ${djs}`, true)
          ],
        })
      } else {
        if (!client.settings.get(guild.id, "botchannel").includes(Channel.id)) {
          return message.reply({
            embeds: [
              new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${client.allEmojis.x} **Este canal ya no está en la whitelist**`)
            ],
          })
        }
        client.settings.remove(guild.id, Channel.id, "botchannel");
        var djs = client.settings.get(guild.id, `botchannel`).map(r => `<#${r}>`);
        if (djs.length == 0) djs = "`no hay`";
        else djs.join(", ");
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.check_mark} **El canal \`${Channel.name}\` se eliminó de la whitelist ${client.settings.get(guild.id, "djroles").length}**`)
            .addField(`🎧 **Canal del bot${client.settings.get(guild.id, "botchannel").length > 1 ? "s": ""}:**`, `>>> ${djs}`, true)
          ],
        })
      }

    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
