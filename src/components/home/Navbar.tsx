import { ScanHeart } from "lucide-react";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed z-50 flex w-full items-center justify-center bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm lg:px-6"
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <a href="/">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-neutral-900">
              <ScanHeart />
              HealthAI
            </div>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {["Features", "How It Works", "FAQ"].map((item, i) => (
              <motion.a
                key={i}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-gray-700 transition hover:text-blue-600"
              >
                {item}
              </motion.a>
            ))}
          </nav>
          <a
            href="#get-started"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#get-started")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Get Started
          </a>
        </div>
      </div>
    </motion.header>
  );
};
