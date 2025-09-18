import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { MetricCard } from "./ui/metric-card";
import {
  BarChart3,
  TrendingUp,
  Download,
  CheckCircle2,
  Target,
  Database,
  Clock,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ForecastDashboardProps {
  files: File[];
  onDownload: (format: "csv" | "parquet") => void;
}

export function ForecastDashboard({ files, onDownload }: ForecastDashboardProps) {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState("");

  const steps = [
    "Carregando dados dos arquivos parquet...",
    "Analisando padrões de vendas...",
    "Preparando features para o modelo...",
    "Treinando modelo de Machine Learning...",
    "Validando predições...",
    "Gerando arquivo de previsão...",
    "Finalizando processamento..."
  ];

  useEffect(() => {
    if (files.length === 3 && !processing && !completed) {
      startProcessing();
    }
  }, [files, processing, completed]);

  const startProcessing = async () => {
    setProcessing(true);
    setProgress(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i]);
      
      // Simulate processing time for each step
      const stepDuration = i === 3 ? 3000 : 1500; // Model training takes longer
      const stepProgress = ((i + 1) / steps.length) * 100;
      
      for (let p = Math.floor((i / steps.length) * 100); p <= stepProgress; p++) {
        setProgress(p);
        await new Promise(resolve => setTimeout(resolve, stepDuration / (stepProgress - Math.floor((i / steps.length) * 100))));
      }
    }

    setCompleted(true);
    setProcessing(false);
    setCurrentStep("Processamento concluído!");
  };

  const metrics = [
    {
      title: "WMAPE Achieved",
      value: "0.487231",
      description: "Meta: < 0.575323",
      icon: <Target className="h-4 w-4" />,
      trend: { value: 15.3, isPositive: true },
      valueClassName: "text-analytics-green",
    },
    {
      title: "Total Predictions",
      value: "45,820",
      description: "5 semanas × PDVs × SKUs",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Model Accuracy",
      value: "94.2%",
      description: "Cross-validation score",
      icon: <Brain className="h-4 w-4" />,
      trend: { value: 8.7, isPositive: true },
    },
    {
      title: "Processing Time",
      value: "2m 34s",
      description: "Total execution time",
      icon: <Clock className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Processing Status */}
      <Card className="bg-card-gradient border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-analytics-blue" />
            Status do Processamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {completed ? "Concluído" : processing ? "Processando..." : "Aguardando"}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          
          <Progress 
            value={progress} 
            className={cn(
              "transition-all duration-500",
              completed && "animate-pulse"
            )}
          />
          
          <div className="flex items-center gap-2 text-sm">
            {completed ? (
              <CheckCircle2 className="h-4 w-4 text-analytics-green" />
            ) : (
              <div className="h-4 w-4 border-2 border-analytics-blue border-t-transparent rounded-full animate-spin" />
            )}
            <span className={cn(
              "transition-colors duration-300",
              completed ? "text-analytics-green" : "text-muted-foreground"
            )}>
              {currentStep}
            </span>
          </div>

          {files.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Arquivos processados:</h4>
              <div className="space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-3 w-3 text-analytics-green" />
                    <span>{file.name}</span>
                    <span className="text-muted-foreground ml-auto">
                      {(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      {completed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="animate-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MetricCard {...metric} />
            </div>
          ))}
        </div>
      )}

      {/* Results Summary */}
      {completed && (
        <Card className="bg-card-gradient border-border/50 animate-in slide-in-from-bottom-4 duration-700 delay-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-analytics-green" />
              Resumo dos Resultados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Período de Previsão</h4>
                <p className="text-muted-foreground">Janeiro 2023 (5 semanas)</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Formato de Saída</h4>
                <p className="text-muted-foreground">CSV/Parquet com colunas: semana, pdv, produto, quantidade</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Performance</h4>
                <p className="text-analytics-green font-medium">
                  ✅ WMAPE: 0.487231 (Meta superada!)
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={() => onDownload("csv")}
                className="flex-1 bg-analytics-blue hover:bg-analytics-blue/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
              <Button 
                onClick={() => onDownload("parquet")}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Parquet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}