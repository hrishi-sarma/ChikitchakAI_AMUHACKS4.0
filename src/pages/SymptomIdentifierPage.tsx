
import { useState } from "react";
import FeatureLayout from "@/components/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Info, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SymptomIdentifierPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const analyzeImage = () => {
    if (!uploadedImage) return;
    
    setAnalyzing(true);
    
    // Mock analysis - in a real app, this would call an API
    setTimeout(() => {
      setAnalysisResult({
        condition: "Contact Dermatitis",
        confidence: 87.2,
        description: "This appears to be contact dermatitis, an inflammatory skin condition caused by contact with irritants or allergens.",
        recommendations: [
          "Avoid contact with the suspected irritant",
          "Apply over-the-counter hydrocortisone cream",
          "Take an oral antihistamine to relieve itching",
          "Consult a dermatologist if symptoms persist for more than a week"
        ],
        severity: "Mild to Moderate"
      });
      setAnalyzing(false);
    }, 2000);
  };
  
  const UploadPanel = () => (
    <div className="p-6 h-full flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Upload Skin Image</h2>
        <p className="text-muted-foreground text-sm">
          Upload a clear, well-lit image of the affected area for analysis
        </p>
      </div>
      
      {!uploadedImage ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12">
          <div className="text-center">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Drag and drop an image, or click to browse
            </p>
            <label htmlFor="image-upload">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button variant="outline" className="mx-auto">
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </label>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="relative mx-auto mb-6 max-h-[50vh] overflow-hidden rounded-lg">
            <img
              src={uploadedImage}
              alt="Uploaded symptom"
              className="max-w-full max-h-[50vh] object-contain"
            />
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" onClick={() => setUploadedImage(null)}>
              Change Image
            </Button>
            <Button
              onClick={analyzeImage}
              disabled={analyzing}
              className="bg-medease-500 hover:bg-medease-600"
            >
              {analyzing ? "Analyzing..." : "Analyze Image"}
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-xs text-muted-foreground text-center">
        <p className="flex items-center justify-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          For educational purposes only. Always consult a healthcare professional.
        </p>
      </div>
    </div>
  );
  
  const ResultsPanel = () => (
    <div className="p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      
      {!analysisResult ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <Info className="h-16 w-16 text-medease-300 mb-4" />
          <p className="text-muted-foreground">
            {analyzing 
              ? "Analyzing your image..."
              : uploadedImage 
                ? "Click 'Analyze Image' to get results" 
                : "Upload an image to see analysis results"}
          </p>
          {analyzing && (
            <div className="mt-4 flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-medease-500 animate-bounce"></div>
              <div className="w-3 h-3 rounded-full bg-medease-500 animate-bounce delay-100"></div>
              <div className="w-3 h-3 rounded-full bg-medease-500 animate-bounce delay-200"></div>
            </div>
          )}
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6">
            <div className="bg-medease-50 dark:bg-medease-900/30 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{analysisResult.condition}</h3>
                <span className="bg-medease-100 text-medease-800 px-2 py-1 rounded text-sm">
                  {analysisResult.confidence.toFixed(1)}% Match
                </span>
              </div>
              <p className="mt-2 text-muted-foreground">
                {analysisResult.description}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Severity</h3>
              <div className="bg-medgreen-50 dark:bg-medgreen-900/30 p-3 rounded">
                {analysisResult.severity}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-2">
                {analysisResult.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Next Steps</h3>
              <Button className="w-full bg-medease-500 hover:bg-medease-600 mb-2">
                Consult with a Specialist
              </Button>
              <Button variant="outline" className="w-full">
                Learn More About This Condition
              </Button>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-sm">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <p>
                  This analysis is preliminary and for informational purposes only. 
                  Please consult with a healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );

  return (
    <FeatureLayout
      title="Symptom Identifier"
      leftPanel={<UploadPanel />}
      rightPanel={<ResultsPanel />}
    />
  );
}
