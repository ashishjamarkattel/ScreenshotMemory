import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Extract the session value from the cookies
    const cookieString = document.cookie;
    const sessionMatch = cookieString.match(/wos_session=([^;]+)/);
    const sessionValue = sessionMatch ? sessionMatch[1] : null;

    // If session value is found, make the fetch request
    if (sessionValue) {
      try {
        const response = await fetch("http://0.0.0.0:8000/chat", {
          method: "POST",
          credentials: "include", // This ensures cookies are sent with the request
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${sessionValue}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: inputMessage })
        });

        if (!response.ok) {
          throw new Error("Failed to fetch AI response");
        }

        const data = await response.json();
        const aiMessage: Message = {
          id: messages.length + 2,
          text: data.response, // Assuming backend responds with { response: string }
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

      } catch (error) {
        console.error("Error:", error);
        const aiMessage: Message = {
          id: messages.length + 2,
          text: "Sorry, I couldn't get a response from the server.",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } else {
      console.error("No session found");
      const aiMessage: Message = {
        id: messages.length + 2,
        text: "Session not found, please login again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }

    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-sm">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary/80 backdrop-blur-sm text-primary-foreground ml-4'
                    : 'bg-muted/80 backdrop-blur-sm mr-4'
                }`}
              >
                <p className="text-white/90">{message.text}</p>
                <span className="text-xs text-white/60">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-white/10 p-4 bg-black/40 backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2 max-w-3xl mx-auto"
        >
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
          <Button 
            type="submit"
            className="bg-primary/80 hover:bg-primary/90 backdrop-blur-sm"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
