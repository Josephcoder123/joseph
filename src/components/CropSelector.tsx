import { crops, cropCategories, Crop } from "@/data/cropsData";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Search } from "lucide-react";

interface CropSelectorProps {
  selectedCrop: Crop | null;
  onSelectCrop: (crop: Crop) => void;
}

export const CropSelector = ({ selectedCrop, onSelectCrop }: CropSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search crops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {cropCategories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
        {filteredCrops.map((crop) => (
          <Card
            key={crop.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedCrop?.id === crop.id
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onSelectCrop(crop)}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <span className="text-3xl">{crop.icon}</span>
              <p className="font-medium text-sm">{crop.name}</p>
              <p className="text-xs text-muted-foreground">{crop.category}</p>
            </div>
          </Card>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No crops found matching your search.
        </p>
      )}
    </div>
  );
};
