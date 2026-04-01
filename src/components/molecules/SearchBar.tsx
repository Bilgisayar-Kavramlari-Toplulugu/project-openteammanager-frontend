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
    <div className="flex items-center gap-2 rounded-xl border border-divider/50 bg-background/50 px-3 py-1.5 transition-all duration-200 focus-within:border-primary/40 focus-within:bg-background focus-within:shadow-sm focus-within:shadow-primary/5">
      <SearchOutlined className="text-sm text-muted" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-32 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted/50 sm:w-52"
      />
      <kbd className="hidden rounded-md border border-divider/50 bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted sm:inline-block">
        /
      </kbd>
    </div>
  );
}
