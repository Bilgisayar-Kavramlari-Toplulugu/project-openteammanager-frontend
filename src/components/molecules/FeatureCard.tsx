"use client";

interface FeatureCardProps {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  iconClass,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]">
      <span
        className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base ring-1 ${iconClass}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-[0.8rem] leading-relaxed text-indigo-200/60">
          {description}
        </p>
      </div>
    </div>
  );
}
