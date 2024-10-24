import { ServiceCategories } from "./service-categories";
import { Features } from "./features";
import { Hero } from "./hero-section";
import { PopularServices } from "./popular-services";

export default function LandingPageComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
          <ServiceCategories />
          <PopularServices />
          <Features />
        </div>
      </main>
    </div>
  );
}
