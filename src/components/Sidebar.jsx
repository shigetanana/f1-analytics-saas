import { 
  LayoutDashboard, 
  TrendingUp, 
  Gauge, 
  History, 
  CreditCard, 
  Flag,
  Award,
  Zap
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, premiumTier }) {
  const menuItems = [
    { id: "dashboard", label: "Race Hub", icon: LayoutDashboard },
    { id: "predictor", label: "Predictor Sim", icon: TrendingUp },
    { id: "telemetry", label: "Telemetry Pro", icon: Gauge, isPremium: true },
    { id: "history", label: "Database & H2H", icon: History },
    { id: "pricing", label: "Premium Tiers", icon: CreditCard },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Flag size={26} fill="var(--f1-red)" stroke="var(--f1-red)" style={{ transform: "rotate(-10deg)" }} />
          APEX<span>GP</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isLocked = item.isPremium && premiumTier === "free";
          
          return (
            <div
              key={item.id}
              className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.isPremium && (
                <span 
                  className="badge badge-cyan" 
                  style={{ 
                    marginLeft: "auto", 
                    fontSize: "0.6rem", 
                    padding: "0.1rem 0.35rem",
                    border: isLocked ? "1px solid rgba(255, 214, 0, 0.4)" : "1px solid rgba(0, 240, 255, 0.3)",
                    color: isLocked ? "var(--safety-yellow)" : "var(--drs-cyan)",
                    backgroundColor: isLocked ? "rgba(255, 214, 0, 0.1)" : "rgba(0, 240, 255, 0.1)"
                  }}
                >
                  {isLocked ? "LOCKED" : "PRO"}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-premium-status">
        {premiumTier === "free" ? (
          <>
            <Award size={24} style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }} />
            <h4>Free Access</h4>
            <p>Basic simulator & standing statistics enabled.</p>
            <button 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "0.5rem", fontSize: "0.8rem" }}
              onClick={() => setActiveTab("pricing")}
            >
              <Zap size={14} fill="white" /> UPGRADE TO PRO
            </button>
          </>
        ) : premiumTier === "pro" ? (
          <>
            <Award size={24} style={{ color: "var(--drs-cyan)", marginBottom: "0.5rem" }} />
            <h4>Pro Analyst</h4>
            <p>All telemetry and full predictor simulation unlocked.</p>
            <button 
              className="btn btn-secondary" 
              style={{ width: "100%", padding: "0.5rem", fontSize: "0.8rem", borderColor: "rgba(0, 240, 255, 0.3)" }}
              onClick={() => setActiveTab("pricing")}
            >
              VIEW DETAILS
            </button>
          </>
        ) : (
          <>
            <Award size={24} style={{ color: "var(--safety-yellow)", marginBottom: "0.5rem" }} />
            <h4>Constructor Elite</h4>
            <p>Unlimited Monte Carlo runs & telemetry export active.</p>
            <button 
              className="btn btn-secondary" 
              style={{ width: "100%", padding: "0.5rem", fontSize: "0.8rem", borderColor: "rgba(255, 214, 0, 0.3)" }}
              onClick={() => setActiveTab("pricing")}
            >
              MANAGE ACCOUNT
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
