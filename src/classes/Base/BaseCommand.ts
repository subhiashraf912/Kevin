import { Message } from "discord.js";
import DiscordClient from "../Client/Client";
import CommandOptions from "../../utils/types/commands/CommandOptions";

export default abstract class BaseCommand {
  name;
  category;
  aliases;
  description;
  usage;
  permissions;
  constructor(private options: CommandOptions) {
    this.name = options.name;
    this.category = options.category;
    this.aliases = options.aliases || [];
    this.description = options.description || "No description for this command";
    this.usage = options.usage || "No usage for this command";
    this.permissions = options.permissions;
  }

  abstract run(
    client: DiscordClient,
    message: Message,
    args: string[] | null
  ): Promise<any>;
}
