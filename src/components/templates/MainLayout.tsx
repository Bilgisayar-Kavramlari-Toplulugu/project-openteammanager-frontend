"use client";

import { Layout } from "antd";
import Navbar from "@/components/organisms/Navbar";

const { Header, Content, Footer } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: 0 }}>
        <Navbar />
      </Header>
      <Content style={{ padding: "24px 48px" }}>{children}</Content>
      <Footer style={{ textAlign: "center" }}>
        OpenTeamManager &copy; {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}
