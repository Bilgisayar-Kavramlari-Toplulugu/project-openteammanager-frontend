"use client";

import { Menu } from "antd";
import { HomeOutlined, TeamOutlined, SettingOutlined } from "@ant-design/icons";
import SearchBar from "@/components/molecules/SearchBar";

const menuItems = [
  { key: "home", icon: <HomeOutlined />, label: "Home" },
  { key: "teams", icon: <TeamOutlined />, label: "Teams" },
  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
];

export default function Navbar() {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0 24px" }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginRight: 24 }}>
        OpenTeamManager
      </div>
      <Menu
        mode="horizontal"
        items={menuItems}
        style={{ flex: 1, borderBottom: "none" }}
      />
      <SearchBar placeholder="Search teams..." />
    </div>
  );
}
