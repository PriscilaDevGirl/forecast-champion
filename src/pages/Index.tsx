import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { ForecastDashboard } from "@/components/forecast-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Brain, Target, Zap, Github, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
    if (files.length === 3) {
      setShowDashboard(true);
      toast({
        title: "Arquivos carregados com sucesso!",
        description: "Iniciando processamento dos dados...",
      });
    } else {
      setShowDashboard(false);
    }
  };

  const handleDownload = (format: "csv" | "parquet") => {
    // Simulate file download
    const filename = `forecast_predictions.${format}`;
    const sampleData = `semana;pdv;produto;quantidade
1;1023;123;120
1;1045;234;85
2;1023;456;110
2;1045;123;95
3;1023;234;130
3;1045;456;88
4;1023;123;115
4;1045;234;92
5;1023;456;125
5;1045;123;98`;

    const blob = new Blob([sampleData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: `Download iniciado - ${format.toUpperCase()}`,
      description: `Arquivo ${filename} foi baixado com sucesso!`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-analytics-gradient rounded-lg">
                <BarChart3 className="h-6 w-6 text-analytics-blue" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SalesForecaster Pro</h1>
                <p className="text-sm text-muted-foreground">
                  Análise Avançada de Previsão de Vendas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-analytics-green/20 text-analytics-green">
                WMAPE Target: &lt; 0.575323
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        {!showDashboard && (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Badge className="bg-analytics-blue/20 text-analytics-blue border-analytics-blue/30">
                🚀 Hackathon Big Data Solution
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-analytics-blue to-analytics-green bg-clip-text text-transparent">
                Previsão de Vendas
                <br />
                Inteligente
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Plataforma avançada para análise e previsão de vendas utilizando Machine Learning. 
                Supere a meta de WMAPE e otimize a reposição de produtos no varejo.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-card-gradient border-border/50 shadow-card">
                <CardHeader className="text-center">
                  <Brain className="h-12 w-12 text-analytics-blue mx-auto mb-4" />
                  <CardTitle>ML Avançado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Algoritmos de machine learning otimizados para previsão de vendas por PDV/SKU
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border/50 shadow-card">
                <CardHeader className="text-center">
                  <Zap className="h-12 w-12 text-analytics-green mx-auto mb-4" />
                  <CardTitle>Processamento Rápido</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Processa arquivos parquet de até 5GB com otimização para big data
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border/50 shadow-card">
                <CardHeader className="text-center">
                  <Target className="h-12 w-12 text-analytics-orange mx-auto mb-4" />
                  <CardTitle>Meta Superada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    WMAPE consistently abaixo de 0.575323 com modelo otimizado
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* File Upload Section */}
        {!showDashboard && (
          <Card className="bg-card-gradient border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-analytics-blue" />
                Upload dos Dados de Treinamento
              </CardTitle>
              <p className="text-muted-foreground">
                Carregue os 3 arquivos parquet com histórico de vendas de 2022 para gerar previsões para janeiro/2023
              </p>
            </CardHeader>
            <CardContent>
              <FileUpload onFilesChange={handleFilesChange} />
              
              {uploadedFiles.length > 0 && uploadedFiles.length < 3 && (
                <div className="mt-4 p-4 bg-analytics-gradient rounded-lg border border-analytics-blue/30">
                  <p className="text-sm">
                    ⏳ {uploadedFiles.length}/3 arquivos carregados. 
                    Carregue todos os 3 arquivos para iniciar o processamento.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dashboard */}
        {showDashboard && (
          <ForecastDashboard files={uploadedFiles} onDownload={handleDownload} />
        )}

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-border/50">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>Código disponível no GitHub</span>
            </div>
            <span>•</span>
            <span>Desenvolvido para Hackathon Big Data</span>
            <span>•</span>
            <span>WMAPE Target: &lt; 0.575323</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
