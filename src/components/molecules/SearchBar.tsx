"use client";

import { SearchOutlined } from "@ant-design/icons";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export default function SearchBar({
  placeholder = "Ara...",
  onSearch,
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-divider bg-background px-3 py-1.5 transition-colors focus-within:border-primary">
      <SearchOutlined className="text-muted" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-32 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted sm:w-48"
      />
    </div>
  );
}
