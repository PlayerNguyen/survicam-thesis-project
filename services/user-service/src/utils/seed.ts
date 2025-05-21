import { UserService } from "../services/User";

async function addAdminUser() {
  if (!(await UserService.checkIfExists("nhng@gmail.com", "nhng"))) {
    console.log(`Seeding default user if not exists (removed on deployment): `);
    await UserService.createUser({
      email: "nhng@gmail.com",
      username: "nhng",
      hash: "nhng@123456",
      name: "Nguyên",
    });
  }

  console.log(`Successfully add the admin user`);
}

export const Seed = {
  addAdminUser,
};
