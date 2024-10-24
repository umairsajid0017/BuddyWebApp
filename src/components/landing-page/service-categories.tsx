import {
  Monitor,
  PenTool,
  Smartphone,
  FileText,
  Video,
  Cpu,
  Music,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

const categories = [
  { icon: Monitor, label: "Programming & Tech" },
  { icon: PenTool, label: "Graphics & Design" },
  { icon: Smartphone, label: "Digital Marketing" },
  { icon: FileText, label: "Writing & Translation" },
  { icon: Video, label: "Video & Animation" },
  { icon: Cpu, label: "AI Services" },
  { icon: Music, label: "Music & Audio" },
  { icon: Briefcase, label: "Business" },
  { icon: HelpCircle, label: "Consulting" },
];

export function ServiceCategories() {
  return (
    <section className="">
      <div className="container">
        <div className="grid grid-cols-3 gap-4 md:grid-cols-9">
          {categories.map((category) => (
            <Card
              key={category.label}
              className="hover-radial-gradient flex cursor-pointer flex-col items-start text-start text-text-700 shadow-md"
            >
              <CardContent className="flex flex-col items-start p-4 text-start">
                <category.icon className="mb-4 h-8 w-8" />
                <span className="text-sm font-semibold">{category.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
