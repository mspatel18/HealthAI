import { AnimatedSection } from "./AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, CircleCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const FeaturePreview = () => {
  return (
    <AnimatedSection
      id="features-preview"
      className="container mx-auto px-6 py-16"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <motion.div
                  className="flex items-start gap-4 rounded-lg bg-blue-50 p-4"
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="rounded-full bg-blue-600 p-2 text-white"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Brain className="h-5 w-5" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">AI Diagnosis</h3>
                    <p className="text-sm text-gray-500">
                      Processing symptoms...
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                      <motion.div
                        className="h-full rounded-full bg-blue-600"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "75%" }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.5,
                          duration: 1.5,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 rounded-lg p-4"
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="rounded-full bg-blue-600 p-2 text-white"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Clock className="h-5 w-5" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">Quick Diagnosis</h3>
                    <p className="text-gray-500">
                      Get preliminary results in minutes, not days
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 rounded-lg p-4"
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className="rounded-full bg-blue-600 p-2 text-white"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <CircleCheck className="h-5 w-5" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">Accurate Results</h3>
                    <p className="text-gray-500">
                      Powered by advanced machine learning algorithms
                    </p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};
