import {
  CollectorFilter,
  Message,
  MessageActionRow,
  MessageButton,
  MessageButtonStyleResolvable,
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
  EMOJIREGEX =
    /((?<!\\)<:[^:]+:(\d+)>)|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gmu;

  constructor() {
    super({
      name: "button-role",
      category: "Button Roles",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const questions: questionType[] = [
      {
        question: "Enter Bot Message ID",
        answer: null,
      },
      {
        question: "Enter the button label you want.",
        answer: null,
      },
      {
        question:
          "Enter the emoji of the role in the button (type 'none' for no emojis)",
        answer: null,
      },
      {
        question: "Mention the role or type name/id of the role.",
        answer: null,
      },
      {
        question:
          "Enter button type (color) (primary, secondary, success, danger)",
        answer: null,
      },
      {
        question:
          "If you want a role to be required to gain this role, Type id/name/@role of the role you want to be required, If you don't want then type 'none'.",
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
      const messageId = questions[0].answer?.content!;
      const buttonLabel = questions[1].answer?.content!;
      const emoji =
        questions[2].answer?.content.toLowerCase() === "none"
          ? undefined
          : questions[2].answer?.content;
      const role =
        questions[3].answer?.mentions.roles.first() ||
        questions[3].answer?.guild?.roles.cache.find(
          (r) =>
            r.name.toLowerCase() ===
              questions[3].answer?.content.toLowerCase() ||
            questions[3].answer?.content.toLowerCase() === r.id.toLowerCase()
        );
      const validButtonTypes: MessageButtonStyleResolvable[] = [
        "PRIMARY",
        "SECONDARY",
        "SUCCESS",
        "DANGER",
      ];
      const buttonType: MessageButtonStyleResolvable =
        validButtonTypes.includes(
          (questions[4].answer?.content.toUpperCase() as MessageButtonStyleResolvable) ||
            ""
        )
          ? (questions[4].answer?.content.toUpperCase() as MessageButtonStyleResolvable)
          : "PRIMARY";
      const requiredRole =
        questions[5].answer?.mentions.roles.first()?.id ||
        questions[5].answer?.guild?.roles.cache.find(
          (r) =>
            r.name.toLowerCase() ===
              questions[5].answer?.content.toLowerCase() ||
            questions[5].answer?.content.toLowerCase() === r.id.toLowerCase()
        )?.id ||
        "null";

      const data = await client.database.models.buttonRoles.findOne({
        guildId: message.guildId,
        messageId,
      });
      if (!data) {
        return message.reply({
          content:
            "No data was found for this message id, use button-message command to create a new message.",
        });
      }
      if (!role)
        return message.reply({
          content:
            "No role was found for the data you provied, please fix the role id or name and try again.",
        });

      const channel = message.guild?.channels.cache.get(data.channelId) as
        | TextChannel
        | undefined;
      const roleMessage = await channel?.messages.fetch(messageId);

      const rows = roleMessage?.components!;
      const button = new MessageButton()
        .setLabel(buttonLabel)
        .setEmoji(emoji!)
        .setStyle(buttonType)
        .setCustomId(`button-roles-${role.id}_${requiredRole}`);

      let added = false;
      for (const row of rows) {
        if (row.components.length < 5) {
          row.addComponents(button);
          added = true;
          break;
        }
      }
      if (!added) {
        if (rows.length >= 5) {
          return message.reply({
            content: "You cannot add more buttons to this message",
          });
        }

        rows.push(new MessageActionRow().addComponents(button));
      }

      roleMessage?.edit({ components: rows });
      return message.reply({ content: "Added the button to the message!" });
    };
    collector.on("end", async (col) => {
      invokeCollectorCallBack();
    });
  }
}
