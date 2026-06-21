import React from "react";
import { Send } from "lucide-react";

interface Props {
  message: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

function ChatInput({ message, loading, onChange, onSend }: Props) {
  return (
    <div
      className="
        flex
        gap-2
      "
    >
      <input
        value={message}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
        placeholder="Ask CarbonWise AI..."
        className="
          flex-1
          border
          border-slate-300
          rounded-xl
          px-3
          py-2
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-green-500
        "
      />

      <button
        disabled={loading}
        onClick={onSend}
        className="
          bg-green-600
          text-white
          px-3
          rounded-xl
          disabled:opacity-50
        "
      >
        <Send size={16} />
      </button>
    </div>
  );
}

export default React.memo(ChatInput);
