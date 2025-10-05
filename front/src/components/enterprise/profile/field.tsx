export function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 ${className || ""}`}>
      <span className="text-xs font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}