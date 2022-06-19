import { Message } from "discord.js";
import axios from "axios";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class HelpCommand extends BaseCommand {
  constructor() {
    super({
      name: "text-mp3",
      category: "Utils",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["ATTACH_FILES"],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0]) return message.reply("You need to enter some text...");
    const data = { msg: args.join(" "), lang: "Joanna", source: "ttsmp3" };
    const res = await axios.post("https://ttsmp3.com/makemp3_new.php", data);
    console.log(res.data);
  }
}
