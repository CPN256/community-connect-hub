import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EmergencyHero from "@/components/emergency/EmergencyHero";
import EmergencyContacts from "@/components/emergency/EmergencyContacts";
import EmergencyTypes from "@/components/emergency/EmergencyTypes";
import WhatToDoSection from "@/components/emergency/WhatToDoSection";
import SafeLocations from "@/components/emergency/SafeLocations";
import FirstAidGuide from "@/components/emergency/FirstAidGuide";
import SafetyTips from "@/components/emergency/SafetyTips";

const EmergencyPage = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <EmergencyHero selectedType={selectedType} />
        <EmergencyContacts />
        <EmergencyTypes selectedType={selectedType} onSelect={setSelectedType} />
        <WhatToDoSection />
        <SafeLocations />
        <FirstAidGuide />
        <SafetyTips />
      </div>
      <Footer />
    </div>
  );
};

export default EmergencyPage;
