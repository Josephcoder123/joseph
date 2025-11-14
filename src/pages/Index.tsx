import { useState } from "react";
import { CropSelector } from "@/components/CropSelector";
import { InputForm } from "@/components/InputForm";
import { PredictionResult } from "@/components/PredictionResult";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crop } from "@/data/cropsData";
import { CropInputs, PredictionResult as PredictionResultType, cropYieldModel } from "@/utils/mlModel";
import { Sprout, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrediction = async (inputs: CropInputs) => {
    if (!selectedCrop) {
      toast.error("Please select a crop first");
      return;
    }

    setIsLoading(true);
    try {
      const result = await cropYieldModel.predict(selectedCrop.id, inputs);
      setPredictionResult(result);
      toast.success("Yield prediction completed!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Failed to generate prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              AI Crop Yield Predictor
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Supporting SDG 2: Zero Hunger through AI-powered agricultural insights
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Predict yields for 30+ crops using machine learning and agricultural data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sprout className="h-4 w-4 text-primary" />
                Supported Crops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">33</p>
              <p className="text-xs text-muted-foreground mt-1">Across 6 categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-secondary" />
                Prediction Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">7</p>
              <p className="text-xs text-muted-foreground mt-1">Environmental & soil parameters</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                ML-Powered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">TensorFlow.js</p>
              <p className="text-xs text-muted-foreground mt-1">Neural network predictions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Select a Crop</CardTitle>
                <CardDescription>
                  Choose from 33 different crops across multiple categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CropSelector selectedCrop={selectedCrop} onSelectCrop={setSelectedCrop} />
              </CardContent>
            </Card>

            {selectedCrop && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedCrop.icon}</span>
                  <div>
                    <p className="font-semibold text-lg">Selected: {selectedCrop.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedCrop.category}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {selectedCrop ? (
              <>
                <InputForm onSubmit={handlePrediction} isLoading={isLoading} />
                
                {predictionResult && (
                  <PredictionResult result={predictionResult} cropName={selectedCrop.name} />
                )}
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Sprout className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-center">
                    Select a crop from the left panel to start predicting yield
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-muted/30">
            <CardContent className="py-6">
              <h3 className="font-semibold mb-2">About This Tool</h3>
              <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
                This AI-powered tool uses TensorFlow.js and agricultural research data to predict crop yields
                based on environmental and soil conditions. It supports the UN's Sustainable Development Goal 2
                (Zero Hunger) by helping farmers make data-driven decisions to optimize their harvests.
                The model considers temperature, rainfall, humidity, soil pH, and nutrient levels (NPK) to
                provide accurate predictions and actionable recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
