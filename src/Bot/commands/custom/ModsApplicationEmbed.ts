import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "mods-application-embed",
      category: "Test",
      permissions: new PermissionsGuard({
        userPermissions: ["ADMINISTRATOR"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.guild?.id !== "783991881028993045")
      return message.reply({
        content: "This command is only for Sen Nightcore server!",
      });
    const embed = new MessageEmbed()
      .setAuthor({
        name: "Moderators Team Application",
        iconURL:
          "https://static.wikia.nocookie.net/discord/images/e/ea/Discord_Certified_Moderator.png/revision/latest?cb=20210614104513",
      })
      .setDescription(
        "**Hey there**\nIf you want to **help our server to improve**, **help others** and **join the moderators team** you can click the button below!"
      )
      .setThumbnail(
        "https://bot.to/wp-content/uploads/2020/09/server-protection_5f74b6f14460b.png"
      )
      .setImage(
        "https://assets-global.website-files.com/5f9072399b2640f14d6a2bf4/615e08a57562b757afbe7032_TransparencyReport_BlogHeader.png"
      );

    const button = new MessageButton()
      .setCustomId("management_team_button")
      .setEmoji("🛠")
      .setLabel("Apply for Moderators team")
      .setStyle("SUCCESS");

    const row = new MessageActionRow().addComponents(button);

    message.channel.send({ embeds: [embed], components: [row] });
  }
}
