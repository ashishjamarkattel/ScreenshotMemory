import { SendHorizonal } from "lucide-react";
import { useState, useEffect, useRef, forwardRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}



const InitialChatInterface=  forwardRef<HTMLInputElement, {}>((props, ref) =>{
  const [isVisible, setIsVisible] = useState(false);
  const [chatAppeared,setChatAppeared]=useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");


  useEffect(() => {
    const handleScroll = () => {
        console.log('Scrolling...', window.scrollY);
      const scrollPosition = window.scrollY;
      if (scrollPosition > 200 && !chatAppeared) {
        setIsVisible(true);     // Show chat after scrolling 200px
        setChatAppeared(true);  // Set chatAppeared to true once chat is triggered
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
    
    setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: `You said: ${input}` },
        ]);
      }, 1000);
  };

  const handleFocus = () => {
    if (ref && "current" in ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",    
      });
    }
  };

  const closeChat = () => {
    setIsVisible(false);
  };


  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };


  if (!isVisible) return null;

  return (
    
    <div  className="fixed inset-0 flex justify-center items-end p-4 transition-all duration-200  ease-in-out shadow-lg ">
        <div className="w-full max-w-3xl shadow-xl rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-white font-bold">Chat with AI</h3>
                <button onClick={closeChat} className="text-white">
                    X
                </button>
            </div>

        <div  className="flex flex-col space-y-4 overflow-y-auto max-h-[500px] mb-4">
            {messages.map((msg, idx) => (
            <div
                key={idx}
                className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
                <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    msg.role === "assistant" ? "bg-gray-100" : "bg-black text-white"
                }`}
                >
                {msg.content}
                </div>
            </div>
            ))}
        </div>

        <form onSubmit={handleSendMessage} 
            className="flex items-center gap-2 border rounded-xl p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <input
                        ref={ref}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 p-3 border-none bg-inherit focus:outline-none
                         text-white placeholder:text-white placeholder:opacity-60"
                         onFocus={handleFocus}
                    />
                    <button
                        type="submit"
                        className=" text-white px-6 py-3 rounded-xl focus:outline-none"
                    >
                        <SendHorizonal size={24}/>
                    </button>
        </form>
    </div>
  </div>




         
  );
})

export default InitialChatInterface;
