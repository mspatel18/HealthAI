import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";

export const Faq = () => {
  return (
    <AnimatedSection id="faq" className="container mx-auto px-4 py-20">
      <div className="mb-16 text-center">
        <motion.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-xl text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Find answers to common questions about our AI-powered healthcare
          platform.
        </motion.p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <FaqItem
          question="Is HealthAI a replacement for seeing a doctor?"
          answer="No, HealthAI is designed to be a preliminary step before consulting a healthcare professional. Our AI provides guidance and suggestions, but it does not replace medical advice from qualified doctors."
          delay={0.1}
        />

        <FaqItem
          question="How accurate is the AI diagnosis?"
          answer="Our AI has been trained on extensive medical data and achieves high accuracy rates for common conditions. However, it's important to understand that it provides preliminary assessments that should be confirmed by healthcare professionals."
          delay={0.2}
        />

        <FaqItem
          question="Is my health data secure?"
          answer="Yes, we take data security very seriously. All your health information is encrypted and stored securely. We comply with healthcare data protection regulations and never share your data without your explicit consent."
          delay={0.3}
        />

        <FaqItem
          question="Can I use HealthAI for emergency situations?"
          answer="HealthAI is not designed for emergencies. If you're experiencing a medical emergency, please call emergency services (911) or go to your nearest emergency room immediately."
          delay={0.4}
        />

        <FaqItem
          question="How does the appointment booking system work?"
          answer="Based on your AI assessment, our system can recommend appropriate specialists and allow you to book appointments directly through our platform with participating healthcare providers."
          delay={0.5}
        />
      </div>
    </AnimatedSection>
  );
};

function FaqItem({
  question,
  answer,
  delay = 0,
}: {
  question: string;
  answer: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.div whileHover={{ y: -2 }}>
        <Card className="border-0 shadow-sm transition hover:shadow">
          <CardContent className="p-6">
            <h3 className="mb-2 text-lg font-semibold">{question}</h3>
            <p className="text-gray-600">{answer}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
