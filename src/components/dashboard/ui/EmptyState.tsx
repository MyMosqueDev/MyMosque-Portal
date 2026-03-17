interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center px-4">
      <p className="font-semibold text-mosque-text">{title}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
