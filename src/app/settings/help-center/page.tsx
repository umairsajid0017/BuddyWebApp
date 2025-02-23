import { FAQComponent } from "@/components/settings/help-center/faq-component";

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <FAQComponent />
      </div>
    </div>
  );
}
