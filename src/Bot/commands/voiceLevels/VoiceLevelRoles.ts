import { Message, MessageEmbed, TextChannel } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class AddVoiceLevelChannel extends BaseCommand {
  constructor() {
    super({
      name: "voice-level-roles",
      category: "Voice Levels",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const { roles } = await client.configurations.voiceLevels.roles.get(
      message.guildId!
    );
    const RolesObject: string[] = [];

    for (const [key, value] of Object.entries(roles)) {
      let role = message.guild?.roles.cache.find((role) => role.id === value);
      const level = key;
      RolesObject.push(`${level}:${role?.toString()}`);
    }
    if (!RolesObject[0]) {
      message.reply({ content: "No voice level roles were found." });
      return;
    }

    const embeds = generatevoiceLevelRolesEmbed(RolesObject);
    client.utils.pagination({
      embeds,
      fastSkip: true,
      pageTravel: true,
      author: message.author,
      channel: message.channel as TextChannel,
    });
  }
}

function generatevoiceLevelRolesEmbed(voiceLevelRoles: string[]) {
  const embeds = [];
  let k = 10;

  for (let i = 0; i < voiceLevelRoles.length; i += 10) {
    const r = voiceLevelRoles.slice(i, k);
    let j = i;
    k += 10;
    let info = "";
    r.forEach((levelRole) => {
      info = `${info}\n> Level: ${millisToMinutesAndSeconds(
        parseInt(levelRole.split(":")[0])
      )} -> \`Role:\` ${levelRole.split(":")[1]}\n`;
    });

    const embed = new MessageEmbed().setDescription(
      `\`\`\`💢 Voice Level Roles: ${voiceLevelRoles.length}💢\`\`\`\`\`\`⚡The roles that are gonna be given to members once they reach the required level!⚡\`\`\`${info}`
    );

    embeds.push(embed);
  }
  return embeds;
}
const millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
  let h;
  h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
  return `${h} Hours`;
};
