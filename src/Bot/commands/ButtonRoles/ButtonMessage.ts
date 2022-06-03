import {
  CollectorFilter,
  Message,
  MessageAttachment,
  MessageCollector,
  TextChannel,
} from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

type questionType = {
  question: string;
  answer: Message | null;
};

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "button-message",
      category: "Button Roles",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    try {
      const questions: questionType[] = [
        {
          question:
            "Enter the channel you want to send the text message in, use id/name/#channel, type 'this' to use this channel.",
          answer: null,
        },
        {
          question: "Enter the text of the message you want.",
          answer: null,
        },
        {
          question:
            "If you want to send an image with the message, send it as image or send it's link. if not type 'none'",
          answer: null,
        },
      ];

      const filter: CollectorFilter<[Message<boolean>]> = (filteredMessae) =>
        filteredMessae.author.id === message.author.id;
      const collector = new MessageCollector(message.channel, {
        filter,
        max: questions.length,
      });
      let i = 0;
      await message.channel.send({ content: questions[i].question });
      collector.on("collect", async (collectedMessage) => {
        questions[i].answer = collectedMessage;
        i++;
        if (i < questions.length)
          await message.channel.send(questions[i].question);
      });

      const invokeCollectorCallBack = async () => {
        try {
          const channel =
            (questions[0].answer?.mentions.channels.first() as TextChannel) ||
            questions[0].answer?.guild?.channels.cache.find(
              (c) =>
                c.name.toLowerCase() ===
                  questions[0].answer?.content.toLowerCase() ||
                questions[0].answer?.content.toLowerCase() ===
                  c.id.toLowerCase()
            ) ||
            message.channel;
          console.log(questions[1].answer);
          const text = questions[1].answer?.content!;
          console.log(
            questions[2].answer?.attachments.first()?.url ||
              questions[2].answer?.content!
          );
          const attachment = new MessageAttachment(
            questions[2].answer?.attachments.first()?.url ||
              questions[2].answer?.content!
          );
          const sentMessage = await channel.send({
            content: text,
            files: [attachment],
          });
          const channelId = channel.id;
          const guildId = message.guildId!;
          const messageId = sentMessage.id;
          await client.database.models.buttonRoles.create({
            channelId,
            guildId,
            messageId,
          });

          message.reply({ content: "Message Sent." });
        } catch (err: any) {
          console.log(err);
        }
      };
      collector.on("end", async (col) => {
        invokeCollectorCallBack();
      });
    } catch (err: any) {
      console.log(err);
    }
  }
}
