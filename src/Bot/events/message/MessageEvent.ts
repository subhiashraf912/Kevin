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
    if (
      message.content.startsWith(prefix) ||
      message.guild.me?.voice.channelId === message.member.voice.channelId
    ) {
      const [cmdName, ...cmdArgs] = message.content
        .slice(message.content.startsWith(prefix) ? prefix.length : 0)
        .trim()
        .split(/\s+/);
      const command =
        client.commands.get(cmdName.toLowerCase()) ||
        client.commands.get(client.aliases.get(cmdName.toLowerCase())!);

      if (command) {
        const runCommand = () => {
          command.run(client, message, cmdArgs);
        };
        const memberPermissions = message.member.permissions;
        const clientPermissions = message.guild.me?.permissions!;
        if (command.permissions) {
          if (command.permissions.checkMemberPermissions(memberPermissions)) {
            if (command.permissions.checkClientPermissions(clientPermissions)) {
              runCommand();
            } else {
              const missingPermissions = command.permissions
                .getMissingClientPermissions(clientPermissions)
                .map((perm) => `#${client.utils.formatPermission(perm)}`)
                .join(" ");
              return message.reply(
                `I need \`${missingPermissions}\` permissions to run this command.`
              );
            }
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
