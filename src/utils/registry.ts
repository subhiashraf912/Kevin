import path from "path";
import { promises as fs } from "fs";
import DiscordClient from "../classes/Client/Client";
import { ApplicationCommandData } from "discord.js";

export async function registerCommands(
  client: DiscordClient,
  dir: string = ""
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Command } = await import(path.join(dir, file));
      const command = new Command();
      client.commands.set(command.name, command);
      command.aliases.forEach((alias: string) => {
        client.commands.set(alias, command);
      });
    }
  }
}

export async function registerEvents(client: DiscordClient, dir: string = "") {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Event } = await import(path.join(dir, file));
      const event = new Event();
      client.events.set(event.getName(), event);
      client.on(event.getName(), event.run.bind(event, client));
    }
  }
}

export async function registerErelaEvents(
  client: DiscordClient,
  dir: string = ""
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerErelaEvents(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Event } = await import(path.join(dir, file));
      const event = new Event();
      client.erela.on(event.getName(), event.run.bind(event, client));
    }
  }
}

export async function registerWebSocketEvents(
  client: DiscordClient,
  dir: string = ""
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory())
      registerWebSocketEvents(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Event } = await import(path.join(dir, file));
      const event = new Event();
      client.wss.on(event.getName(), event.run.bind(event, client));
    }
  }
}

export async function registerSlashCommands(
  client: DiscordClient,
  dir: string = ""
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  const slashCommandsArray: ApplicationCommandData[] = [];
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerSlashCommands(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Command } = await import(path.join(dir, file));
      const command = new Command();
      client.slashCommands.set(command.getName(), command);
      slashCommandsArray.push({
        name: command.getName(),
        description: command.getDescription(),
        options: command.getOptions(),
      });
    }
  }
  client.on("ready", (c) => {
    client.guilds.cache.get("783991881028993045")?.commands.set([]);
    client.application?.commands.set(slashCommandsArray);
  });
}
