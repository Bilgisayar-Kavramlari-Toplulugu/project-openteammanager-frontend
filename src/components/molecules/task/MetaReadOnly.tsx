interface MetaReadOnlyProps {
  label: string;
  value: string;
}

export default function MetaReadOnly({ label, value }: MetaReadOnlyProps) {
  return (
    <div className="flex items-center justify-between py-1 text-xs">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
