"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFAQs } from "@/lib/api/faqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const FAQSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    ))}
  </div>
);

export function FAQComponent() {
  const { data: faqResponse, isLoading } = useFAQs();

  const categories = React.useMemo(() => {
    if (!faqResponse?.records) return [];
    return Array.from(
      new Set(faqResponse.records.map((faq) => faq.category)),
    ).sort();
  }, [faqResponse?.records]);

  if (isLoading) return <FAQSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <HelpCircle className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex w-full justify-start px-4 md:px-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="flex-shrink-0"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>

        <div className="mt-6">
          {categories.map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="rounded-lg border bg-card p-4 md:p-6"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{category}</h3>
                <p className="text-sm text-muted-foreground">
                  Frequently asked questions about {category.toLowerCase()}
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {faqResponse?.records
                  .filter((faq) => faq.category === category)
                  .map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id.toString()}
                      className="border-b last:border-0"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-start gap-2">
                          <span className="text-base font-medium">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <div className="prose prose-sm max-w-none">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
