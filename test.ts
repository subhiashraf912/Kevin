import { Client, Message, TextChannel } from "discord.js";
import intents from "./src/Bot/utils/ClientIntents";

const client = new Client({ intents: intents });

client.login("OTMyMzYyNTg3NTUzNzkyMDYw.YeR4Uw.ZPd-oWZ5DxnvxMIwiYhN3pf192A");

const ageRolesText = `
<:hhh:933476566728589373><:hhh:933476566728589373> ** <:SenHi:837696477739352064>  Age Roles** <:hhh:933476566728589373><:hhh:933476566728589373>
- You can choose your age role from here.
  ╰  So other members can know your age by clicking on your profile!
`;

const communityRolesText = `
<:hhh:933476566728589373><:hhh:933476566728589373> ** <:SenBlush:852951428707123200>  Community Roles** <:hhh:933476566728589373><:hhh:933476566728589373>
  - You can choose your community roles from here.
  ╰  So other members can know your community by clicking on your profile!
`;

const colorRolesText = `
<:hhh:933476566728589373><:hhh:933476566728589373> ** <:SenHi:852848882555682827>  Color Roles** <:hhh:933476566728589373><:hhh:933476566728589373>
  - You can choose your color role from here.
  ╰  Your name in the chat will be in this color
  ╰  also other members can know your fav color by clicking on your profile!
`;

const genderRolesText = `
<:hhh:933476566728589373><:hhh:933476566728589373> ** <:SenHappy:852951936193527828>  Gender Roles** <:hhh:933476566728589373><:hhh:933476566728589373>
  - You can choose your gender role from here.
  ╰  other members can know your gender by clicking on your profile!
`;

const pingsRolesText = `
<:hhh:933476566728589373><:hhh:933476566728589373> ** <:SenWoah:852950951413284924>  Pings Roles** <:hhh:933476566728589373><:hhh:933476566728589373>
  - You can choose your ping roles from here.
  ╰  Once the moderators have updates or announces about something related to those roles you'll get pinged!
`;

const dereRolesText = `
<:hhh:933476566728589373><:hhh:933476566728589373> ** <:SenSips:784667158457614336>  Dere Roles** <:hhh:933476566728589373><:hhh:933476566728589373>
  - You can choose your dere roles from here.
   ╰  other members can know your dere type by clicking on your profile!
`;

const texts = {
  "982242086705311754": ageRolesText,
  "982242844779626516": communityRolesText,
  "982243185457762374": colorRolesText,
  "982243553914793984": genderRolesText,
  "982243866767937556": pingsRolesText,
  "982244188617850930": dereRolesText,
};

let backup: Message | null = null;

client.on("ready", () => console.log("ready"));

client.on("message", async (message) => {
  if (
    message.author.id === "507684120739184640" &&
    message.content === "change-text"
  ) {
    await message.reply({ content: "changing-text" });
    const channel = (await message.guild?.channels.fetch(
      "982229830374420530"
    )) as TextChannel;
    for (const [key, value] of Object.entries(texts)) {
      const channelId = key;
      const content = value;
      const msg = await channel.messages.fetch(channelId);
      await msg.edit({ content });
    }
    await message.reply({ content: "done" });
  }
});
