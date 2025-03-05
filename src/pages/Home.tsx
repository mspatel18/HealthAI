import { TransformSection } from "@/components/home/TransformSection";
import { Hero1 } from "@/components/home/Hero1";
import { Navbar } from "@/components/home/Navbar";
import { useNavigate } from "react-router";
import { useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Features } from "@/components/home/Features";
import { Faq } from "@/components/home/Faq";
import { Footer } from "@/components/home/Footer";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturePreview } from "@/components/home/FeaturePreview";
export const Home = () => {
  // const { user } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(user);

    if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, navigate]);
  return (
    <>
      <Navbar />
      <main className="bg-primary-background flex flex-col items-center justify-center">
        <Hero1 />
        <TransformSection />
        <FeaturePreview />
        <Features />
        <HowItWorks />
        <Faq />
        <Footer />
      </main>
    </>
  );
};
