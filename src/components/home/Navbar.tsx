import { ScanHeart } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed z-50 flex w-full items-center justify-center bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm lg:px-6">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-neutral-900">
            <ScanHeart />
            HealthAI
          </div>
          <a href="#get-started">Get Started</a>
        </div>
      </div>
    </nav>
  );
};
