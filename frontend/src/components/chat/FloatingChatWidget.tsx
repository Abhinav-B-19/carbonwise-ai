import { useEffect, useRef, useState } from "react";

import { MessageCircle, X, Send, Sparkles } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import ReactMarkdown from "react-markdown";

import chatService, {
  ChatMessage,
  UsageResponse,
} from "../../services/chatService";

import { getUserKey } from "../../services/localStorage";

export default function FloatingChatWidget() {
  const location = useLocation();
  const navigate = useNavigate();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [usage, setUsage] = useState<UsageResponse>();

  const suggestions = [
    "Analyze my carbon score",
    "How can I reduce emissions?",
    "Create sustainability plan",
    "What is renewable energy?",
  ];

  if (location.pathname === "/ai-assistant") {
    return null;
  }

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

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

  const loadData = async () => {
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
      console.error(error);
    }
  };

  const sendMessage = async () => {
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Backdrop */}
          <div
            data-testid="chat-backdrop"
            className="
              fixed
              inset-0
              z-[998]
              "
            onClick={() => setOpen(false)}
          />

          {/* Chat Widget */}
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
            {/* HEADER */}

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

                <button onClick={() => setOpen(false)}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* CHAT */}

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
                    msg.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
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
                    <ReactMarkdown>{msg.message}</ReactMarkdown>
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

            {/* FOOTER */}

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
                    onClick={() => setMessage(item)}
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

              <div
                className="
                  flex
                  gap-2
                  "
              >
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
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
                  onClick={sendMessage}
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
            </div>
          </div>
        </>
      )}
    </>
  );
}
