import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface NoBidsViewProps {
  tabLabel: string;
}

export const NoBidsView: React.FC<NoBidsViewProps> = ({ tabLabel }) => (
  <Card className="border-destructive/20 shadow-md">
    <CardContent className="flex flex-col items-center justify-center px-6 pb-4 pt-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-destructive">
        No {tabLabel} Bids Found
      </h3>
      <p className="max-w-md text-center text-muted-foreground">
        You don&apos;t have any {tabLabel.toLowerCase()} bids at the moment.
      </p>
    </CardContent>
  </Card>
); 