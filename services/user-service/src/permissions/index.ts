import Permissions from "../db/Permissions";

export type PermissionName = "create_role";
export type PermissionValue = {
  id: number;
  name: string;
  description?: string;
};
const SystemPermissions: {
  [key in PermissionName]: PermissionValue;
} = {
  create_role: {
    id: 1,
    name: "Creates a new role",
    description: `Creates a new role.`,
  },
};

export async function loadPermissionIntoDatabase() {
  for (const permissionKey in SystemPermissions) {
    // @ts-ignore
    const permissionObject = SystemPermissions[permissionKey];
    const length = await Permissions.countDocuments({
      _id: permissionObject.id,
    });
    if (length <= 0) {
      console.log(`Generate permission: ${permissionKey}`);
      const { id, ...restOfPermissionObject } = permissionObject;

      const permission = await Permissions.create({
        _id: id,
        ...restOfPermissionObject,
      });
      await permission.save();
    }
  }
}

export default SystemPermissions;
