
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, UserSearch, Pill, FileBar, Image as ImageIcon, MessagesSquare, BookOpen } from "lucide-react";

// Define feature data for the homepage
const features = [
  {
    title: "AI Health Assistant",
    description: "Chat with our AI to get quick answers to your health questions and concerns.",
    icon: <MessagesSquare className="h-10 w-10 text-medease-500" />,
    path: "/chatbot",
    color: "bg-medease-50 dark:bg-medease-900/30"
  },
  {
    title: "Find Doctors",
    description: "Discover and book appointments with the best healthcare providers near you.",
    icon: <UserSearch className="h-10 w-10 text-indigo-500" />,
    path: "/doctors",
    color: "bg-indigo-50 dark:bg-indigo-900/30"
  },
  {
    title: "Symptom Identifier",
    description: "Upload skin images to identify potential dermatological conditions.",
    icon: <Stethoscope className="h-10 w-10 text-rose-500" />,
    path: "/symptom-identifier",
    color: "bg-rose-50 dark:bg-rose-900/30"
  },
  {
    title: "Medicine Timetable",
    description: "Track and manage your medication schedule with timely reminders.",
    icon: <Pill className="h-10 w-10 text-emerald-500" />,
    path: "/medicine-timetable",
    color: "bg-emerald-50 dark:bg-emerald-900/30"
  },
  {
    title: "Blood Test Analysis",
    description: "Upload and analyze your blood test results for easy interpretation.",
    icon: <FileBar className="h-10 w-10 text-amber-500" />,
    path: "/blood-test",
    color: "bg-amber-50 dark:bg-amber-900/30"
  },
  {
    title: "X-Ray Analysis",
    description: "AI-powered analysis of X-ray images for preliminary assessment.",
    icon: <ImageIcon className="h-10 w-10 text-cyan-500" />,
    path: "/xray-analysis",
    color: "bg-cyan-50 dark:bg-cyan-900/30"
  },
  {
    title: "Health Blog",
    description: "Read the latest articles on health topics written by medical professionals.",
    icon: <BookOpen className="h-10 w-10 text-purple-500" />,
    path: "/blog",
    color: "bg-purple-50 dark:bg-purple-900/30"
  }
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
