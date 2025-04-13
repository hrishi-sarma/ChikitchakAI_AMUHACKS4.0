import { useState, useRef } from "react";
import FeatureLayout from "@/components/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Info, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

export default function GenomeAnalysisPage() {
  const [uploadedText, setUploadedText] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  interface AnalysisResult {
    mutation: string;
    description: string;
    recommendations: string[];
    severity: string;
  }

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (file.type !== "text/plain") {
        toast({
          title: "Invalid file type",
          description: "Please upload a plain text (.txt) file.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedText(event.target?.result as string);
        setAnalysisResult(null);
        toast({
          title: "File uploaded",
          description: "Your genome text file has been uploaded. Click 'Analyze File' to continue.",
        });
      };
      reader.readAsText(file);
    }
  };

  const analyzeText = async () => {
    if (!uploadedText) return;
  
    setAnalyzing(true);
  
    try {
      const blob = new Blob([uploadedText], { type: "text/plain" });
      const file = new File([blob], "genome.txt", { type: "text/plain" });
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("http://localhost:5001/api/analyze-genome", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data.error || !data.results || data.results.length === 0) {
        throw new Error(data.error || "No valid SNPs found.");
      }
  
      const firstResult = data.results[0]; // Displaying only the first result for now
      setAnalysisResult({
        mutation: `${firstResult.gene} (${firstResult.rsid})`,
        description: firstResult.predictive_health,
        recommendations: [
          firstResult.lifestyle_advice,
          firstResult.nutrition_advice,
          ...Object.values(firstResult.health_report || {}),
        ],
        severity:
          firstResult.category === "homozygous_risk"
            ? "High Risk"
            : firstResult.category === "heterozygous"
            ? "Moderate Risk"
            : "Low Risk",
      });
  
      toast({
        title: "Analysis complete",
        description: `Report generated for ${firstResult.rsid}`,
      });
    } catch (err: any) {
      toast({
        title: "Analysis failed",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };
  

  const UploadPanel = () => (
    <div className="p-6 h-full flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Upload Genome Data</h2>
        <p className="text-muted-foreground text-sm">
          Upload a plain text file (.txt) containing your genomic sequence or data
        </p>
      </div>

      {!uploadedText ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Click below to select a .txt file</p>
            <label htmlFor="text-upload">
              <input
                id="text-upload"
                type="file"
                accept=".txt"
                className="hidden"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
              <Button variant="outline" className="mx-auto" onClick={handleButtonClick}>
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </label>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="border rounded p-4 bg-gray-50 dark:bg-gray-800 max-h-[200px] overflow-auto text-sm whitespace-pre-wrap">
            {uploadedText}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setUploadedText(null);
                setAnalysisResult(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Change File
            </Button>
            <Button
              onClick={analyzeText}
              disabled={analyzing}
              className="bg-medease-500 hover:bg-medease-600"
            >
              {analyzing ? "Analyzing..." : "Analyze File"}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 text-xs text-muted-foreground text-center">
        <p className="flex items-center justify-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          For informational use only. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );

  const ResultsPanel = () => (
    <div className="p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Genome Analysis Results</h2>
      {!analysisResult ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <Info className="h-16 w-16 text-medease-300 mb-4" />
          <p className="text-muted-foreground">
            {analyzing
              ? "Analyzing genome file..."
              : uploadedText
                ? "Click 'Analyze File' to see results"
                : "Upload a genome text file to begin"}
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6">
            <div className="bg-medease-50 dark:bg-medease-900/30 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{analysisResult.mutation}</h3>
                <span className="bg-medease-100 text-medease-800 px-2 py-1 rounded text-sm">
              
                </span>
              </div>
              <p className="mt-2 text-muted-foreground">{analysisResult.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Severity</h3>
              <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded">
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
          </div>
        </ScrollArea>
      )}
    </div>
  );

  return (
    <FeatureLayout
      title="Genome Analysis"
      leftPanel={<UploadPanel />}
      rightPanel={<ResultsPanel />}
    />
  );
}
