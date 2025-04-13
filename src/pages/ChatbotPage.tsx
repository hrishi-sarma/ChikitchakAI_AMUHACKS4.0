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

// Demo responses for the chatbot
const demoResponses = [
  "Based on your symptoms, it could be a common cold. Rest, hydration, and over-the-counter medication should help.",
  "I recommend consulting with a specialist about those symptoms. I can help you find a doctor in your area.",
  "That's a normal side effect of the medication. If it persists for more than 3 days, please consult your doctor.",
  "Your symptoms might indicate seasonal allergies. Have you tried any antihistamines?",
  "Based on your description, it's not an emergency, but you should schedule an appointment with your primary care physician this week."
];

// Keywords to match with specific responses
const keywordResponses: Record<string, string> = {
  "headache": "Headaches can have many causes including stress, dehydration, or tension. For occasional headaches, over-the-counter pain relievers like acetaminophen or ibuprofen may help. If headaches are severe or persistent, please consult a doctor.",
  "cold": "Common cold symptoms include runny nose, congestion, sore throat, and cough. Rest, hydration, and over-the-counter cold medications can help manage symptoms. If fever is high or symptoms worsen after 7-10 days, consult a healthcare provider.",
  "fever": "A fever is often a sign that your body is fighting an infection. For adults, a temperature above 100.4°F (38°C) is considered a fever. Rest, hydration, and fever reducers like acetaminophen may help. If the fever is high or persists for more than 2-3 days, seek medical attention.",
  "allergy": "Allergies can cause symptoms like sneezing, runny nose, itchy eyes, and skin rashes. Antihistamines, nasal sprays, and avoiding allergen triggers can help manage symptoms. For severe allergic reactions, seek immediate medical attention.",
  "diabetes": "Diabetes is a chronic condition that affects how your body processes blood sugar. Managing diabetes typically involves monitoring blood sugar levels, maintaining a healthy diet, regular exercise, and sometimes medication or insulin therapy. Regular checkups with your healthcare provider are important.",
  "doctor": "I can help you find doctors in your area. You can also check our 'Find Doctors' section on this app to search for healthcare providers by specialty or location.",
  "emergency": "If you're experiencing a medical emergency such as severe chest pain, difficulty breathing, severe bleeding, or loss of consciousness, call emergency services (911) immediately or go to the nearest emergency room."
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load messages from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Ensure timestamps are Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error('Error parsing saved messages', e);
      }
    }
    
    // Default initial message
    return [
      {
        id: "1",
        text: "Hello! I'm MedEase AI. How can I assist you with your health questions today?",
        sender: "bot" as const,
        timestamp: new Date(),
      }
    ];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user" as const,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    // Simulate AI response with a delay
    setTimeout(() => {
      // Check for keyword matches first
      const lowerInput = input.toLowerCase();
      let responseText = "";
      
      // Check for keyword matches
      for (const [keyword, response] of Object.entries(keywordResponses)) {
        if (lowerInput.includes(keyword)) {
          responseText = response;
          break;
        }
      }
      
      // If no keyword matches, use a random response
      if (!responseText) {
        responseText = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "bot" as const,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
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
          autoFocus  // This will automatically focus the input on render
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
                onClick={() => {
                  setInput(suggestion);
                }}
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
