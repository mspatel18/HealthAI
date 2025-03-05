import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";

import { AnimatedSection } from "./AnimatedSection";
export const TransformSection = () => {
  return (
    <>
      <AnimatedSection
        id="get-started"
        className="container bg-white px-6 py-6"
      >
        {/* <div className=""> */}
        <h1 className="text-primary-background mt-16 mb-6 text-4xl font-bold lg:text-6xl">
          Transform Your{" "}
          <span className="from-primary to-destructive bg-gradient-to-r bg-clip-text text-transparent">
            Health
          </span>{" "}
          with AI
        </h1>
        <p className="text-secondary-background text-md mb-8 md:text-xl">
          Get instant preliminary diagnoses, book appointments, and manage your
          health journey - all in one place. Powered by advanced AI technology
          for accurate and reliable healthcare guidance.
        </p>
        <div className="mb-8 flex w-full flex-wrap gap-4">
          <NavLink to="/register">
            <Button variant="default" size="cta">
              Sign Up
            </Button>
          </NavLink>
          <NavLink to="/login">
            <Button variant="outline" size="cta">
              Login
            </Button>
          </NavLink>
        </div>
      </AnimatedSection>

      {/* </div> */}
    </>
  );
};
