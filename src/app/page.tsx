import OverviewSection from "@/components/sections/OverviewSection";
import HabitsSection from "@/components/sections/HabitsSection";
import DeepCutsSection from "@/components/sections/DeepCutsSection";
import SessionsSection from "@/components/sections/SessionsSection";
import RecommendationsSection from "@/components/sections/RecommendationsSection";
import StreaksSection from "@/components/sections/StreaksSection";
import ArtistJourneysSection from "@/components/sections/ArtistJourneysSection";

import RepeatExploreSection from "@/components/sections/RepeatExploreSection";
import BingeScoreSection from "@/components/sections/BingeScoreSection";

export default function Home() {
  return (
    <>
      <OverviewSection />
      <div className="section-divider" />
      <HabitsSection />
      <div className="section-divider" />
      <ArtistJourneysSection />
      <div className="section-divider" />
      <DeepCutsSection />
      <div className="section-divider" />
      <SessionsSection />
      <div className="section-divider" />
      <StreaksSection />
      <div className="section-divider" />
      <RecommendationsSection />
      <div className="section-divider" />
      <RepeatExploreSection />
      <div className="section-divider" />
      <BingeScoreSection />
    </>
  );
}
