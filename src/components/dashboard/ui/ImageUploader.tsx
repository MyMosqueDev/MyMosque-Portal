interface ImageUploaderProps {
  image: string | null;
  onChange: (url: string) => void;
  onClear: () => void;
  label?: string;
}

export default function ImageUploader({ image, onChange, onClear, label = "Add image" }: ImageUploaderProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onChange(URL.createObjectURL(file));
  }

  return (
    <div className="relative w-40 shrink-0">
      <label
        className="flex flex-col items-center justify-center h-full min-h-[148px] rounded-xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden bg-gray-50 relative"
        style={image ? { borderColor: "transparent" } : { borderColor: "var(--neutral-border)" }}
      >
        {image ? (
          <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-3 text-center">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-300 font-medium leading-tight">{label}</span>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
      {image && (
        <button
          onClick={onClear}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-10"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
