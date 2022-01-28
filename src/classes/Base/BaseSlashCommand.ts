import {
  ChatInputApplicationCommandData,
  Interaction,
  PermissionString,
} from "discord.js";
import DiscordClient from "../Client/Client";

interface options extends ChatInputApplicationCommandData {
  userPermissions?: PermissionString[];
}
export default abstract class BaseSlashCommand {
  constructor(private options: options) {}

  getName(): string {
    return this.options.name;
  }
  getDescription(): string {
    return this.options.description || "No description for this command!";
  }
  getOptions() {
    return this.options.options;
  }

  getPermissions() {
    return this.options.userPermissions;
  }

  abstract run(
    client: DiscordClient,
    message: Interaction,
    args: Array<string> | null
  ): Promise<void>;
}
