import { ReactNode } from "react";

interface InlineFormCardProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: number;
}

export default function InlineFormCard({ visible, title, onClose, children, maxHeight = 800 }: InlineFormCardProps) {
  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ maxHeight: visible ? `${maxHeight}px` : "0px" }}
    >
      <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-mosque-text">{title}</p>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-mosque-text transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-5 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
