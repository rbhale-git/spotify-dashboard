import OverviewSection from "@/components/sections/OverviewSection";
import HabitsSection from "@/components/sections/HabitsSection";
import DeepCutsSection from "@/components/sections/DeepCutsSection";
import SessionsSection from "@/components/sections/SessionsSection";
import RecommendationsSection from "@/components/sections/RecommendationsSection";

export default function Home() {
  return (
    <>
      <OverviewSection />
      <div className="section-divider" />
      <HabitsSection />
      <div className="section-divider" />
      <DeepCutsSection />
      <div className="section-divider" />
      <SessionsSection />
      <div className="section-divider" />
      <RecommendationsSection />
    </>
  );
}
