import {
  Interaction,
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class HelpCommand extends BaseCommand {
  constructor() {
    super({
      name: "help",
      category: "Utils",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }
  categories: any = {
    Moderation: "🔨",
    Music: "🎵",
    Management: "⚒",
    Utils: "💥",
    Moderators: "🛠",
    Test: "🧪",
  };
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    let prefix = await client.configurations.prefixes.get(message.guildId!)!;
    if (args[0]) {
      const command =
        client.commands.get(args.join(" ").toLowerCase()) ||
        client.commands.get(
          client.aliases.get(args.join(" ").toLowerCase()) as string
        );

      if (!command) {
        const relatedCommand =
          client.commands.find((command) =>
            command.name.includes(args.join(" ").toLowerCase())
          ) ||
          client.commands.find((command) =>
            args.join(" ").toLowerCase().includes(command.name)
          ) ||
          client.commands.get(
            client.aliases.find((command) =>
              command.toLowerCase().includes(args.join(" ").toLowerCase())
            ) as string
          ) ||
          client.commands.get(
            client.aliases.find((command) =>
              args.join(" ").toLowerCase().includes(command.toLowerCase())
            ) as string
          );
        if (relatedCommand) {
          message.reply({
            content: `Command not found, did you mean ${relatedCommand.name}`,
          });
        } else {
          message.reply({
            content: "Couldn't find that command...",
          });
        }
        return;
      }

      const embed = new MessageEmbed()
        .setDescription(
          `**${
            client.user?.username as string
          } help**\n\`\`\`css\n${client.utils.formatString(
            command.name
              .replaceAll("-", " ")
              .replaceAll("-", " ")
              .replaceAll("-", " ")
          )} Help\`\`\``
        )
        .addField(`> Category:`, `\`\`\`${command.category}\`\`\``, true)
        .addField(`> Description:`, `\`\`\`${command.description}\`\`\``, true)
        .addField(
          `> Usage:`,
          `\`\`\`${command.usage
            .replaceAll("{prefix}", prefix)
            .replaceAll("<prefix>", prefix)}\`\`\``
        )
        .addField(
          `> Aliases:`,
          `\`\`\`${command.aliases[0] ? command.aliases : "No Aliases"}\`\`\``,
          true
        )
        .addField(
          `> Required Bot Permissions:`,
          `\`\`\`${
            command.permissions.botPermissions[0]
              ? command.permissions.botPermissions.map(
                  (perm) =>
                    `${client.utils.formatString(perm.replaceAll("_", " "))}`
                )
              : "No Permissions are required"
          }\`\`\``,
          true
        )

        .addField(
          `> Required User Permissions`,
          `\`\`\`${
            command.permissions.userPermissions[0]
              ? command.permissions.userPermissions.map(
                  (perm) =>
                    `${client.utils.formatString(perm.replaceAll("_", " "))}`
                )
              : "No Permissions are required"
          }\`\`\``
        )
        .setFooter({ text: `${client.user?.username} Commands Help` });
      message.channel.send({ embeds: [embed] });
      return;
    }

    const directories = [
      ...new Set(client.commands.map((cmd) => cmd.category)),
    ];

    const categories = directories.map((dir) => {
      const getCommands = client.commands
        .filter((cmd) => cmd.category === dir)
        .map((cmd) => {
          return {
            name: cmd.name,
            description: cmd.description,
          };
        });
      return {
        directory: client.utils.formatString(dir),
        commands: getCommands,
      };
    });

    const embed = new MessageEmbed()
      .setDescription(
        "{bot} help list"
          .replaceAll(
            "{bot}",
            client.utils.formatString(client.user?.username as string)
          )
          .replaceAll("{prefix}", prefix)
      )
      .addFields(
        directories.map((category) => {
          return {
            name: `> ${
              this.categories[category] || ""
            } ${client.utils.formatString(category)}`,
            value: `\`\`\`css\n${"Includes all of the {category} commands.".replaceAll(
              "{category}",
              category
            )}\`\`\``,
            inline: true,
          };
        })
      )
      .setFooter({ text: "Please choose a category in the dropdown menu." });

    const components = (state: boolean) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder("Please select a category")
          .setDisabled(state)
          .addOptions([
            {
              label: "Main Page",
              value: "home-page",
              description: "Goes back to the home page of the help command.",
              emoji: "🏠",
            },
          ])
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: "Commands from {option} category.".replaceAll(
                  "{option}",
                  cmd.directory
                ),
                emoji: this.categories[cmd.directory] || "",
              };
            })
          )
      ),
    ];
    const initialMessage = await message.reply({
      embeds: [embed],
      components: components(false),
    });
    const filter = (interaction: Interaction): boolean => {
      return interaction.user.id === message.author.id;
    };
    const collector = message.channel.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
      // time: 5000,
    });

    collector.on("collect", (interaction: any) => {
      const [directory] = interaction.values;
      if (directory === "home-page") {
        interaction.update({ embeds: [embed] });
        return;
      }
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );
      const categoryEmbed = new MessageEmbed()
        .setTitle(
          "{category} Commands".replaceAll(
            "{category}",
            client.utils.formatString(directory)
          )
        )
        .setDescription(
          "```Here's the list of the commands\nType {prefix}CommandName to run the command```".replaceAll(
            "{prefix}",
            prefix
          )
        )
        .addFields(
          (
            category as {
              directory: string;
              commands: {
                name: string;
                description: string;
              }[];
            }
          ).commands.map((cmd) => {
            return {
              name: `${cmd.name}`,
              value: `\`${cmd.description}\``,
              inline: true,
            };
          })
        );
      interaction.update({ embeds: [categoryEmbed] });
    });
    collector.on("end", () => {
      initialMessage.edit({ components: components(true) });
    });
  }
}
