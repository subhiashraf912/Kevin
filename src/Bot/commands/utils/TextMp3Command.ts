import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import fetch from "node-fetch";
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

    const res = await fetch("https://ttsmp3.com/makemp3_new.php", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="101", "Opera";v="87"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Referer: "https://ttsmp3.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `msg=${args.join(" ")}&lang=Joanna&source=ttsmp3`,
      method: "POST",
    });

    const data = { msg: args.join(" "), lang: "Joanna", source: "ttsmp3" };
    const text = await res.text();
    message.reply(text);
  }
}
