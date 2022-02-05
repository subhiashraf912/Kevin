import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class EvalCommand extends BaseCommand {
  constructor() {
    super({
      name: "eval",
      category: "Management",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    try {
      if (message.author.id !== "507684120739184640") return;
      const embed = new MessageEmbed().setColor("WHITE");
      const code = args.join(" ");
      const result = new Promise((res) => res(eval(code)));
      let output: any = await result;
      if (typeof output !== "string") {
        output = (await import("util")).inspect(output, { depth: 0 });
      }
      output.includes(client.token)
        ? (output = output.replace(client.token, "TOKEN"))
        : null;
      embed
        .setTitle("Compied code result")
        .setDescription(`\`\`\`js\n${output}\`\`\``);
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log("[Error] Something Went Wrong, ", error);
    }
  }
}
