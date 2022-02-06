type menuRoles = {
  roleId: string;
  roleDescription: string | null;
  roleEmoji: string | null;
};
interface MenuRoles {
  guildId: string;
  roles: menuRoles[];
  menuCustomId: string;
}

export default MenuRoles;
