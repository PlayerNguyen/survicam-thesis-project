import Roles from "../db/Roles";
import SystemPermissions from "../permissions";

export type RoleName = "User";
export type RoleObject = {
  id: string;
  name: string;
  description?: string;
  permissions: number[];
};

const SystemRole: {
  [key in RoleName]: RoleObject;
} = {
  User: {
    id: "User",
    name: "User",
    description: "The default user role.",
    permissions: [SystemPermissions.create_role.id],
  },
};

export async function loadDefaultRole() {
  for (const roleKey in SystemRole) {
    // @ts-ignore
    const roleObject = SystemRole[roleKey];
    const length = await Roles.countDocuments({
      _id: roleObject.id,
    });
    if (length <= 0) {
      console.log(`Generate default role: ${roleKey}`);
      const { id, ...restOfRoleObject } = roleObject;

      const role = await Roles.create({
        _id: id,
        ...restOfRoleObject,
      });
      await role.save();
    }
  }
}
export default SystemRole;
