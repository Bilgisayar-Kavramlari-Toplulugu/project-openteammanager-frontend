"use client";

import { Button, type ButtonProps } from "antd";

interface ExampleButtonProps extends ButtonProps {
  label: string;
}

export default function ExampleButton({ label, ...props }: ExampleButtonProps) {
  return <Button {...props}>{label}</Button>;
}
