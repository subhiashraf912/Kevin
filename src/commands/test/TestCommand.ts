import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class TestCommand extends BaseCommand {
  constructor() {
    super({
      name: "test",
      category: "Test",
      permissions: new PermissionsGuard({
        botPermissions: [],
        userPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    message.channel.send(
      `> Test command is working\n> Websocket ping is ${
        client.ws.ping
      }ms\n> Client ping is ${Date.now() - message.createdTimestamp}ms`
    );
  }
}
