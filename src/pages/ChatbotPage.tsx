
import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import FeatureLayout from "@/components/FeatureLayout";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

// Demo responses for the chatbot
const demoResponses = [
  "Based on your symptoms, it could be a common cold. Rest, hydration, and over-the-counter medication should help.",
  "I recommend consulting with a specialist about those symptoms. I can help you find a doctor in your area.",
  "That's a normal side effect of the medication. If it persists for more than 3 days, please consult your doctor.",
  "Your symptoms might indicate seasonal allergies. Have you tried any antihistamines?",
  "Based on your description, it's not an emergency, but you should schedule an appointment with your primary care physician this week."
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm MedEase AI. How can I assist you with your health questions today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const ChatMessages = () => (
    <div className="flex flex-col h-[calc(100vh-16rem)] overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex max-w-[80%] ${
              message.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Avatar className={`h-8 w-8 ${message.sender === "user" ? "ml-2" : "mr-2"}`}>
              <div className={`h-full w-full flex items-center justify-center ${
                message.sender === "user" 
                  ? "bg-medease-500 text-white" 
                  : "bg-medgreen-500 text-white"
              }`}>
                {message.sender === "user" ? "U" : "AI"}
              </div>
            </Avatar>
            <div
              className={`rounded-xl px-4 py-2 ${
                message.sender === "user"
                  ? "bg-medease-100 text-gray-800 rounded-tr-none"
                  : "bg-medgreen-100 text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="break-words">{message.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="flex flex-row">
            <Avatar className="h-8 w-8 mr-2">
              <div className="h-full w-full flex items-center justify-center bg-medgreen-500 text-white">
                AI
              </div>
            </Avatar>
            <div className="bg-medgreen-100 text-gray-800 rounded-xl rounded-tl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ChatInput = () => (
    <div className="p-4 border-t">
      <form
        className="flex items-center space-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your health question..."
          className="flex-1"
          disabled={loading}
        />
        <Button 
          type="submit" 
          className="bg-medease-500 hover:bg-medease-600"
          disabled={loading || !input.trim()}
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );

  const InfoPanel = () => (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">AI Medical Assistant</h2>
      <div className="space-y-4 flex-1">
        <p className="text-muted-foreground">
          Our AI chatbot can help with:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Answering general health questions</li>
          <li>Providing initial symptom assessment</li>
          <li>Offering medication information</li>
          <li>Finding local healthcare providers</li>
          <li>Explaining medical terminology</li>
        </ul>
        <div className="bg-medease-50 dark:bg-medease-900/30 p-4 rounded-lg mt-8">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> This AI assistant provides general information only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <FeatureLayout
      title="AI Health Assistant"
      leftPanel={
        <div className="flex flex-col h-full">
          <ChatMessages />
          <ChatInput />
        </div>
      }
      rightPanel={<InfoPanel />}
    />
  );
}
