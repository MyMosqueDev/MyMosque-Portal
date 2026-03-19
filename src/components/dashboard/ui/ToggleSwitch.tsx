interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  /** CSS variable or value for the checked background, e.g. "var(--mosque-purple)" */
  colorVar?: string;
}

export default function ToggleSwitch({ checked, onChange, colorVar = "var(--mosque-green)" }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      className="relative w-10 h-[22px] rounded-full transition-colors shrink-0"
      style={{ backgroundColor: checked ? "var(--neutral-border)" : colorVar }}
    >
      <span
        className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
          checked ? "translate-x-[-16px]" : ""
        }`}
      />
    </button>
  );
}
