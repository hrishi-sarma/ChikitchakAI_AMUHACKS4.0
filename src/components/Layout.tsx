
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-16 p-4 md:p-8 transition-all duration-300 ease-in-out">
        {children}
      </div>
    </div>
  );
}
