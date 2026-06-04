import { useState } from "react";
import { 
  Check, 
  X, 
  Zap, 
  ShieldCheck, 
  Crown
} from "lucide-react";

export default function PricingView({ premiumTier, setPremiumTier }) {
  const [loadingTier, setLoadingTier] = useState(null);

  const handleSelectTier = (tier) => {
    setLoadingTier(tier);
    // Simulate payment processing loader
    setTimeout(() => {
      setPremiumTier(tier);
      setLoadingTier(null);
    }, 1000);
  };

  const tiers = [
    {
      id: "free",
      name: "Free Access",
      price: "$0",
      description: "Basic race forecasting and historical standings lookup.",
      features: [
        { text: "Predictor Sim (Standard Laps)", enabled: true },
        { text: "Sunny & Cloudy Weather Variables", enabled: true },
        { text: "2024 & 2025 Championship Tables", enabled: true },
        { text: "Telemetry Pro Workspace", enabled: false },
        { text: "Rain Strategy & Safety Car Toggles", enabled: false },
        { text: "Raw CSV Telemetry Exports", enabled: false },
        { text: "Unlimited Monte Carlo simulations", enabled: false }
      ]
    },
    {
      id: "pro",
      name: "Pro Analyst",
      price: "$19",
      description: "Advanced side-by-side telemetry overlays and wet weather mapping.",
      recommended: true,
      features: [
        { text: "Predictor Sim (Standard Laps)", enabled: true },
        { text: "Sunny & Cloudy Weather Variables", enabled: true },
        { text: "2024 & 2025 Championship Tables", enabled: true },
        { text: "Telemetry Pro Workspace (UNLOCKED)", enabled: true },
        { text: "Rain Strategy & Safety Car Toggles", enabled: true },
        { text: "Raw CSV Telemetry Exports", enabled: false },
        { text: "Unlimited Monte Carlo simulations", enabled: false }
      ]
    },
    {
      id: "constructor",
      name: "Constructor Elite",
      price: "$49",
      description: "Full strategic simulation tool used by professional sim racers and commentators.",
      features: [
        { text: "Predictor Sim (Standard Laps)", enabled: true },
        { text: "Sunny & Cloudy Weather Variables", enabled: true },
        { text: "2024 & 2025 Championship Tables", enabled: true },
        { text: "Telemetry Pro Workspace (UNLOCKED)", enabled: true },
        { text: "Rain Strategy & Safety Car Toggles", enabled: true },
        { text: "Raw CSV Telemetry Exports (UNLOCKED)", enabled: true },
        { text: "Unlimited Monte Carlo simulations", enabled: true }
      ]
    }
  ];

  return (
    <div className="main-content">
      {/* Header */}
      <header className="view-header">
        <div className="header-title-section">
          <h1>Premium Tiers</h1>
          <span className="header-subtitle">Analyze race data like a professional team strategist</span>
        </div>
      </header>

      {/* Intro section */}
      <div style={{ textAlign: "center", padding: "2.5rem 1rem 0" }}>
        <h2 style={{ fontSize: "1.75rem", fontFamily: "var(--font-heading)", marginBottom: "0.5rem" }}>
          Choose your telemetry scope
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "550px", margin: "0 auto", fontSize: "0.95rem" }}>
          Unchain the full capacity of the ApexGP strategy simulator. Lock in telemetry comparison traces, CSV exports, and AI commentary.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="pricing-grid">
        {tiers.map((tier) => {
          const isActive = premiumTier === tier.id;
          const isButtonLoading = loadingTier === tier.id;
          
          return (
            <div 
              key={tier.id} 
              className={`pricing-card ${tier.recommended ? "premium" : ""}`}
              style={{
                borderColor: isActive ? "var(--f1-red)" : "var(--border-color)",
                boxShadow: isActive ? "var(--shadow-neon-red)" : "var(--shadow-md)"
              }}
            >
              <div className="pricing-card-header">
                {tier.id === "constructor" ? (
                  <Crown size={22} style={{ color: "var(--safety-yellow)", marginBottom: "0.5rem" }} />
                ) : tier.id === "pro" ? (
                  <Zap size={22} style={{ color: "var(--drs-cyan)", marginBottom: "0.5rem" }} />
                ) : (
                  <ShieldCheck size={22} style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }} />
                )}
                
                <h3 className="pricing-tier-name">{tier.name}</h3>
                <div className="pricing-price">
                  {tier.price}
                  <span>/ month</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                  {tier.description}
                </p>
              </div>

              <ul className="pricing-features-list">
                {tier.features.map((feature, idx) => (
                  <li 
                    key={idx} 
                    className={`pricing-feature-item ${feature.enabled ? "" : "disabled"}`}
                  >
                    {feature.enabled ? (
                      <Check size={16} style={{ color: "var(--telemetry-green)", flexShrink: 0 }} />
                    ) : (
                      <X size={16} style={{ color: "var(--f1-red)", flexShrink: 0 }} />
                    )}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`btn ${
                  isActive 
                    ? "btn-secondary" 
                    : tier.recommended 
                      ? "btn-primary" 
                      : "btn-secondary"
                }`}
                style={{ width: "100%", padding: "0.75rem" }}
                disabled={isButtonLoading}
                onClick={() => handleSelectTier(tier.id)}
              >
                {isButtonLoading ? (
                  "Processing..."
                ) : isActive ? (
                  "Active Subscription"
                ) : (
                  `Upgrade to ${tier.name.split(" ")[0]}`
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Banner */}
      <div style={{ maxWidth: "900px", margin: "0 auto 3rem", padding: "0 2rem" }}>
        <div className="card" style={{ display: "flex", gap: "1.5rem", alignItems: "center", padding: "1.5rem 2rem" }}>
          <div style={{ fontSize: "2rem" }}>💡</div>
          <div>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>SaaS Account Simulation mode active</h4>
            <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
              No real credit cards are processed. Clicking upgrade instantly switches your browser local application scope to unlock the premium Telemetry analysis charts and telemetry CSV file saving modules.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
