import React from "react";
import { Sparkles, X } from "lucide-react";

interface Props {
  onClose: () => void;
}

function ChatHeader({ onClose }: Props) {
  return (
    <div
      className="
        bg-gradient-to-r
        from-emerald-600
        to-green-600
        text-white
        px-5
        py-4
        shrink-0
      "
    >
      <div
        className="
          flex
          justify-between
          items-start
        "
      >
        <div
          className="
            flex
            gap-2
          "
        >
          <Sparkles size={18} />

          <div>
            <p className="font-semibold">CarbonWise AI</p>

            <p
              className="
                text-xs
                text-white/80
              "
            >
              Sustainability Assistant
            </p>
          </div>
        </div>

        <button onClick={onClose} aria-label="Close chat">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(ChatHeader);
