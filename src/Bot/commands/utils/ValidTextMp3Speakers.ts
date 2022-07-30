import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import validTextMP3Voices from "../../utils/validTextMP3Voices";
function toLowerKeys(obj: any) {
  return Object.keys(obj).reduce((accumulator: any, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}

export default class ValidTextMp3Speakers extends BaseCommand {
  constructor() {
    super({
      name: "valid-textmp3-speakers",
      category: "Utils",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    try {
      const str = JSON.stringify(validTextMP3Voices, null, 2); // spacing level = 2
      message.author.send(str);
      message.react("✅");
    } catch {
      message.react("❌");
    }
  }
}
