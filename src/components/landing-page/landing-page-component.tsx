import { ServiceCategories } from "./service-categories";
import { Features } from "./features";
import { Hero } from "./hero-section";
import { PopularServices } from "./popular-services";
import { BenefitsSection } from "./sections/benefits-section";
import { PathToSuccess } from "./sections/path-to-success";
import { StatsSection } from "./sections/stats-section";
import { DownloadSection } from "./sections/download-section";
import { QuickStartSection } from "./sections/quick-start-section";

export default function LandingPageComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
          <ServiceCategories />
          <PopularServices />
          <Features />
          <BenefitsSection />
          <PathToSuccess />
          <QuickStartSection />
        </div>
        {/* <StatsSection />   */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DownloadSection />
        </div>
      </main>
    </div>
  );
}
