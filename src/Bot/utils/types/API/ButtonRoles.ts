type buttonRoles = {
  roleId: string;
  roleDescription: string | null;
  roleEmoji: string | null;
};
interface ButtonRoles {
  guildId: string;
  roles: buttonRoles[];
  buttonRolesCustomId: string;
  maxRoles: number;
  requiredRole: string;
}

export default ButtonRoles;
