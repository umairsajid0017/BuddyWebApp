import { ServiceCategories } from "./service-categories";
import { Features } from "./features";
import { Hero } from "./hero-section";
import { PopularServices } from "./popular-services";
import { BenefitsSection } from "./sections/benefits-section";
import { PathToSuccess } from "./sections/path-to-success";
import { StatsSection } from "./sections/stats-section";
import { DownloadSection } from "./sections/download-section";
import { QuickStartSection } from "./sections/quick-start-section";
import { Footer } from "./sections/footer-section";

export default function LandingPageComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <div className="max-w-8xl container mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
          <Hero />
          <ServiceCategories />
          <PopularServices />
          <Features />
          <BenefitsSection />
          <PathToSuccess />
          <QuickStartSection />
          <StatsSection />
          <DownloadSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
