import { PredictionResult as PredictionResultType } from "@/utils/mlModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { TrendingUp, Droplets, Thermometer, Beaker, Lightbulb } from "lucide-react";

interface PredictionResultProps {
  result: PredictionResultType;
  cropName: string;
}

export const PredictionResult = ({ result, cropName }: PredictionResultProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-success";
    if (confidence >= 0.6) return "text-secondary";
    return "text-destructive";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.6) return "Medium";
    return "Low";
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Predicted Yield for {cropName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-bold text-primary">
                {result.yieldPerHectare} tons/ha
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <Badge variant="outline" className={getConfidenceColor(result.confidence)}>
                  {getConfidenceLabel(result.confidence)} ({Math.round(result.confidence * 100)}%)
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Factor Analysis</CardTitle>
          <CardDescription>How each factor affects the yield prediction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-chart-1" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round(result.factors.temperature * 100)}%
              </span>
            </div>
            <Progress value={result.factors.temperature * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-chart-2" />
                <span className="text-sm font-medium">Rainfall</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round(result.factors.rainfall * 100)}%
              </span>
            </div>
            <Progress value={result.factors.rainfall * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Beaker className="h-4 w-4 text-chart-3" />
                <span className="text-sm font-medium">Soil Quality (pH)</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round(result.factors.soilQuality * 100)}%
              </span>
            </div>
            <Progress value={result.factors.soilQuality * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-4" />
                <span className="text-sm font-medium">Nutrients (NPK)</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round(result.factors.nutrients * 100)}%
              </span>
            </div>
            <Progress value={result.factors.nutrients * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-secondary" />
            Recommendations
          </CardTitle>
          <CardDescription>Actions to improve yield potential</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
