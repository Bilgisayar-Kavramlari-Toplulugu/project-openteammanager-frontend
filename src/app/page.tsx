"use client";

import { Typography } from "antd";
import MainLayout from "@/components/templates/MainLayout";
import ExampleButton from "@/components/atoms/ExampleButton";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <MainLayout>
      <Typography>
        <Title level={2}>Welcome to OpenTeamManager</Title>
        <Paragraph>
          An open source team management platform. This project uses Atomic
          Design architecture with Next.js, TypeScript, Tailwind CSS, and Ant
          Design.
        </Paragraph>
      </Typography>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <ExampleButton label="Get Started" type="primary" size="large" />
        <ExampleButton label="Documentation" size="large" />
      </div>
    </MainLayout>
  );
}
