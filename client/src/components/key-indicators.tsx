import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useKeyIndicators, useLoadCSV } from "@/hooks/use-traffic-data";
import { Loader2, RefreshCw, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CSVUpload from "./csv-upload";

export default function KeyIndicators() {
  const { data: indicators, isLoading, error } = useKeyIndicators();
  const loadCSVMutation = useLoadCSV();
  const hasAttemptedAutoLoad = useRef(false);
  const [showUpload, setShowUpload] = useState(false);

  // Auto-load CSV data on mount if no data exists (one-shot with guards)
  useEffect(() => {
    // Guard against multiple attempts
    if (hasAttemptedAutoLoad.current) return;

    // Don't auto-load if still loading, mutation pending, or there's an error
    if (isLoading || loadCSVMutation.isPending || error) return;

    // Only auto-load if indicators are truly missing or empty
    if (!indicators || (indicators.totalAccidents === 0 && indicators.totalFatalities === 0)) {
      hasAttemptedAutoLoad.current = true;
      loadCSVMutation.mutate();
    }
  }, [isLoading, indicators, error, loadCSVMutation.isPending]);

  const handleLoadData = () => {
    loadCSVMutation.mutate();
  };

  if (isLoading) {
    return (
      <section id="indicators" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading traffic data...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="indicators" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load traffic indicators</p>
            <Button onClick={handleLoadData} disabled={loadCSVMutation.isPending}>
              {loadCSVMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Retry Loading Data
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Color mapping for proper Tailwind generation
  const colorMap = {
    accent: {
      border: "border-accent/20 hover:border-accent/40",
      bg: "bg-accent/20",
      text: "text-accent"
    },
    primary: {
      border: "border-primary/20 hover:border-primary/40",
      bg: "bg-primary/20",
      text: "text-primary"
    },
    secondary: {
      border: "border-secondary/20 hover:border-secondary/40",
      bg: "bg-secondary/20",
      text: "text-secondary"
    }
  };

  const indicatorCards = [
    {
      icon: "🚨",
      title: "Total Accidents",
      value: indicators?.totalAccidents?.toLocaleString() || "0",
      description: "Reported incidents across all locations and timeframes",
      color: "accent" as keyof typeof colorMap,
    },
    {
      icon: "☠️",
      title: "Total Fatalities",
      value: indicators?.totalFatalities?.toLocaleString() || "0",
      description: "Lives lost due to traffic incidents",
      color: "primary" as keyof typeof colorMap,
    },
    {
      icon: "🚦",
      title: "Avg Congestion Score",
      value: indicators?.avgCongestion?.toFixed(2) || "0.00",
      description: "Normalized congestion level (0-1 scale)",
      color: "secondary" as keyof typeof colorMap,
    },
  ];

  return (
    <section id="indicators" className="py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-modern" data-testid="indicators-title">Key Indicators</h2>
            <p className="text-xl text-gray-300 mb-8" data-testid="indicators-description">
              Critical traffic statistics computed from comprehensive data analysis
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="btn-glass-primary px-6 py-3 rounded-xl font-semibold"
                data-testid="button-toggle-upload"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload CSV File
              </button>

              <button
                onClick={handleLoadData}
                disabled={loadCSVMutation.isPending}
                className="btn-glass-secondary px-6 py-3 rounded-xl font-semibold"
                data-testid="button-load-data"
              >
                {loadCSVMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Load Sample Data
                  </>
                )}
              </button>
            </div>

            {/* CSV Upload Component */}
            {showUpload && (
              <div className="mt-8 fade-in-up">
                <CSVUpload />
              </div>
            )}

            {/* Status Messages */}
            {loadCSVMutation.isError && (
              <div className="mt-4 p-4 glass-card border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm font-medium">
                  ❌ Failed to load CSV: {loadCSVMutation.error instanceof Error ? loadCSVMutation.error.message : "Unknown error"}
                </p>
              </div>
            )}

            {loadCSVMutation.isSuccess && !loadCSVMutation.isPending && (
              <div className="mt-4 p-4 glass-card border border-green-500/30 rounded-xl">
                <p className="text-green-400 text-sm font-medium">
                  ✅ CSV data loaded successfully! Data has been refreshed.
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {indicatorCards.map((card, index) => (
              <div
                key={index}
                className="card-modern p-8 rounded-2xl min-h-[280px] flex flex-col justify-center group fade-in-up"
                style={{animationDelay: `${index * 0.2}s`}}
                data-testid={`indicator-card-${index}`}
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">{card.icon}</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-gradient-modern transition-colors duration-300" data-testid={`indicator-value-${index}`}>
                    {card.value}
                  </h3>
                  <p className="text-lg font-semibold mb-4 text-gray-300" data-testid={`indicator-title-${index}`}>
                    {card.title}
                  </p>
                  <p className="text-gray-400 leading-relaxed text-sm" data-testid={`indicator-description-${index}`}>
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}