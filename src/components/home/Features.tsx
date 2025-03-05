import { Brain, Calendar, Shield, Users, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "./AnimatedSection";
export const Features = () => {
  return (
    <AnimatedSection
      id="features"
      className="container mx-auto rounded-3xl bg-white px-4 py-20"
    >
      <div className="mb-16 text-center">
        <motion.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Comprehensive Healthcare Features
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-xl text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Our AI-powered platform offers a range of features designed to make
          healthcare more accessible and efficient.
        </motion.p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<Brain className="h-8 w-8" />}
          title="AI Symptom Analysis"
          description="Our advanced AI analyzes your symptoms and provides preliminary diagnoses with high accuracy."
          delay={0.1}
        />

        <FeatureCard
          icon={<Calendar className="h-8 w-8" />}
          title="Appointment Scheduling"
          description="Easily book appointments with healthcare providers based on AI recommendations."
          delay={0.2}
        />

        <FeatureCard
          icon={<FileText className="h-8 w-8" />}
          title="Health Records"
          description="Securely store and access your medical history, test results, and treatment plans."
          delay={0.3}
        />

        <FeatureCard
          icon={<Users className="h-8 w-8" />}
          title="Doctor Consultation"
          description="Connect with qualified healthcare professionals for virtual consultations."
          delay={0.4}
        />

        <FeatureCard
          icon={<Shield className="h-8 w-8" />}
          title="Privacy Protection"
          description="Your health data is encrypted and protected with the highest security standards."
          delay={0.5}
        />

        <FeatureCard
          icon={<Clock className="h-8 w-8" />}
          title="24/7 Availability"
          description="Access healthcare guidance anytime, anywhere, without waiting for appointments."
          delay={0.6}
        />
      </div>
    </AnimatedSection>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}
function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="h-full border-0 shadow-md">
        <CardContent className="p-6">
          <div className="mb-4 w-fit rounded-full bg-blue-100 p-3 text-blue-600">
            {icon}
          </div>
          <h3 className="mb-2 text-xl font-semibold">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
