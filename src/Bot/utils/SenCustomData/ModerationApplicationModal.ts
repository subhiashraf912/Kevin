import { MessageActionRow, Modal, TextInputComponent } from "discord.js";
import { TextInputStyles } from "discord.js/typings/enums";

const memberAgeInput = new TextInputComponent()
  .setCustomId("MemberAgeMareehaModerationApplication")
  .setLabel("How old are you?")
  .setMinLength(2)
  .setMaxLength(2)
  .setPlaceholder("Example: 20")
  .setRequired(true)
  .setStyle(TextInputStyles.SHORT)
  .setRequired(true);

const memberTimezoneAndCountryInput = new TextInputComponent()
  .setCustomId("MemberTimezoneAndCountryMareehaModerationApplication")
  .setLabel("What is your timezone? also your country?")
  .setPlaceholder("Example: UTC/GMT+7, Vietnam")
  .setRequired(true)
  .setStyle(TextInputStyles.SHORT)
  .setRequired(true);

const memberActivityDailyInput = new TextInputComponent()
  .setCustomId("MemberActivityDailyMareehaModerationApplication")
  .setLabel("Can you be active at least 2 hours a day?")
  .setMinLength(2)
  .setMaxLength(3)
  .setPlaceholder("Example: Yes/No")
  .setRequired(true)
  .setStyle(TextInputStyles.SHORT)
  .setRequired(true);

const memberPastModerationStatusInput = new TextInputComponent()
  .setCustomId("MemberPastModerationStatusMareehaModerationApplication")
  .setLabel("Do you have previous moderator exp?")
  .setPlaceholder("If yes, can you tell us about your experience?")
  .setRequired(true)
  .setMaxLength(1000)
  .setStyle(TextInputStyles.PARAGRAPH)
  .setRequired(true);

const memberReasonToBeAModeratorInput = new TextInputComponent()
  .setCustomId("MemberReasonToBeAModeratorMareehaModerationApplication")
  .setLabel("Why do you want to be a moderator?")
  .setPlaceholder("Suggestions:\nTell us what you can offer to us.")
  .setRequired(true)
  .setMaxLength(1000)
  .setStyle(TextInputStyles.PARAGRAPH)
  .setRequired(true);

const actionRows = [
  memberAgeInput,
  memberTimezoneAndCountryInput,
  memberActivityDailyInput,
  memberPastModerationStatusInput,
  memberReasonToBeAModeratorInput,
  //@ts-ignore
].map((textInput) => new MessageActionRow().addComponents(textInput));

const moderationApplicationModal = new Modal()
  .setTitle("Mareeha's Mod Application")
  .setCustomId("MareehaModerationApplicationModal")
  //@ts-ignore
  .addComponents(actionRows);

export default moderationApplicationModal;
