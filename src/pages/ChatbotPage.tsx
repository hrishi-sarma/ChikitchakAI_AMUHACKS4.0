import { useState, useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import FeatureLayout from "@/components/FeatureLayout";
import { useToast } from "@/components/ui/use-toast";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error('Error parsing saved messages', e);
      }
    }
    return [
      {
        id: "1",
        text: "Hello! I'm MedEase AI. How can I assist you with your health questions today?",
        sender: "bot",
        timestamp: new Date(),
      }
    ];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add the user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Save current input for sending then clear input
    const currentInput = input;
    setInput("");
    setLoading(true);
    
    try {
      // Send a POST request to the Flask chatbot API
      const response = await fetch("http://localhost:5003/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: currentInput })
      });
      
      if (!response.ok) {
        throw new Error("Error from server");
      }
      
      const data = await response.json();
      
      // Build a response text from the returned JSON object
      let botResponseText = "";
      
      if (data.error) {
        botResponseText = data.error;
      } else {
        // Assemble a summary from the response object; you can adjust this formatting
        if (data.possible_conditions && data.possible_conditions.length) {
          botResponseText += "Possible Conditions:\n";
          data.possible_conditions.forEach((cond: any) => {
            botResponseText += `${cond.condition} (${cond.likelihood})\nDescription: ${cond.description}\nTreatment: ${cond.general_treatment}\nRecommended Specialist: ${cond.recommended_specialist}\n\n`;
          });
        }
        if (data.recommended_doctors && data.recommended_doctors.length) {
          botResponseText += "Recommended Doctors:\n";
          data.recommended_doctors.forEach((doc: any) => {
            botResponseText += `${doc.name} – ${doc.specialization} (Experience: ${doc.experience}) Contact: ${doc.contact}\n`;
          });
          botResponseText += "\n";
        }
        botResponseText += `Advice: ${data.general_advice}\nDisclaimer: ${data.disclaimer}`;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Error analyzing query:", error);
      toast({
        title: "Chatbot Error",
        description: error.message || "There was an error processing your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const initialMessage = {
      id: Date.now().toString(),
      text: "Hello! I'm MedEase AI. How can I assist you with your health questions today?",
      sender: "bot" as const,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    toast({
      title: "Chat cleared",
      description: "All previous messages have been cleared."
    });
  };

  const ChatMessages = () => (
    <div className="flex flex-col h-[calc(100vh-16rem)] overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <Avatar className={`h-8 w-8 ${message.sender === "user" ? "ml-2" : "mr-2"}`}>
              <div className={`h-full w-full flex items-center justify-center ${message.sender === "user" ? "bg-medease-500 text-white" : "bg-medgreen-500 text-white"}`}>
                {message.sender === "user" ? "U" : "AI"}
              </div>
            </Avatar>
            <div className={`rounded-xl px-4 py-2 ${message.sender === "user" ? "bg-medease-100 text-gray-800 rounded-tr-none" : "bg-medgreen-100 text-gray-800 rounded-tl-none"}`}>
              <p className="break-words">{message.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
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
          autoFocus
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
        <div className="mt-4">
          <h3 className="font-medium mb-2">Try asking about:</h3>
          <div className="flex flex-wrap gap-2">
            {["Headache", "Allergies", "Cold symptoms", "Diabetes", "Finding a doctor"].map(suggestion => (
              <Button 
                key={suggestion} 
                variant="outline" 
                size="sm" 
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <Button variant="outline" className="w-full" onClick={clearChat}>
            Clear Conversation
          </Button>
        </div>
        <div className="bg-medease-50 dark:bg-medease-900/30 p-4 rounded-lg mt-4">
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
