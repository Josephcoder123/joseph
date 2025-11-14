import * as tf from '@tensorflow/tfjs';

export interface CropInputs {
  temperature: number; // Celsius
  rainfall: number; // mm
  humidity: number; // %
  ph: number; // soil pH
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
}

export interface PredictionResult {
  yieldPerHectare: number; // tons/ha
  confidence: number; // 0-1
  factors: {
    temperature: number;
    rainfall: number;
    soilQuality: number;
    nutrients: number;
  };
  recommendations: string[];
}

// Simulated ML model using TensorFlow.js
// In a real implementation, this would load a pre-trained model
export class CropYieldModel {
  private model: tf.Sequential | null = null;

  async initialize() {
    // Create a simple neural network model
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [7], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' }),
      ],
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae'],
    });
  }

  // Normalize inputs for the model
  private normalizeInputs(inputs: CropInputs): number[] {
    return [
      inputs.temperature / 40, // normalize to 0-1 (assuming max 40°C)
      inputs.rainfall / 3000, // normalize to 0-1 (assuming max 3000mm)
      inputs.humidity / 100, // already 0-1
      inputs.ph / 14, // normalize to 0-1
      inputs.nitrogen / 300, // normalize to 0-1 (assuming max 300 kg/ha)
      inputs.phosphorus / 150, // normalize to 0-1 (assuming max 150 kg/ha)
      inputs.potassium / 300, // normalize to 0-1 (assuming max 300 kg/ha)
    ];
  }

  async predict(cropId: string, inputs: CropInputs): Promise<PredictionResult> {
    if (!this.model) {
      await this.initialize();
    }

    // Normalize inputs
    const normalizedInputs = this.normalizeInputs(inputs);
    
    // Create tensor from inputs
    const inputTensor = tf.tensor2d([normalizedInputs]);
    
    // Make prediction
    const prediction = this.model!.predict(inputTensor) as tf.Tensor;
    const yieldValue = await prediction.data();
    
    // Calculate base yield using crop-specific algorithms
    const baseYield = this.calculateBaseYield(cropId, inputs);
    
    // Combine ML prediction with domain knowledge
    const finalYield = Math.max(0, baseYield * (1 + (yieldValue[0] - 0.5)));
    
    // Calculate confidence based on input optimality
    const confidence = this.calculateConfidence(inputs);
    
    // Calculate factor scores
    const factors = this.calculateFactors(inputs);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, factors);
    
    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();
    
    return {
      yieldPerHectare: Math.round(finalYield * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      factors,
      recommendations,
    };
  }

  private calculateBaseYield(cropId: string, inputs: CropInputs): number {
    // Crop-specific yield calculations based on agricultural research data
    const cropYields: Record<string, number> = {
      wheat: 4.5, rice: 5.2, corn: 7.8, barley: 4.0, sorghum: 3.5,
      oats: 3.8, millet: 2.5, potato: 25.0, sweet_potato: 18.0,
      cassava: 20.0, carrot: 35.0, soybean: 3.2, peanut: 2.8,
      chickpea: 2.0, lentil: 1.8, pea: 2.5, tomato: 45.0,
      onion: 30.0, cabbage: 40.0, lettuce: 25.0, spinach: 15.0,
      broccoli: 12.0, cauliflower: 15.0, pepper: 20.0,
      cotton: 2.5, sugarcane: 70.0, coffee: 1.5, tea: 2.0,
      tobacco: 2.0, apple: 25.0, banana: 30.0, grape: 15.0,
      orange: 20.0,
    };

    const baseYield = cropYields[cropId] || 5.0;
    
    // Apply environmental factors
    let multiplier = 1.0;
    
    // Temperature optimization (optimal range varies by crop)
    const tempDiff = Math.abs(inputs.temperature - 25);
    multiplier *= Math.max(0.3, 1 - (tempDiff / 30));
    
    // Rainfall optimization
    const rainfallFactor = Math.min(inputs.rainfall / 800, 1.5);
    multiplier *= rainfallFactor;
    
    // Soil pH optimization (most crops prefer 6-7)
    const phDiff = Math.abs(inputs.ph - 6.5);
    multiplier *= Math.max(0.5, 1 - (phDiff / 5));
    
    // Nutrient availability
    const nutrientScore = (inputs.nitrogen + inputs.phosphorus + inputs.potassium) / 450;
    multiplier *= Math.min(nutrientScore, 1.5);
    
    return baseYield * multiplier;
  }

  private calculateConfidence(inputs: CropInputs): number {
    let score = 1.0;
    
    // Check if inputs are in optimal ranges
    if (inputs.temperature < 10 || inputs.temperature > 35) score -= 0.2;
    if (inputs.rainfall < 300 || inputs.rainfall > 2000) score -= 0.15;
    if (inputs.humidity < 40 || inputs.humidity > 90) score -= 0.1;
    if (inputs.ph < 5.5 || inputs.ph > 7.5) score -= 0.15;
    if (inputs.nitrogen < 50 || inputs.nitrogen > 250) score -= 0.1;
    if (inputs.phosphorus < 20 || inputs.phosphorus > 100) score -= 0.1;
    if (inputs.potassium < 50 || inputs.potassium > 250) score -= 0.1;
    
    return Math.max(0.3, Math.min(1.0, score));
  }

  private calculateFactors(inputs: CropInputs): PredictionResult['factors'] {
    return {
      temperature: Math.min(1, Math.max(0, 1 - Math.abs(inputs.temperature - 25) / 25)),
      rainfall: Math.min(1, inputs.rainfall / 1000),
      soilQuality: Math.min(1, Math.max(0, 1 - Math.abs(inputs.ph - 6.5) / 3)),
      nutrients: Math.min(1, (inputs.nitrogen + inputs.phosphorus + inputs.potassium) / 600),
    };
  }

  private generateRecommendations(inputs: CropInputs, factors: PredictionResult['factors']): string[] {
    const recommendations: string[] = [];
    
    if (factors.temperature < 0.6) {
      if (inputs.temperature < 20) {
        recommendations.push("Consider using greenhouse or mulching to increase soil temperature");
      } else {
        recommendations.push("Provide shade or irrigation during hot periods to reduce heat stress");
      }
    }
    
    if (factors.rainfall < 0.6) {
      recommendations.push("Implement drip irrigation or rainwater harvesting to supplement rainfall");
    }
    
    if (factors.soilQuality < 0.6) {
      if (inputs.ph < 6.0) {
        recommendations.push("Add lime to increase soil pH to optimal range (6.0-7.0)");
      } else if (inputs.ph > 7.5) {
        recommendations.push("Add sulfur or organic matter to lower soil pH");
      }
    }
    
    if (factors.nutrients < 0.6) {
      if (inputs.nitrogen < 80) {
        recommendations.push("Apply nitrogen-rich fertilizers or plant nitrogen-fixing cover crops");
      }
      if (inputs.phosphorus < 30) {
        recommendations.push("Add phosphorus fertilizers to improve root development");
      }
      if (inputs.potassium < 80) {
        recommendations.push("Apply potassium fertilizers to enhance disease resistance");
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Conditions are optimal! Maintain current practices and monitor regularly");
    }
    
    return recommendations;
  }
}

export const cropYieldModel = new CropYieldModel();
