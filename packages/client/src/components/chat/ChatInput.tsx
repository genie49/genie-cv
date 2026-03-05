import { useState } from "react";
import { ArrowUp } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="flex items-center gap-3 border-t border-zinc-100 px-6 py-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Genie에 대해 물어보세요..."
        disabled={disabled}
        className="h-11 flex-1 rounded-[10px] bg-zinc-100 px-4 text-sm text-black placeholder-zinc-400 outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-black text-white disabled:opacity-40"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}
