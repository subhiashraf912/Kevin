import { Message, MessageEmbed, TextChannel } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class AddTextLevelChannel extends BaseCommand {
  constructor() {
    super({
      name: "text-level-roles",
      category: "Text Levels",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const { roles } = await client.configurations.textLevels.roles.get(
      message.guildId!
    );
    const RolesObject: string[] = [];

    for (const [key, value] of Object.entries(roles)) {
      let role = message.guild?.roles.cache.find((role) => role.id === value);
      const level = key;
      RolesObject.push(`${level}:${role?.toString()}`);
    }
    if (!RolesObject[0]) {
      message.reply({ content: "No text level roles were found." });
      return;
    }

    const embeds = generatetextLevelRolesEmbed(RolesObject);
    client.utils.pagination({
      embeds,
      fastSkip: true,
      pageTravel: true,
      author: message.author,
      channel: message.channel as TextChannel,
    });
  }
}

function generatetextLevelRolesEmbed(textLevelRoles: string[]) {
  const embeds = [];
  let k = 10;

  for (let i = 0; i < textLevelRoles.length; i += 10) {
    const r = textLevelRoles.slice(i, k);
    let j = i;
    k += 10;
    let info = "";
    r.forEach((levelRole) => {
      info = `${info}\n> Level: ${parseInt(
        levelRole.split(":")[0]
      )} -> \`Role:\` ${levelRole.split(":")[1]}\n`;
    });

    const embed = new MessageEmbed().setDescription(
      `\`\`\`💢 Text Level Roles: ${textLevelRoles.length}💢\`\`\`\`\`\`⚡The roles that are gonna be given to members once they reach the required level!⚡\`\`\`${info}`
    );

    embeds.push(embed);
  }
  return embeds;
}
