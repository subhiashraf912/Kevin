import {
  ButtonInteraction,
  GuildTextBasedChannel,
  MessageEmbed,
  User,
} from "discord.js";

export interface PaginationOptions {
  channel: GuildTextBasedChannel;

  author: User;

  embeds: MessageEmbed[];

  button?: Button[];

  pageTravel?: boolean;

  fastSkip?: boolean;

  time?: number;

  max?: number;

  customFilter?(interaction: ButtonInteraction): boolean;
}
export type ButtonNames = "First" | "Previous" | "Next" | "Last" | "Number";

export interface Button {
  name: ButtonNames;
  emoji?: string;
  style?: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER";
}
