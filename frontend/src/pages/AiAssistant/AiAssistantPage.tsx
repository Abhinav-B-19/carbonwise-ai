import { useCallback, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";

import ConsentModal from "../../components/chat/ConsentModal";

import chatService, {
  ChatMessage,
  UsageResponse,
} from "../../services/chatService";

import { getUserKey } from "../../services/localStorage";

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [usage, setUsage] = useState<UsageResponse>();

  const [showConsent, setShowConsent] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const accepted = localStorage.getItem("carbonwise_ai_consent");

    if (!accepted) {
      setShowConsent(true);
      return;
    }

    loadData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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

      setMessages(history);

      setUsage(usageData);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
    }
  };

  const acceptConsent = () => {
    localStorage.setItem("carbonwise_ai_consent", "true");

    setShowConsent(false);

    loadData();
  };

  const sendMessage = useCallback(async () => {
    if (!message.trim()) {
      return;
    }

    if (usage && usage.remaining <= 0) {
      toast.error("Daily limit reached");

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

      loadData();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }

      toast.error("Unable to send message");
    } finally {
      setLoading(false);
    }
  }, [message, usage]);

  const clearHistory = useCallback(async () => {
    const confirmed = window.confirm("Clear entire chat history?");

    if (!confirmed) {
      return;
    }

    try {
      const userKey = getUserKey();

      if (!userKey) {
        return;
      }

      await chatService.clearHistory(userKey);

      setMessages([]);

      toast.success("History cleared");

      loadData();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }

      toast.error("Unable to clear history");
    }
  }, []);

  const suggestions = [
    "Analyze my carbon score",
    "How can I reduce emissions?",
    "Create a sustainability plan",
    "What is renewable energy?",
  ];

  return (
    <DashboardLayout>
      <ConsentModal
        open={showConsent}
        onAccept={acceptConsent}
        onClose={() => setShowConsent(false)}
      />

      <PageContainer>
        <div
          className="
            py-4
            h-[calc(100vh-80px)]
            flex
            flex-col
            "
        >
          <div
            className="
            bg-gradient-to-r
            from-green-500
            to-emerald-600
            text-white
            rounded-3xl
            px-8
            py-5
            mb-5
            "
          >
            <h1
              className="
                text-3xl
                font-bold
                "
            >
              AI Sustainability Assistant
            </h1>

            <p className="mt-3">
              Ask sustainability, climate and carbon footprint questions.
            </p>
          </div>

          <div
            className="
                bg-white
                rounded-3xl
                border
                border-slate-200
                shadow-sm
                flex
                flex-col
                flex-1
                overflow-hidden
                "
          >
            <div
              className="
                p-6
                border-b
                flex
                justify-between
                items-center
                "
            >
              <div>
                <h2
                  className="
                    text-xl
                    font-bold
                    "
                >
                  Conversation
                </h2>

                {usage && (
                  <p
                    className="
                      text-sm
                      text-slate-500
                      "
                  >
                    Remaining: {usage.remaining}/{usage.limit}
                  </p>
                )}
              </div>

              <button
                onClick={clearHistory}
                className="
                  px-4
                  py-2
                  rounded-xl
                  border
                  "
              >
                Clear Chat
              </button>
            </div>

            {messages.length === 0 && (
              <div
                className="
                  p-6
                  border-b
                  "
              >
                <p
                  className="
                    text-sm
                    text-slate-500
                    mb-3
                    "
                >
                  Suggested prompts
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                    "
                >
                  {suggestions.map((item) => (
                    <button
                      key={item}
                      onClick={() => setMessage(item)}
                      className="
                          px-3
                          py-2
                          rounded-xl
                          bg-green-50
                          text-green-700
                          "
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              className="
                flex-1
                overflow-y-auto
                p-6
                space-y-4
                min-h-0
                "
            >
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
                        max-w-[70%]
                        lg:max-w-[65%]
                        rounded-2xl
                        p-4
  
                        ${
                          msg.role === "user"
                            ? "bg-green-600 text-white"
                            : "bg-slate-100"
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
                    text-slate-500
                    "
                >
                  Thinking...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div
              className="
                 border-t
                 p-4
                 flex
                 gap-3
                 bg-white
                 shrink-0
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
                  rounded-xl
                  px-4
                  py-3
                  "
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="
                  bg-green-600
                  text-white
                  px-5
                  rounded-xl
                  "
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
