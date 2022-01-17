import BaseEvent from "../../classes/Base/BaseEvent";
import { Message } from "discord.js";
import DiscordClient from "../../classes/Client/Client";

export default class MessageEvent extends BaseEvent {
  constructor() {
    super("messageCreate");
  }

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot || !message.member || !message.guild) return;
    const prefix = await client.configurations.prefixes.get(message.guild.id);
    if (message.content.startsWith(prefix)) {
      const [cmdName, ...cmdArgs] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);
      const command = client.commands.get(cmdName);

      if (command) {
        const runCommand = () => {
          command.run(client, message, cmdArgs);
        };
        const memberPermissions = message.member.permissions.toArray();
        if (command.permissions) {
          if (command.permissions.checkMemberPermissions(memberPermissions)) {
            runCommand();
          } else {
            const missingPermissions = command.permissions
              .getMissingPermissions(memberPermissions)
              .map((perm) => `#${client.utils.formatPermission(perm)}`)
              .join(" ");
            return message.reply(
              `You need \`${missingPermissions}\` permissions to run this command.`
            );
          }
        } else {
          runCommand();
        }
      }
    }
  }
}
