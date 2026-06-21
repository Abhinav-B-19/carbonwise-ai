import React from "react";

interface Props {
  suggestions: string[];
  onSelect: (message: string) => void;
}

function SuggestionChips({ suggestions, onSelect }: Props) {
  return (
    <div
      className="
        flex
        gap-2
        overflow-x-auto
        mb-3
        pb-1
      "
    >
      {suggestions.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="
              whitespace-nowrap
              px-3
              py-1.5
              rounded-full
              bg-green-50
              text-green-700
              border
              border-green-200
              text-xs
              hover:bg-green-100
            "
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default React.memo(SuggestionChips);
