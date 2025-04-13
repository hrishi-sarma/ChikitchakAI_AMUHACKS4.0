
import { useState, useRef } from "react";
import FeatureLayout from "@/components/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Info, AlertCircle, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export default function XRayAnalysisPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image less than 10MB in size.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc).",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setAnalysisResult(null);
        setZoom(100);
        setRotation(0);
        toast({
          title: "X-ray image uploaded",
          description: "Your image has been uploaded successfully. Click 'Analyze X-Ray' to continue."
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image less than 10MB in size.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc).",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setAnalysisResult(null);
        setZoom(100);
        setRotation(0);
        toast({
          title: "X-ray image uploaded",
          description: "Your image has been uploaded successfully. Click 'Analyze X-Ray' to continue."
        });
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
        finding: "No significant abnormalities detected",
        confidence: 89.3,
        details: [
          {
            region: "Lungs",
            observation: "Clear lung fields without evidence of consolidation, effusion, or pneumothorax.",
            confidence: 92.1
          },
          {
            region: "Heart",
            observation: "Normal cardiac silhouette. Cardiothoracic ratio within normal limits.",
            confidence: 90.5
          },
          {
            region: "Bones",
            observation: "No acute fractures or dislocations. Mild degenerative changes in the thoracic spine.",
            confidence: 87.8
          },
          {
            region: "Soft Tissues",
            observation: "Unremarkable soft tissue findings.",
            confidence: 93.2
          }
        ],
        recommendations: [
          "No further imaging studies required at this time.",
          "Recommend clinical correlation with patient symptoms.",
          "Follow-up imaging in 12 months as preventative screening."
        ]
      });
      setAnalyzing(false);
      toast({
        title: "Analysis complete",
        description: "Your X-ray has been analyzed. View the detailed results in the right panel."
      });
    }, 2500);
  };
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 20, 200));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 20, 60));
  };
  
  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };
  
  const ImageViewerPanel = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-2">X-Ray Image Viewer</h3>
        
        {!uploadedImage ? (
          <div 
            className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 mt-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Upload an X-ray image for analysis
              </p>
              <label htmlFor="xray-upload">
                <input
                  id="xray-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
                <Button variant="outline" className="mx-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose X-Ray Image
                </Button>
              </label>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setUploadedImage(null);
                setAnalysisResult(null);
                setZoom(100);
                setRotation(0);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Change Image
            </Button>
            <Button
              size="sm"
              onClick={analyzeImage}
              disabled={analyzing}
              className="bg-medease-500 hover:bg-medease-600"
            >
              {analyzing ? "Analyzing..." : "Analyze X-Ray"}
            </Button>
          </div>
        )}
        
        {uploadedImage && (
          <div className="flex justify-between items-center mt-2 mb-2">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRotate}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Zoom: {zoom}%</span>
              <div className="w-24">
                <Slider
                  value={[zoom]}
                  min={60}
                  max={200}
                  step={10}
                  onValueChange={(value) => setZoom(value[0])}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-black/10 dark:bg-black/30 overflow-hidden relative">
        {uploadedImage ? (
          <div 
            className="relative flex items-center justify-center"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <img
              src={uploadedImage}
              alt="X-Ray"
              className="max-w-full max-h-full object-contain"
            />
            
            {analysisResult && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Visualizations/markers would go here in a real app */}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-muted-foreground">
              Upload an X-ray image to view it here
            </p>
          </div>
        )}
        
        {analyzing && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
            <div className="text-center">
              <p className="mb-4">AI analyzing your X-ray image...</p>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-medease-200 animate-bounce"></div>
                <div className="w-3 h-3 rounded-full bg-medease-200 animate-bounce delay-100"></div>
                <div className="w-3 h-3 rounded-full bg-medease-200 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const AnalysisPanel = () => (
    <div className="h-full">
      <Tabs defaultValue="results" className="h-full flex flex-col">
        <div className="px-6 pt-6 pb-0">
          <TabsList className="mb-6">
            <TabsTrigger value="results">Analysis Results</TabsTrigger>
            <TabsTrigger value="guide">Usage Guide</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="results" className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="px-6 pb-6">
              {!analysisResult ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <Info className="h-16 w-16 text-medease-300 mb-4" />
                  <p className="text-muted-foreground">
                    {analyzing 
                      ? "AI is analyzing your X-ray image..."
                      : uploadedImage 
                        ? "Click 'Analyze X-Ray' to get results" 
                        : "Upload an X-ray image to see analysis results"}
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
                <div className="space-y-6">
                  <div className="bg-medease-50 dark:bg-medease-900/30 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{analysisResult.finding}</h3>
                      <span className="bg-medease-100 text-medease-800 px-2 py-1 rounded text-sm">
                        {analysisResult.confidence.toFixed(1)}% Confidence
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Detailed Findings</h3>
                    <div className="space-y-4">
                      {analysisResult.details.map((detail: any, i: number) => (
                        <div key={i} className="border rounded-lg p-4">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium">{detail.region}</h4>
                            <span className="text-sm text-muted-foreground">
                              {detail.confidence.toFixed(1)}% Confidence
                            </span>
                          </div>
                          <p className="text-muted-foreground">{detail.observation}</p>
                        </div>
                      ))}
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
                    <Button 
                      className="w-full bg-medease-500 hover:bg-medease-600 mb-2"
                      onClick={() => toast({
                        title: "Report shared",
                        description: "Your X-ray analysis report has been shared with your doctor."
                      })}
                    >
                      Share with My Doctor
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast({
                        title: "Report downloaded",
                        description: "Your X-ray analysis report has been downloaded."
                      })}
                    >
                      Download Analysis Report
                    </Button>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-sm">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p>
                        This AI analysis is for informational purposes only and should not replace 
                        professional medical diagnosis. Always consult with a qualified healthcare 
                        provider for proper interpretation of X-ray images.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="guide" className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="px-6 pb-6 space-y-6">
              <div>
                <h3 className="font-medium mb-2">How to Use the X-Ray Analyzer</h3>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>Upload a clear, high-resolution X-ray image using the upload button.</li>
                  <li>Ensure the image is properly oriented and the entire region of interest is visible.</li>
                  <li>Click "Analyze X-Ray" to begin the AI analysis process.</li>
                  <li>Review the detailed findings and recommendations in the results tab.</li>
                  <li>Use the zoom and rotate controls to examine specific areas of the image.</li>
                  <li>Share the results with your healthcare provider for professional interpretation.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Supported X-Ray Types</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Chest X-rays (PA and lateral views)</li>
                  <li>Extremity X-rays (arms, hands, legs, feet)</li>
                  <li>Abdominal X-rays</li>
                  <li>Spinal X-rays (cervical, thoracic, lumbar)</li>
                  <li>Dental X-rays</li>
                </ul>
              </div>
              
              <div className="bg-medease-50 dark:bg-medease-900/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Best Practices</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Use digital X-ray images for best results.</li>
                  <li>Ensure all identifying information is removed for privacy.</li>
                  <li>Upload the highest quality image available.</li>
                  <li>Consult with a radiologist or appropriate specialist for official diagnosis.</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Important Disclaimer</p>
                    <p className="mt-1 text-sm">
                      This X-ray analysis tool is intended for educational and informational purposes only. 
                      The AI analysis should not be used as a substitute for professional medical advice, 
                      diagnosis, or treatment. Always seek the advice of your physician or other qualified 
                      health provider with any questions you may have regarding a medical condition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <FeatureLayout
      title="X-Ray Analysis"
      leftPanel={<ImageViewerPanel />}
      rightPanel={<AnalysisPanel />}
    />
  );
}
