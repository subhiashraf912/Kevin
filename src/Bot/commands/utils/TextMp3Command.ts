import { Message, MessageAttachment } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import fetch from "node-fetch";
import validTextMP3Voices from "../../utils/validTextMP3Voices";
function toLowerKeys(obj: any) {
  return Object.keys(obj).reduce((accumulator: any, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}

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
    const speaker = args[0];
    if (!speaker)
      return message.reply(
        "You need to enter a speaker as first argument, use valid-textmp3-speakers command to see them"
      );

    const loweredSpeakersKeys = toLowerKeys(validTextMP3Voices);
    if (!loweredSpeakersKeys[speaker.toLowerCase()])
      return message.reply(
        "The speaker you provided (first word after command) is not valid, use valid-textmp3-speakers command to see them"
      );
    args.shift();
    if (!args[0]) return message.reply("You need to enter some text...");
    const text = args.join(" ");
    const speakerRest = speaker.charAt(0).toUpperCase() + speaker.slice(1);

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
      body: `msg=${text}&lang=${speakerRest}&source=ttsmp3`,
      method: "POST",
    });

    const data = await res.json();
    const attachment = new MessageAttachment(
      data.URL,
      `${message.member?.user.tag}'s text.mp3`
    );
    await message.reply({ files: [attachment] });
  }
}
