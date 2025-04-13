
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  MessageSquare, 
  Users, 
  Camera, 
  Clock, 
  FileText, 
  FileX, 
  Sun, 
  Moon, 
  Stethoscope,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

const SidebarIcon = ({ 
  icon: Icon, 
  tooltip, 
  active = false, 
  onClick,
}: { 
  icon: React.ElementType; 
  tooltip: string; 
  active?: boolean; 
  onClick?: () => void;
}) => (
  <div 
    className={cn(
      "sidebar-icon group",
      active && "active-nav-item"
    )}
    onClick={onClick}
  >
    <Icon size={22} />
    <span className="sidebar-tooltip group-hover:scale-100">
      {tooltip}
    </span>
  </div>
);

export function Sidebar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-sidebar border-r border-border shadow-md z-50">
      {/* App Logo */}
      <Link to="/" className="sidebar-icon mt-4">
        <Stethoscope size={24} className="text-medease-500" />
        <span className="sidebar-tooltip group-hover:scale-100">Home</span>
      </Link>

      <div className="flex flex-col items-center mt-10 flex-1 space-y-2">
        {/* Chatbot */}
        <Link to="/chatbot">
          <SidebarIcon 
            icon={MessageSquare} 
            tooltip="AI Chatbot" 
            active={isActive("/chatbot")}
          />
        </Link>

        {/* Doctors List */}
        <Link to="/doctors">
          <SidebarIcon 
            icon={Users} 
            tooltip="Doctors List" 
            active={isActive("/doctors")}
          />
        </Link>

        {/* Image Symptom Identifier */}
        <Link to="/symptom-identifier">
          <SidebarIcon 
            icon={Camera} 
            tooltip="Symptom Identifier" 
            active={isActive("/symptom-identifier")}
          />
        </Link>

        {/* Medicine Timetable */}
        <Link to="/medicine-timetable">
          <SidebarIcon 
            icon={Clock} 
            tooltip="Medicine Timetable" 
            active={isActive("/medicine-timetable")}
          />
        </Link>

        {/* Blood Test Analysis */}
        <Link to="/blood-test">
          <SidebarIcon 
            icon={FileText} 
            tooltip="Blood Test Analysis" 
            active={isActive("/blood-test")}
          />
        </Link>

        {/* X-Ray Analysis */}
        <Link to="/xray-analysis">
          <SidebarIcon 
            icon={FileX} 
            tooltip="X-Ray Analysis" 
            active={isActive("/xray-analysis")}
          />
        </Link>

        {/* Health Blog */}
        <Link to="/blog">
          <SidebarIcon 
            icon={BookOpen} 
            tooltip="Health Blog" 
            active={isActive("/blog")}
          />
        </Link>
      </div>

      {/* Theme Toggle */}
      <div className="mb-6">
        <SidebarIcon 
          icon={theme === "dark" ? Sun : Moon} 
          tooltip={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`} 
          onClick={toggleTheme}
        />
      </div>
    </div>
  );
}
