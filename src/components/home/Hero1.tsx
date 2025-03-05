import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const Hero1 = () => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Adjust timing for staggered effect
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="animate-gradient flex h-screen max-h-[900px] w-full max-w-[1536px] flex-col items-center justify-center bg-radial-[at_50%_0%] from-red-100 via-amber-50 to-blue-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex h-full w-full flex-col items-center justify-center px-6">
        <motion.div
          className="flex w-full items-start justify-start text-7xl font-bold md:text-9xl"
          variants={textVariants}
        >
          Health<span className="text-primary">.</span>
        </motion.div>
        <motion.div
          className="flex w-full items-center justify-center text-7xl font-bold md:text-9xl"
          variants={textVariants}
        >
          Meets<span className="text-primary">.</span>
        </motion.div>
        <motion.div
          className="flex w-full items-end justify-end text-7xl font-bold md:text-9xl"
          variants={textVariants}
        >
          AI+ML<span className="text-primary">.</span>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-4"
      >
        <ChevronDown className="animate-bounce" />
      </motion.div>
    </motion.section>
  );
};
