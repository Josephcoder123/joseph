import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CropInputs } from "@/utils/mlModel";
import { Loader2 } from "lucide-react";

interface InputFormProps {
  onSubmit: (inputs: CropInputs) => void;
  isLoading: boolean;
}

export const InputForm = ({ onSubmit, isLoading }: InputFormProps) => {
  const [inputs, setInputs] = useState<CropInputs>({
    temperature: 25,
    rainfall: 800,
    humidity: 65,
    ph: 6.5,
    nitrogen: 120,
    phosphorus: 50,
    potassium: 120,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const handleChange = (field: keyof CropInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental & Soil Conditions</CardTitle>
        <CardDescription>
          Enter the current or expected conditions for your crop
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={inputs.temperature}
                onChange={(e) => handleChange("temperature", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
              <Input
                id="rainfall"
                type="number"
                step="1"
                value={inputs.rainfall}
                onChange={(e) => handleChange("rainfall", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                step="1"
                min="0"
                max="100"
                value={inputs.humidity}
                onChange={(e) => handleChange("humidity", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ph">Soil pH</Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={inputs.ph}
                onChange={(e) => handleChange("ph", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nitrogen">Nitrogen (kg/ha)</Label>
              <Input
                id="nitrogen"
                type="number"
                step="1"
                value={inputs.nitrogen}
                onChange={(e) => handleChange("nitrogen", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phosphorus">Phosphorus (kg/ha)</Label>
              <Input
                id="phosphorus"
                type="number"
                step="1"
                value={inputs.phosphorus}
                onChange={(e) => handleChange("phosphorus", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="potassium">Potassium (kg/ha)</Label>
              <Input
                id="potassium"
                type="number"
                step="1"
                value={inputs.potassium}
                onChange={(e) => handleChange("potassium", e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Predict Yield
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
