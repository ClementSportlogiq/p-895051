
import React from "react";
import SoccerLayout from "@/components/soccer/Layout";
import { SoccerProvider } from "@/context/SoccerContext";

const Index = () => {
  return (
    <SoccerProvider>
      <SoccerLayout />
    </SoccerProvider>
  );
};

export default Index;
