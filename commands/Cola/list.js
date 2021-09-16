const {
	MessageEmbed,
	MessageSelectMenu,
	MessageActionRow
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	check_if_dj
} = require("../../handlers/functions")
module.exports = {
	name: "queue", //the command name for the Slash Command

	category: "Cola",
	aliases: ["list", "queue", "queuelist"],
	usage: "queue",

	description: "Muestra las canciones en la cola", //the command description for Slash Command Overview
	cooldown: 10,
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
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Metete ${guild.me.voice.channel ? "__mi__" : "al"} canal de voz**`)
				],

			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Metete al canal`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **No hay música**`)
					],

				})
				let embeds = [];
				let k = 10;
				let theSongs = newQueue.songs;
				//defining each Pages
				for (let i = 0; i < theSongs.length; i += 10) {
					let qus = theSongs;
					const current = qus.slice(i, k)
					let j = i;
					const info = current.map((track) => `**${j++} -** [\`${String(track.name).replace(/\[/igu, "{").replace(/\]/igu, "}").substr(0, 60)}\`](${track.url}) - \`${track.formattedDuration}\``).join("\n")
					const embed = new MessageEmbed()
						.setColor(ee.color)
						.setDescription(`${info}`)
					if (i < 10) {
						embed.setTitle(`📑 **Top ${theSongs.length > 50 ? 50 : theSongs.length} | Cola de ${guild.name}**`)
						embed.setDescription(`**(0) Cancion actual:**\n> [\`${theSongs[0].name.replace(/\[/igu, "{").replace(/\]/igu, "}")}\`](${theSongs[0].url})\n\n${info}`)
					}
					embeds.push(embed);
					k += 10; //Raise k to 10
				}
				embeds[embeds.length - 1] = embeds[embeds.length - 1]
					.setFooter(ee.footertext + `\n${theSongs.length} canciones en la cola | Duración: ${newQueue.formattedDuration}`, ee.footericon)
				let pages = []
				for (let i = 0; i < embeds.length; i += 3) {
					pages.push(embeds.slice(i, i + 3));
				}
				pages = pages.slice(0, 24)
				const Menu = new MessageSelectMenu()
					.setCustomId("QUEUEPAGES")
					.setPlaceholder("Elegí una página")
					.addOptions([
						pages.map((page, index) => {
							let Obj = {};
							Obj.label = `Página ${index}`
							Obj.value = `${index}`;
							Obj.description = `Muestra la página${index}/${pages.length - 1}`
							return Obj;
						})
					])
				const row = new MessageActionRow().addComponents([Menu])
				message.reply({
					embeds: [embeds[0]],
					components: [row],
				});
				//Event
				client.on('interactionCreate', (i) => {
					if (!i.isSelectMenu()) return;
					if (i.customId === "QUEUEPAGES" && i.applicationId == client.user.id) {
						i.reply({
							embeds: pages[Number(i.values[0])],
						}).catch(e => {})
					}
				});
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				message.reply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
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
