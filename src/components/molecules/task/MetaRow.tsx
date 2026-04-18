interface MetaRowProps {
  label: string;
  children: React.ReactNode;
}

export default function MetaRow({ label, children }: MetaRowProps) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted">
        {label}
      </div>
      {children}
    </div>
  );
}
