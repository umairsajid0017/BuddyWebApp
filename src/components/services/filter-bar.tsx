import React from "react";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { useFilters } from '@/apis/apiCalls'
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const serviceOptions = [
  { label: "All Services", value: "" },
  { label: "Website Design", value: "website_design" },
  { label: "Full Stack Development", value: "full_stack" },
  { label: "Frontend Development", value: "frontend" },
];
import { CURRENCY } from "@/constants/constantValues";

const budgetOptions = [
  { label: "All Prices", value: "" },
  { label: `Less than ${CURRENCY}. 100`, value: "0-100" },
  { label: `${CURRENCY}. 100 - ${CURRENCY}. 500`, value: "100-500" },
  { label: `${CURRENCY}. 500+`, value: "500-plus" },
];

const deliveryTimeOptions = [
  { label: "Any Time", value: "" },
  { label: "Express 24H", value: "24" },
  { label: "Up to 3 days", value: "72" },
  { label: "Up to 7 days", value: "168" },
];

const sortOptions = [
  { label: "Best Selling", value: "best_selling" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const FilterBar: React.FC = () => {
  const { filters, setFilter, resetFilters } = useFilters();

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* <FilterDropdown
            label="Service options"
            options={serviceOptions}
            value={filters.serviceOptions}
            onChange={(value) => setFilter("serviceOptions", String(value))}
          /> */}
          <FilterDropdown
            label="Budget"
            options={budgetOptions}
            value={filters.budget}
            onChange={(value) => setFilter("budget", String(value))}
          />
          <FilterDropdown
            label="Delivery time"
            options={deliveryTimeOptions}
            value={filters.deliveryTime}
            onChange={(value) => setFilter("deliveryTime", String(value))}
          />
          <Button
            variant="outline"
            onClick={resetFilters}
            className="text-gray-500"
          >
            Clear filters
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <FilterDropdown
            label={
              sortOptions.find((opt) => opt.value === filters.sortBy)?.label ||
              "Best Selling"
            }
            options={sortOptions}
            value={filters.sortBy}
            onChange={(value) => setFilter("sortBy", String(value))}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
