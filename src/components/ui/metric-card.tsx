import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  valueClassName,
}: MetricCardProps) {
  return (
    <Card className={cn("bg-card-gradient border-border/50 shadow-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-analytics-blue">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-analytics-green" : "text-destructive"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              vs baseline
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}