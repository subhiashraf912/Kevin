import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageButtonStyleResolvable,
  MessageEmbed,
} from "discord.js";
import { ButtonNames, PaginationOptions } from "./pagination.interfaces";

const defaultEmojis = {
  First: "⬅️",
  Previous: "◀️",
  Next: "▶️",
  Last: "➡️",
  Number: "#️⃣",
};

const defaultStyles = {
  First: "PRIMARY",
  Previous: "PRIMARY",
  Next: "PRIMARY",
  Last: "PRIMARY",
  Number: "SUCCESS",
};

const pagination = async (options: PaginationOptions) => {
  const {
    author,
    channel,
    embeds,
    button,
    time,
    max,
    customFilter,
    fastSkip,
    pageTravel,
  } = options;
  let currentPage = 1;

  const getButtonData = (name: ButtonNames) => {
    return button?.find((btn) => btn.name === name);
  };

  const generateButtons = (state?: boolean) => {
    const checkState = (name: ButtonNames) => {
      if (
        (["First", "Previous"] as ButtonNames[]).includes(name) &&
        currentPage === 1
      )
        return true;

      if (
        (["Next", "Last"] as ButtonNames[]).includes(name) &&
        currentPage === embeds.length
      )
        return true;

      return false;
    };

    let names: ButtonNames[] = ["Previous", "Next"];
    if (fastSkip) names = ["First", ...names, "Last"];
    if (pageTravel) names.push("Number");

    return names.reduce((accumulator: MessageButton[], name: ButtonNames) => {
      accumulator.push(
        new MessageButton()
          .setEmoji(getButtonData(name)?.emoji || defaultEmojis[name])
          .setCustomId(name)
          .setLabel(name)
          .setDisabled(state || checkState(name))
          .setStyle(
            getButtonData(name)?.style ||
              (defaultStyles[name] as MessageButtonStyleResolvable)
          )
      );
      return accumulator;
    }, []);
  };

  const components = (state?: boolean) => [
    new MessageActionRow().addComponents(generateButtons(state)),
  ];

  const changeFooter = () => {
    const embed = embeds[currentPage - 1];
    const newEmbed = new MessageEmbed(embed);
    if (embed?.footer?.text) {
      return newEmbed.setFooter({
        text: `${embed.footer.text} - Page ${currentPage} of ${embeds.length}`,
        iconURL: embed.footer.iconURL,
      });
    }
    return newEmbed.setFooter({
      text: `Page ${currentPage} of ${embeds.length}`,
    });
  };

  const initialMessage = await channel.send({
    embeds: [changeFooter()],
    components: components(),
  });

  const defaultFilter = (interaction: ButtonInteraction) => {
    if (!interaction.deferred) interaction.deferUpdate();
    return interaction.user.id === author.id;
  };

  const filter = customFilter || defaultFilter;

  const collector = channel.createMessageComponentCollector({
    componentType: "BUTTON",
    filter,
    max,
    time,
  });

  const pageTravelling = new Set();

  const NumberTravel = async () => {
    if (pageTravelling.has(author.id))
      return channel.send("Type `end` to stop page travelling!");
    const collector = channel.createMessageCollector({
      filter: (msg) => msg.author.id === author.id,
      time: 30000,
    });
    const NumberTravelMessage = await channel.send(
      `${author.tag}, you have 30 seconds, send Numbers in chat to change pages! Simply type \`end\` to exit from page travelling.`
    );
    pageTravelling.add(author.id);

    collector.on("collect", (message) => {
      if (message.content.toLowerCase() === "end") {
        message.delete().catch(() => {});
        return collector.stop();
      }
      const int = parseInt(message.content);
      if (isNaN(int) || !(int <= embeds.length) || !(int >= 1)) return;
      currentPage = int;
      initialMessage.edit({
        embeds: [changeFooter()],
        components: components(),
      });
      if (message.guild?.me?.permissions.has("MANAGE_MESSAGES"))
        message.delete();
    });

    collector.on("end", () => {
      if (NumberTravelMessage.deletable) NumberTravelMessage.delete();
      pageTravelling.delete(author.id);
    });
  };

  collector.on("collect", async (interaction) => {
    const id = interaction.customId as ButtonNames;

    if (id === "First") currentPage = 1;
    if (id === "Previous") currentPage--;
    if (id === "Next") currentPage++;
    if (id === "Last") currentPage = embeds.length;
    if (id === "Number") await NumberTravel();

    initialMessage.edit({
      embeds: [changeFooter()],
      components: components(),
    });
  });

  collector.on("end", () => {
    initialMessage.edit({
      components: components(true),
    });
  });
};
export default pagination;
