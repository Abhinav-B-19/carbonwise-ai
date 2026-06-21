import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import chatService, {
  ChatMessage,
  UsageResponse,
} from "../../services/chatService";

import { getUserKey } from "../../services/localStorage";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SuggestionChips from "./SuggestionChips";

function FloatingChatWidget() {
  const location = useLocation();
  const navigate = useNavigate();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [usage, setUsage] = useState<UsageResponse>();

  const suggestions = useMemo(
    () => [
      "Analyze my carbon score",
      "How can I reduce emissions?",
      "Create sustainability plan",
      "What is renewable energy?",
    ],
    [],
  );

  const loadData = useCallback(async () => {
    try {
      const userKey = getUserKey();

      if (!userKey) {
        return;
      }

      const [history, usageData] = await Promise.all([
        chatService.getHistory(userKey),
        chatService.getUsage(userKey),
      ]);

      setMessages(history.slice(-10));

      setUsage(usageData);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (!message.trim()) {
      return;
    }

    if (usage && usage.remaining <= 0) {
      return;
    }

    const userKey = getUserKey();

    if (!userKey) {
      return;
    }

    const userMessage = message;

    setMessage("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        message: userMessage,
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      setLoading(true);

      const response = await chatService.sendMessage(userKey, userMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: response.response,
          createdAt: new Date().toISOString(),
        },
      ]);

      await loadData();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }, [message, usage, loadData]);

  if (location.pathname === "/ai-assistant") {
    return null;
  }

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, loadData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        chatRef.current &&
        !chatRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed
            bottom-6
            right-6
            h-16
            w-16
            rounded-full
            bg-green-600
            text-white
            shadow-[0_20px_40px_rgba(22,163,74,0.35)]
            z-[999]
            flex
            items-center
            justify-center
            hover:scale-105
            transition-all
          "
        >
          <MessageCircle size={28} />
        </button>
      )}

      {open && (
        <>
          <div
            data-testid="chat-backdrop"
            className="
              fixed
              inset-0
              z-[998]
            "
            onClick={() => setOpen(false)}
          />

          <div
            ref={chatRef}
            className="
              fixed
              bottom-6
              right-6
              w-[420px]
              max-w-[95vw]
              h-[calc(100vh-48px)]
              max-h-[800px]
              bg-white
              rounded-3xl
              shadow-[0_30px_80px_rgba(0,0,0,0.18)]
              border
              border-slate-200
              z-[999]
              flex
              flex-col
              overflow-hidden
            "
          >
            <ChatHeader onClose={() => setOpen(false)} />

            <ChatMessages
              messages={messages}
              loading={loading}
              messagesEndRef={messagesEndRef}
            />

            <div
              className="
                border-t
                bg-white
                p-3
                shrink-0
              "
            >
              {usage && (
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-3
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        text-slate-500
                      "
                    >
                      AI Messages Left Today
                    </p>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-green-600
                      "
                    >
                      {usage.remaining}/{usage.limit}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/ai-assistant")}
                    className="
                      text-xs
                      px-3
                      py-1.5
                      rounded-lg
                      bg-green-50
                      text-green-700
                      border
                      border-green-200
                      hover:bg-green-100
                      transition
                    "
                  >
                    Open Full Assistant →
                  </button>
                </div>
              )}

              <SuggestionChips
                suggestions={suggestions}
                onSelect={setMessage}
              />

              <ChatInput
                message={message}
                loading={loading}
                onChange={setMessage}
                onSend={sendMessage}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default React.memo(FloatingChatWidget);
