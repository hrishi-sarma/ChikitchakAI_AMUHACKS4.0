
import { useState } from "react";
import FeatureLayout from "@/components/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, AlertCircle, ChevronDown, Printer, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for blood test results
const bloodTestData = {
  date: "April 8, 2023",
  labName: "HealthLabs Medical Center",
  patient: {
    name: "John Doe",
    age: 45,
    gender: "Male",
  },
  results: [
    {
      category: "Complete Blood Count",
      tests: [
        { name: "White Blood Cell (WBC)", value: 7.8, unit: "10³/µL", normal: "4.5-11.0", status: "normal" },
        { name: "Red Blood Cell (RBC)", value: 5.2, unit: "10⁶/µL", normal: "4.5-5.9", status: "normal" },
        { name: "Hemoglobin (Hgb)", value: 15.1, unit: "g/dL", normal: "13.5-17.5", status: "normal" },
        { name: "Hematocrit (Hct)", value: 45, unit: "%", normal: "41-50", status: "normal" },
        { name: "Platelets", value: 290, unit: "10³/µL", normal: "150-450", status: "normal" },
      ],
    },
    {
      category: "Lipid Panel",
      tests: [
        { name: "Total Cholesterol", value: 210, unit: "mg/dL", normal: "<200", status: "high" },
        { name: "LDL Cholesterol", value: 145, unit: "mg/dL", normal: "<100", status: "high" },
        { name: "HDL Cholesterol", value: 42, unit: "mg/dL", normal: ">40", status: "normal" },
        { name: "Triglycerides", value: 150, unit: "mg/dL", normal: "<150", status: "normal" },
      ],
    },
    {
      category: "Metabolic Panel",
      tests: [
        { name: "Glucose", value: 98, unit: "mg/dL", normal: "70-99", status: "normal" },
        { name: "BUN", value: 15, unit: "mg/dL", normal: "7-20", status: "normal" },
        { name: "Creatinine", value: 0.9, unit: "mg/dL", normal: "0.6-1.2", status: "normal" },
        { name: "Sodium", value: 141, unit: "mmol/L", normal: "135-145", status: "normal" },
        { name: "Potassium", value: 4.0, unit: "mmol/L", normal: "3.5-5.0", status: "normal" },
        { name: "Calcium", value: 9.5, unit: "mg/dL", normal: "8.5-10.5", status: "normal" },
      ],
    },
  ],
  historicalData: [
    { date: "Jan 2022", cholesterol: 195, glucose: 92, wbc: 7.2 },
    { date: "Apr 2022", cholesterol: 200, glucose: 95, wbc: 7.5 },
    { date: "Jul 2022", cholesterol: 205, glucose: 97, wbc: 7.6 },
    { date: "Oct 2022", cholesterol: 208, glucose: 96, wbc: 7.7 },
    { date: "Jan 2023", cholesterol: 210, glucose: 98, wbc: 7.8 },
  ],
};

export default function BloodTestPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(true);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // In a real app, this would trigger the file analysis
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setResultsVisible(true);
      }, 2000);
    }
  };
  
  const UploadPanel = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Blood Test Report</h2>
      
      {!uploadedFile ? (
        <div className="mt-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Drag and drop your blood test report PDF or image,
              <br />or click to browse
            </p>
            <label htmlFor="report-upload">
              <input
                id="report-upload"
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button variant="outline" className="mx-auto">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </label>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Supported Reports</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 flex items-center border border-gray-200">
                <div className="w-10 h-10 bg-medease-100 rounded-full flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-medease-500" />
                </div>
                <div>
                  <h4 className="font-medium">PDF Reports</h4>
                  <p className="text-sm text-muted-foreground">
                    From most labs
                  </p>
                </div>
              </Card>
              
              <Card className="p-4 flex items-center border border-gray-200">
                <div className="w-10 h-10 bg-medease-100 rounded-full flex items-center justify-center mr-3">
                  <Upload className="h-5 w-5 text-medease-500" />
                </div>
                <div>
                  <h4 className="font-medium">Image Files</h4>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG formats
                  </p>
                </div>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p className="flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              Your documents are securely processed. We never store your personal health information without your consent.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="bg-medease-50 dark:bg-medease-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-medease-500 mr-3" />
              <div className="flex-1 truncate">
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadedFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          </div>
          
          {analyzing ? (
            <div className="text-center py-10">
              <FileText className="h-16 w-16 text-medease-300 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground mb-4">
                Analyzing your blood test report...
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-medease-500 animate-bounce"></div>
                <div className="w-3 h-3 rounded-full bg-medease-500 animate-bounce delay-100"></div>
                <div className="w-3 h-3 rounded-full bg-medease-500 animate-bounce delay-200"></div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">Blood Test Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Your blood test report has been successfully analyzed. View the detailed results in the panel on the right.
              </p>
              
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Analysis
                </Button>
                <Button className="flex-1 bg-medease-500 hover:bg-medease-600">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
  const ResultsPanel = () => (
    <div className="h-full">
      {!resultsVisible ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <FileText className="h-16 w-16 text-medease-300 mb-4" />
          <p className="text-muted-foreground">
            Upload a blood test report to see analysis results
          </p>
        </div>
      ) : (
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Blood Test Results</h2>
              <span className="text-sm text-muted-foreground">
                {bloodTestData.date}
              </span>
            </div>
            
            <div className="bg-medease-50 dark:bg-medease-900/30 rounded-lg p-4 mb-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">{bloodTestData.patient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age/Gender</p>
                  <p className="font-medium">
                    {bloodTestData.patient.age} / {bloodTestData.patient.gender}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lab</p>
                  <p className="font-medium">{bloodTestData.labName}</p>
                </div>
              </div>
            </div>
            
            {/* Trending Chart */}
            <div className="mb-6">
              <h3 className="font-medium mb-4">Trends Over Time</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={bloodTestData.historicalData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="cholesterol" 
                      stroke="#0EA5E9" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line type="monotone" dataKey="glucose" stroke="#10B981" />
                    <Line type="monotone" dataKey="wbc" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Test Results Accordion */}
            <div className="space-y-4">
              {bloodTestData.results.map((category, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center">
                    <h3 className="font-medium">{category.category}</h3>
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm text-muted-foreground">
                          <th className="text-left font-normal pb-2">Test</th>
                          <th className="text-left font-normal pb-2">Result</th>
                          <th className="text-left font-normal pb-2">Unit</th>
                          <th className="text-left font-normal pb-2">Reference</th>
                          <th className="text-left font-normal pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.tests.map((test, testIndex) => (
                          <tr key={testIndex} className="border-t">
                            <td className="py-3">{test.name}</td>
                            <td className="py-3 font-medium">{test.value}</td>
                            <td className="py-3 text-muted-foreground">{test.unit}</td>
                            <td className="py-3 text-muted-foreground">{test.normal}</td>
                            <td className="py-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                test.status === "normal" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {test.status === "normal" ? "Normal" : "High"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-4">Recommendations</h3>
              <div className="bg-medgreen-50 dark:bg-medgreen-900/30 p-4 rounded-lg">
                <div className="space-y-4">
                  <p>Based on your test results, we recommend:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Follow a diet low in saturated fats to help reduce your cholesterol levels.</li>
                    <li>Consider increasing physical activity to at least 150 minutes per week.</li>
                    <li>Discuss with your doctor about potential medication options if lifestyle changes do not sufficiently improve your cholesterol levels.</li>
                    <li>Schedule a follow-up test in 3 months to monitor your progress.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex space-x-4">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button className="flex-1 bg-medease-500 hover:bg-medease-600">
                Share with Doctor
              </Button>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );

  return (
    <FeatureLayout
      title="Blood Test Analysis"
      leftPanel={<UploadPanel />}
      rightPanel={<ResultsPanel />}
    />
  );
}
