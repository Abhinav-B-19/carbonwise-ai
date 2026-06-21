import React from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../services/chatService";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

function ChatMessages({ messages, loading, messagesEndRef }: Props) {
  return (
    <div
      className="
        flex-1
        overflow-y-auto
        p-4
        space-y-4
        bg-slate-50
      "
    >
      {messages.length === 0 && (
        <div
          className="
            text-center
            text-slate-500
            text-sm
            mt-12
          "
        >
          Ask sustainability, climate, carbon footprint or environmental
          questions.
        </div>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={
            msg.role === "user" ? "flex justify-end" : "flex justify-start"
          }
        >
          <div
            className={`
                max-w-[85%]
                rounded-2xl
                p-3
                text-sm
                ${
                  msg.role === "user"
                    ? `
                      bg-emerald-600
                      text-white
                      shadow-sm
                    `
                    : `
                      bg-white
                      text-slate-700
                      border
                      border-slate-200
                      shadow-sm
                    `
                }
              `}
          >
            <ReactMarkdown skipHtml>{msg.message}</ReactMarkdown>
          </div>
        </div>
      ))}

      {loading && (
        <div
          className="
            text-sm
            text-slate-500
          "
        >
          Thinking...
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default React.memo(ChatMessages);
