import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center jarvis-theme">
      <div className="jarvis-card p-12 text-center jarvis-hud">
        <h1 className="mb-4 text-6xl font-bold jarvis-text-glow">System Error 404</h1>
        <p className="mb-6 text-xl opacity-80">Location coordinates not found in database</p>
        <a 
          href="/" 
          className="jarvis-button inline-block px-6 py-3 hover:scale-105 transition-transform"
        >
          Return to Command Center
        </a>
      </div>
    </div>
  );
};

export default NotFound;
