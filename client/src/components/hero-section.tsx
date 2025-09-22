import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center gradient-bg">
      <div className="particles"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight" data-testid="hero-title">
              <span className="text-gradient-modern text-glow">Vizag</span>
              <br />
              <span className="text-white">Traffic</span>
              <span className="text-gradient-modern text-glow">Pulse</span>
            </h1>
          </div>
          
          <div className="fade-in-up fade-in-up-delay-1">
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed font-light" data-testid="hero-subtitle">
              Predictive Dashboard for Urban Congestion
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed" data-testid="hero-description">
              Leveraging machine learning and data analytics to analyze traffic patterns, predict congestion, and support data-driven urban planning decisions in Visakhapatnam.
            </p>
          </div>
          
          <div className="fade-in-up fade-in-up-delay-2">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
              <button
                onClick={() => scrollToSection("results")}
                className="btn-glass-primary px-8 py-4 rounded-2xl font-semibold text-lg min-w-[200px] text-white"
                data-testid="button-view-results"
              >
                <span className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  View Results
                </span>
              </button>
              
              <button
                onClick={() => scrollToSection("about")}
                className="btn-glass-secondary px-8 py-4 rounded-2xl font-semibold text-lg min-w-[200px] text-white"
                data-testid="button-learn-more"
              >
                <span className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Learn More
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
