import React, { useState, useRef, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";
import { systemPrompt, initialMessages } from "./ModelTrainingIA";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const buttonRef = useRef(null);
  const typingTimeoutsRef = useRef([]);

  const botConfig = {
    name: "DoarBot",
    avatar: "🤖",
    colorScheme: {
      primary: "#10B981",
      secondary: "#F3F4F6",
      accent: "#3B82F6",
      textDark: "#1F2937",
      textLight: "#FFFFFF",
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: {
        base: "14px",
        large: "16px",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
  };

  const buttonVariants = {
    hidden: { x: 0, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 500,
        damping: 25,
      },
    },
  };

  const API_KEY = process.env.REACT_APP_GEMINI_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      typingTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nContexto atual: ${JSON.stringify(
                    messages.slice(-3).map((m) => m.text)
                  )}\n\nPergunta: ${inputValue}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
          },
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const botResponse = data.candidates[0].content.parts[0].text;

      typingTimeoutsRef.current.forEach(clearTimeout);
      typingTimeoutsRef.current = [];

      setMessages((prev) => [
        ...prev,
        {
          text: "",
          sender: "bot",
        },
      ]);

      setIsLoading(false);
      setIsTyping(false);

      let displayedResponse = "";
      [...botResponse].forEach((char, i) => {
        const timeoutId = setTimeout(() => {
          displayedResponse += char;
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.text = displayedResponse;
            return [...newMessages];
          });

          if (i === botResponse.length - 1) {
            setIsLoading(false);
          }
        }, i * 20);

        typingTimeoutsRef.current.push(timeoutId);
      });
    } catch (error) {
      console.error("Erro ao chamar Gemini:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Estou com problemas técnicos. Tente novamente mais tarde.",
          sender: "bot",
          quickReplies: ["Como doar?", "Ajuda com conta", "ONGs próximas"],
        },
      ]);
      setIsLoading(false);
      setIsTyping(false);
    }
  };

 

  return (
    <div className="fixed bottom-16 right-6 z-[999] font-sans">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
            className="w-[20rem] h-[30rem] bg-white rounded-2xl shadow-xl flex flex-col border border-gray-200 overflow-hidden"
            style={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              fontFamily: botConfig.typography.fontFamily,
            }}
          >
            <div
              className="p-4 rounded-t-2xl flex justify-between items-center"
              style={{
                backgroundColor: botConfig.colorScheme.primary,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm"
                >
                  {botConfig.avatar}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {botConfig.name}
                  </h3>
                  <p className="text-xs text-white opacity-90">
                    Estou aqui para ajudar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-all duration-200"
                aria-label="Fechar chat"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div
              className="flex-1 p-4 overflow-y-auto bg-gray-50"
              style={{ fontSize: botConfig.typography.fontSize.large }}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`mb-4 flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      msg.sender === "user"
                        ? "text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow-xs"
                    }`}
                    style={{
                      backgroundColor:
                        msg.sender === "user"
                          ? botConfig.colorScheme.accent
                          : "white",
                      boxShadow:
                        msg.sender === "bot"
                          ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                          : "none",
                    }}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <p
                        key={i}
                        className="break-words"
                        style={{ lineHeight: "1.5" }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}

              {isTyping &&
                !messages.some(
                  (msg) => msg.sender === "bot" && msg.text === ""
                ) && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center">
                      <ThreeDots
                        height="24"
                        width="40"
                        color={botConfig.colorScheme.primary}
                        ariaLabel="Carregando resposta"
                      />
                      <span className="ml-2 text-gray-500 text-sm">
                        Digitando...
                      </span>
                    </div>
                  </div>
                )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="relative">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                    style={{
                      fontSize: botConfig.typography.fontSize.large,
                      paddingRight: "3rem",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full focus:outline-none transition-colors ${
                      isLoading || !inputValue.trim()
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-600 hover:text-green-700"
                    }`}
                    aria-label="Enviar mensagem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chat-button"
            ref={buttonRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={buttonVariants}
            onClick={() => setIsOpen(true)}
            className="p-4 rounded-full shadow-lg fixed bottom-16 right-6"
            style={{
              backgroundColor: botConfig.colorScheme.primary,
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
            aria-label="Abrir chat de ajuda"
            whileHover={{
              scale: 1.1,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: isOpen ? 0 : 360 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </motion.div>
              <motion.span
                className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
