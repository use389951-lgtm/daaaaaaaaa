import { Card, CardContent } from "@/components/ui/card";

export default function AboutSection() {
  const objectives = [
    { icon: "🚦", title: "Predict Congestion", color: "primary" },
    { icon: "🚨", title: "Identify Hotspots", color: "secondary" },
    { icon: "📊", title: "Interactive Dashboard", color: "accent" },
    { icon: "🏙", title: "Data-driven Planning", color: "primary" },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-modern" data-testid="about-title">About the Project</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed" data-testid="about-description">
              The rapid growth of Visakhapatnam has led to increasing numbers of vehicles on the road, creating frequent congestion, delays, and a rise in accidents. Traditional traffic control systems are reactive rather than predictive, making it difficult for commuters and city planners to take timely measures.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 fade-in-up fade-in-up-delay-1">
              <div className="card-modern p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-gradient-modern" data-testid="project-vision-title">Project Vision</h3>
                <p className="text-gray-300 leading-relaxed" data-testid="project-vision-description">
                  This project leverages Python-based data processing, statistical analysis, visualizations, and machine learning models to generate actionable insights. By consolidating these elements into a single interactive dashboard, the system aims to support data-driven decisions, improve traffic management efficiency, and ultimately reduce congestion and accident risks.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {objectives.map((objective, index) => (
                  <div
                    key={index}
                    className="card-modern p-6 rounded-xl group cursor-pointer"
                    data-testid={`objective-card-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{objective.icon}</span>
                      <span className="font-semibold text-white group-hover:text-gradient-modern transition-colors">{objective.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative fade-in-up fade-in-up-delay-2">
              <div className="card-modern p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10"></div>
                <div className="relative z-10">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="h-16 bg-blue-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <div className="w-8 h-8 bg-blue-500/30 rounded-full animate-pulse"></div>
                    </div>
                    <div className="h-16 bg-purple-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <div className="w-8 h-8 bg-purple-500/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    </div>
                    <div className="h-16 bg-teal-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <div className="w-8 h-8 bg-teal-500/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-2 text-white" data-testid="analytics-title">Smart Traffic Analytics</h4>
                    <p className="text-gray-300" data-testid="analytics-description">Real-time data processing and predictive modeling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
