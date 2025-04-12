
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface FeatureLayoutProps {
  title: string;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export default function FeatureLayout({ title, leftPanel, rightPanel }: FeatureLayoutProps) {
  return (
    <div className="w-full animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-poppins font-semibold mb-6 text-gray-800 dark:text-gray-100">
        {title}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <Card className="h-full overflow-hidden panel">
            {leftPanel}
          </Card>
        </div>
        
        <div className="h-full">
          <Card className="h-full overflow-hidden panel">
            {rightPanel}
          </Card>
        </div>
      </div>
    </div>
  );
}
