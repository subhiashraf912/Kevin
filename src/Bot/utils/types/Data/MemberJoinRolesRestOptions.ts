import { Snowflake } from "discord.js";

interface MemberJoinRolesRestOptions {
  guildId: Snowflake;
  roles: Snowflake[];
}

export default MemberJoinRolesRestOptions;
