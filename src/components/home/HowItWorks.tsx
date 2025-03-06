import { NavLink } from "react-router";
import { Button } from "../ui/button";
import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";

export const HowItWorks = () => {
  return (
    <AnimatedSection id="how-it-works" className="container mx-auto px-4 py-20">
      <div className="mb-16 text-center">
        <motion.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          How HealthAI Works
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-xl text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Our platform combines artificial intelligence with medical expertise
          to provide you with reliable healthcare guidance.
        </motion.p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        <StepCard
          number="1"
          title="Describe Your Symptoms"
          description="Input your symptoms through our user-friendly interface or chat with our AI assistant."
          delay={0.1}
        />

        <StepCard
          number="2"
          title="AI Analysis"
          description="Our AI analyzes your symptoms using machine learning algorithms trained on medical data."
          delay={0.3}
        />

        <StepCard
          number="3"
          title="Consult Best Doctors"
          description="Consult the best doctors according to your disease by booking appointment"
          delay={0.5}
        />
      </div>

      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <NavLink to="/register">
          <Button size="lg" className="px-8 text-lg">
            Try It Now
          </Button>
        </NavLink>
      </motion.div>
    </AnimatedSection>
  );
};
function StepCard({
  number,
  title,
  description,
  delay = 0,
}: {
  number: string;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.div
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100"
        whileHover={{ scale: 1.1, backgroundColor: "#dbeafe" }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <span className="text-primary text-2xl font-bold">{number}</span>
      </motion.div>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
