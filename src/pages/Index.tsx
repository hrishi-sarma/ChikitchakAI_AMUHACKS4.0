
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
        Your AI-powered healthcare companion for virtual consultations, symptom analysis, medical guidance, and health education.
      </p>
      <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
        <Button 
          onClick={() => navigate("/doctors")}
          className="bg-medease-500 hover:bg-medease-600"
        >
          Explore Services
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
  );
};

export default Index;
