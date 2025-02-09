import { Button, Menu } from "@mantine/core";
import { useContext } from "react";
import AppUserContext from "../../../contexts/AppUserContex";
import {
  RiLogoutBoxRLine,
  RiSettingsLine,
  RiUserFill,
  RiUserLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../routes";
import TokenStorage from "../../../../utils/TokenStorage";

export default function AppHeaderMenuTrigger() {
  const { user } = useContext(AppUserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    TokenStorage.deleteToken();
    window.location.href = "/";
  };

  return (
    <Menu
      transitionProps={{
        transition: "pop-top-right",
        duration: 50,
        exitDuration: 170,
      }}
    >
      <Menu.Target>
        <Button
          size="xs"
          disabled={user?.isLoading}
          variant="light"
          leftSection={!user?.isLoading && <RiUserFill />}
          radius={"xl"}
        >
          {user?.isLoading ? "Loading..." : `${user?.user?.name ?? "Guest"}`}
        </Button>
      </Menu.Target>
      <Menu.Dropdown w={200}>
        {/* Application section */}
        <Menu.Label>Application</Menu.Label>
        <Menu.Item
          leftSection={<RiSettingsLine size={14} />}
          onClick={() => navigate(AppRoutes.Settings.Index())}
        >
          Settings
        </Menu.Item>

        {/* User section */}
        <Menu.Label>User</Menu.Label>
        <Menu.Item
          leftSection={<RiUserLine size={14} />}
          onClick={() => {
            navigate(AppRoutes.Settings.Index() + "?tabs=account");
          }}
        >
          Profile
        </Menu.Item>

        <Menu.Item
          leftSection={<RiLogoutBoxRLine size={14} />}
          color="red.4"
          onClick={handleLogout}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
