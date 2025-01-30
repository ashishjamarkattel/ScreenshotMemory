import { MessageSquare, SendHorizonal } from "lucide-react";
import { useState, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const InitialChatInterface = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [chatAppeared, setChatAppeared] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [backgroundBlur, setBackgroundBlur] = useState(false);
  const [isChatClosed, setIsChatClosed] = useState(false); 
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 200 && !chatAppeared) {
        setIsVisible(true);
        setChatAppeared(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chatAppeared]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { role: "user", content: input },
      {
        role: "assistant",
        content: "This is a simulated AI response. In a real implementation, this would be connected to an AI service.",
      },
    ]);

    setInput("");
    setBackgroundBlur(true); 

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: `You said: ${input}` },
      ]);
    }, 1000);
  };

  const closeChat = () => {
    setIsChatClosed(true);
    setBackgroundBlur(false); 
  };

  const reopenChat = () => {
    setIsChatClosed(false); 
    setBackgroundBlur(true); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setButtonDisabled(e.target.value.trim() === ""); 
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-end p-4 transition-all duration-200 ease-in-out ${
        backgroundBlur ? "backdrop-blur-md" : ""
      }`}
    >
      <div className="w-full max-w-3xl shadow-xl rounded-xl p-4 z-50 ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-foreground font-bold">Chat with AI</h3>
          <button onClick={closeChat}>
            X
          </button>
        </div>

        {!isChatClosed && (
          <div className="flex flex-col space-y-4 overflow-y-auto max-h-[400px] mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-r from-purple-600 to-pink-500"
                      : "bg-primary text-primaryForeground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSendMessage} 
            className="flex items-center gap-2 border rounded-xl p-1 shadow-sm  
             border-gray-300 dark:border-neutral-700 bg-inherit 
              focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-700 
             ">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 p-3 border-none bg-inherit focus:outline-none
                         text-white placeholder:text-white placeholder:opacity-60"
                 
                    />
                    <button
                        type="submit"
                        className=" text-white px-6 py-3 rounded-xl focus:outline-none"
                    >
                        <SendHorizonal size={24} className="{input?opacity-20:null}"/>
                    </button>
        </form>
        {isChatClosed && (
          <button
            onClick={reopenChat}
            className="mt-4 flex items-center gap-2 text-white bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 rounded-lg"
          >
            Reopen Chat
            <MessageSquare size={20}/>
          </button>
        )}
      </div>
    </div>
  );
};

export default InitialChatInterface;
