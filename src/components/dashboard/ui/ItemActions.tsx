type Section = "announcements" | "events" | "prayer";

interface ItemActionsProps {
  onEdit?: () => void;
  onDelete: () => void;
  section?: Section;
  onDuplicate?: () => void;
  viewUrl?: string;
  canEdit?: boolean;
}

const editClassBySection: Record<Section, string> = {
  announcements: "text-mosque-green  bg-mosque-green/8  hover:bg-mosque-green/15",
  events:        "text-mosque-blue   bg-mosque-blue/8   hover:bg-mosque-blue/15",
  prayer:        "text-mosque-purple bg-mosque-purple/8 hover:bg-mosque-purple/15",
};

export default function ItemActions({
  onEdit,
  onDelete,
  section = "events",
  onDuplicate,
  viewUrl,
  canEdit = true,
}: ItemActionsProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {onDuplicate && (
        <button
          onClick={onDuplicate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      )}
      {onEdit && canEdit && (
        <button
          onClick={onEdit}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${editClassBySection[section]}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}
      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
      {viewUrl && (
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
