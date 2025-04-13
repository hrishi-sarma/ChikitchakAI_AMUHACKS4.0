
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, UserSearch, Pill, FileText, Image as ImageIcon, MessagesSquare, BookOpen } from "lucide-react";

// Define feature data for the homepage
const features = [
  
];

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-4 text-gray-800 dark:text-gray-100 animate-fade-in">
          Chikitsak.AI
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 text-center max-w-2xl mx-auto mb-8 animate-fade-in">
          Your AI-powered healthcare companion for virtual consultations, symptom analysis, medical guidance, and health education.
        </p>
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
          <Button 
            onClick={() => navigate("/chatbot")}
            className="bg-medease-500 hover:bg-medease-600"
          >
            Start Chatting
          </Button>
          <Button 
            onClick={() => navigate("/blog")}
            variant="outline"
            className="border-medease-500 text-medease-600 hover:bg-medease-50"
          >
            Read Health Blog
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Card 
            key={feature.title}
            className={`border hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 ${feature.color}`}
            onClick={() => navigate(feature.path)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                {feature.icon}
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="ghost" 
                className="w-full justify-start pl-0 hover:pl-2 transition-all"
                onClick={() => navigate(feature.path)}
              >
                Explore {feature.title} →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
