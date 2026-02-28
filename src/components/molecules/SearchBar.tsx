"use client";

import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ExampleButton from "@/components/atoms/ExampleButton";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
}: SearchBarProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <Space.Compact>
      <Input placeholder={placeholder} onChange={handleSearch} />
      <ExampleButton label="Search" icon={<SearchOutlined />} type="primary" />
    </Space.Compact>
  );
}
