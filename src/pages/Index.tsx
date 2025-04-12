
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-4 text-gray-800 dark:text-gray-100 animate-fade-in">
        Chikitsak.AI
      </h1>
      <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 text-center max-w-lg mb-8 animate-fade-in">
        Your AI-powered healthcare companion for virtual consultations, symptom analysis, and medical guidance.
      </p>
      <Button 
        onClick={() => navigate("/doctors")}
        className="animate-fade-in"
      >
        Explore Services
      </Button>
    </div>
  );
};

export default Index;
