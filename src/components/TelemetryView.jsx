import { useState, useRef } from "react";
import { 
  Gauge, 
  Lock, 
  Zap, 
  Activity
} from "lucide-react";
import { CIRCUITS } from "../data/f1Data";

export default function TelemetryView({ premiumTier, setActiveTab }) {
  const [selectedCircuitId, setSelectedCircuitId] = useState("monza");
  const [activeCornerId, setActiveCornerId] = useState(11);
  const [telemetryChannel, setTelemetryChannel] = useState("speed"); // speed, throttle, brake, rpm
  
  // Track chart mouse hover state for the vertical line tracker
  const [hoverIndex, setHoverIndex] = useState(null);
  const chartSvgRef = useRef(null);

  const circuit = CIRCUITS.find(c => c.id === selectedCircuitId) || CIRCUITS[0];
  const telemetry = circuit.telemetryData;
  const channelData = telemetry.channels;

  // Handles mouse movements over telemetry chart to draw interactive vertical tracker
  const handleChartMouseMove = (e) => {
    if (!chartSvgRef.current) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = 40;
    const chartWidth = rect.width - 2 * padding;
    
    if (x >= padding && x <= rect.width - padding) {
      const percentage = (x - padding) / chartWidth;
      const dataLen = channelData.distance.length;
      const idx = Math.min(dataLen - 1, Math.max(0, Math.round(percentage * (dataLen - 1))));
      setHoverIndex(idx);
    } else {
      setHoverIndex(null);
    }
  };

  const handleChartMouseLeave = () => {
    setHoverIndex(null);
  };

  // Helper paths for drawing interactive circuit SVGs
  const getCircuitSvgPath = (id) => {
    switch (id) {
      case "monza":
        return {
          path: "M 50,80 L 350,80 C 370,80 380,90 380,105 C 380,120 370,130 350,130 L 260,130 C 250,130 245,140 250,145 L 280,195 C 285,205 280,215 270,215 L 200,215 C 190,215 180,205 180,195 C 180,185 190,175 200,175 L 230,175 C 240,175 245,165 240,160 L 220,120 L 50,120 C 30,120 20,130 20,160 C 20,200 40,240 70,260 C 90,270 120,260 140,240 L 160,200 L 160,160 L 150,150 L 120,170 C 110,180 90,180 80,170 C 70,160 70,140 85,130 L 100,120 Z",
          corners: [
            { id: 1, x: 230, y: 120, name: "Prima Variante" },
            { id: 3, x: 320, y: 80, name: "Curva Grande" },
            { id: 4, x: 380, y: 110, name: "Variante della Roggia" },
            { id: 7, x: 270, y: 155, name: "Lesmo 1" },
            { id: 8, x: 270, y: 215, name: "Lesmo 2" },
            { id: 10, x: 200, y: 175, name: "Ascari Chicane" },
            { id: 11, x: 45, y: 190, name: "Parabolica (Curva Alboreto)" }
          ]
        };
      case "monaco":
        return {
          path: "M 100,50 L 300,50 L 320,80 L 290,110 L 310,130 L 300,150 L 260,130 L 200,180 L 180,240 L 220,250 L 260,220 L 320,240 L 310,280 L 230,280 L 150,250 C 130,240 100,240 80,260 C 60,280 40,270 30,240 L 30,120 C 30,80 60,50 100,50 Z",
          corners: [
            { id: 1, x: 300, y: 50, name: "Sainte Devote" },
            { id: 4, x: 300, y: 110, name: "Casino Square" },
            { id: 6, x: 280, y: 140, name: "Grand Hotel Hairpin" },
            { id: 8, x: 200, y: 180, name: "Portier" },
            { id: 9, x: 180, y: 240, name: "Tunnel" },
            { id: 10, x: 220, y: 250, name: "Nouvelle Chicane" },
            { id: 12, x: 320, y: 240, name: "Tabac" },
            { id: 15, x: 230, y: 280, name: "Swimming Pool" },
            { id: 19, x: 30, y: 180, name: "Anthony Noghes" }
          ]
        };
      case "silverstone":
      default:
        return {
          path: "M 80,100 L 200,60 L 280,120 L 360,110 L 380,160 L 320,200 L 240,180 L 200,240 L 150,220 L 110,260 C 90,280 60,270 50,240 L 40,160 C 40,120 60,100 80,100 Z",
          corners: [
            { id: 1, x: 200, y: 60, name: "Abbey" },
            { id: 3, x: 280, y: 120, name: "Village" },
            { id: 4, x: 360, y: 110, name: "Loop" },
            { id: 6, x: 380, y: 160, name: "Brooklands" },
            { id: 9, x: 240, y: 180, name: "Copse" },
            { id: 11, x: 150, y: 220, name: "Maggots" },
            { id: 12, x: 110, y: 260, name: "Becketts" },
            { id: 15, x: 50, y: 240, name: "Stowe" },
            { id: 16, x: 40, y: 160, name: "Club" }
          ]
        };
    }
  };

  const mapDetails = getCircuitSvgPath(selectedCircuitId);

  // Locked View if Free Tier
  if (premiumTier === "free") {
    return (
      <div className="main-content" style={{ position: "relative", minHeight: "100vh" }}>
        <header className="view-header">
          <div className="header-title-section">
            <h1>Telemetry Pro</h1>
            <span className="header-subtitle">Micro-sector data comparisons and car overlays</span>
          </div>
        </header>

        {/* Premium Lock Overlay Container */}
        <div style={{ padding: "3rem 2rem", maxWidth: "900px", margin: "2rem auto" }}>
          <div className="card red-indicator" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem 2rem", textAlign: "center", position: "relative" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "var(--f1-red-glow)", display: "flex", alignItems: "center", justifyCenter: "center", color: "var(--f1-red)", marginBottom: "1.5rem" }}>
              <Lock size={32} style={{ margin: "auto" }} />
            </div>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Unlock Pro Telemetry Workspace</h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "550px", lineHeight: "1.6", marginBottom: "2.5rem" }}>
              Our telemetry suite provides side-by-side micro-sector speeds, throttle pedal trace analysis, brake pressures, safety gear indices, and tire surface thermal dynamics. Unlock this feature to gain strategic commentary.
            </p>
            
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem" }}>
              <div className="badge badge-cyan" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
                ✓ Interactive Track Corners
              </div>
              <div className="badge badge-cyan" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
                ✓ Side-by-Side Comparison Gaps
              </div>
              <div className="badge badge-cyan" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}>
                ✓ Live Hairline Chart Trackers
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ fontSize: "1rem", padding: "0.8rem 2rem" }}
              onClick={() => setActiveTab("pricing")}
            >
              <Zap size={16} fill="white" /> UPGRADE TO PRO NOW
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Draw the custom telemetry line chart using SVG
  const drawTelemetryChart = () => {
    const width = 600;
    const height = 260;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 35;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const xVals = channelData.distance;
    const maxX = xVals[xVals.length - 1];

    let yA = [];
    let yB = [];
    let minVal = 0;
    let maxVal = 100;

    if (telemetryChannel === "speed") {
      yA = channelData.driverA.speed;
      yB = channelData.driverB.speed;
      minVal = 100;
      maxVal = 350;
    } else if (telemetryChannel === "throttle") {
      yA = channelData.driverA.throttle;
      yB = channelData.driverB.throttle;
      minVal = 0;
      maxVal = 100;
    } else if (telemetryChannel === "brake") {
      yA = channelData.driverA.brake;
      yB = channelData.driverB.brake;
      minVal = 0;
      maxVal = 100;
    } else if (telemetryChannel === "rpm") {
      yA = channelData.driverA.rpm;
      yB = channelData.driverB.rpm;
      minVal = 4000;
      maxVal = 13000;
    }

    const getXCoord = (val) => paddingLeft + (val / maxX) * chartWidth;
    const getYCoord = (val) => height - paddingBottom - ((val - minVal) / (maxVal - minVal)) * chartHeight;

    // Build SVG path strings
    const pathA = yA.map((val, idx) => {
      const x = getXCoord(xVals[idx]);
      const y = getYCoord(val);
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");

    const pathB = yB.map((val, idx) => {
      const x = getXCoord(xVals[idx]);
      const y = getYCoord(val);
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");

    // Vertical indicator coordinate for mouse hairline tracking
    const hairlineX = hoverIndex !== null ? getXCoord(xVals[hoverIndex]) : null;

    return (
      <svg 
        ref={chartSvgRef} 
        viewBox={`0 0 ${width} ${height}`} 
        className="telemetry-custom-svg-chart"
        onMouseMove={handleChartMouseMove}
        onMouseLeave={handleChartMouseLeave}
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((percentage) => {
          const val = minVal + percentage * (maxVal - minVal);
          const y = getYCoord(val);
          return (
            <g key={percentage}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} className="telemetry-grid-line" />
              <text x={paddingLeft - 8} y={y + 3} className="telemetry-axis-label" textAnchor="end">
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* X-Axis labels (Distance) */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((percentage) => {
          const val = percentage * maxX;
          const x = getXCoord(val);
          return (
            <g key={percentage}>
              <text x={x} y={height - paddingBottom + 16} className="telemetry-axis-label" textAnchor="middle">
                {Math.round(val)}m
              </text>
            </g>
          );
        })}
        <text x={width / 2} y={height - 4} className="telemetry-axis-label" textAnchor="middle" style={{ fontSize: "11px", fontWeight: "600" }}>
          Corner Distance (Meters)
        </text>

        {/* Plot Lines */}
        <path d={pathA} className="driver-a" />
        <path d={pathB} className="driver-b" />

        {/* Vertical Hairline tracker */}
        {hairlineX && (
          <g>
            <line x1={hairlineX} y1={paddingTop} x2={hairlineX} y2={height - paddingBottom} stroke="var(--text-secondary)" strokeWidth="1.5" strokeDasharray="3,3" />
            
            {/* Draw dots at current hover points */}
            <circle cx={hairlineX} cy={getYCoord(yA[hoverIndex])} r="4" fill="var(--f1-red)" stroke="white" strokeWidth="1" />
            <circle cx={hairlineX} cy={getYCoord(yB[hoverIndex])} r="4" fill="var(--drs-cyan)" stroke="white" strokeWidth="1" />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="main-content">
      {/* Header */}
      <header className="view-header">
        <div className="header-title-section">
          <h1>Telemetry Pro</h1>
          <span className="header-subtitle">Micro-sector data comparisons and car overlays</span>
        </div>
        <div className="header-actions">
          <div className="form-group" style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="form-label" style={{ marginBottom: 0 }}>Circuit</span>
            <select 
              className="form-control" 
              style={{ width: "180px", padding: "0.4rem 0.75rem" }}
              value={selectedCircuitId}
              onChange={(e) => {
                setSelectedCircuitId(e.target.value);
                // Set default corners based on circuit
                if (e.target.value === "monza") setActiveCornerId(11);
                else if (e.target.value === "monaco") setActiveCornerId(6);
                else setActiveCornerId(9);
              }}
            >
              {CIRCUITS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="telemetry-layout">
        
        {/* Left Side: Interactive Circuit & Analysis */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Circuit Interactive SVG */}
          <div className="track-container card">
            <div style={{ position: "absolute", top: "1.25rem", left: "1.25rem" }}>
              <span className="form-label">Circuit Map Workspace</span>
              <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--font-heading)" }}>{circuit.name}</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Click corner nodes to update graphs</p>
            </div>

            <svg viewBox="0 0 400 300" className="track-svg">
              {/* Circuit glow layer */}
              <path 
                d={mapDetails.path} 
                fill="none" 
                stroke="var(--f1-red-glow)" 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Circuit primary track line */}
              <path 
                d={mapDetails.path} 
                fill="none" 
                stroke="var(--border-hover)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              
              {/* Corner circles */}
              {mapDetails.corners.map((node) => {
                const isActive = activeCornerId === node.id;
                return (
                  <g key={node.id} onClick={() => setActiveCornerId(node.id)}>
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isActive ? "7" : "5"} 
                      fill={isActive ? "var(--f1-red)" : "var(--bg-secondary)"} 
                      stroke={isActive ? "white" : "var(--text-secondary)"} 
                      strokeWidth="2" 
                      className="track-corner-node"
                      style={{ filter: isActive ? "var(--shadow-neon-red)" : "none" }}
                    />
                    <text 
                      x={node.x + 8} 
                      y={node.y + 4} 
                      fill={isActive ? "var(--text-primary)" : "var(--text-muted)"}
                      style={{ fontSize: "9px", fontFamily: "var(--font-heading)", fontWeight: isActive ? "bold" : "normal" }}
                    >
                      T{node.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Telemetry charts card */}
          <div className="telemetry-chart-container card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Activity size={18} style={{ color: "var(--f1-red)" }} />
                Corner Data: T{activeCornerId} ({circuit.corners.find(c => c.id === activeCornerId)?.name || "Telemetry Corner"})
              </h3>
              
              {/* Channel Selector */}
              <div style={{ display: "flex", gap: "0.25rem", border: "1px solid var(--border-color)", borderRadius: "0.375rem", padding: "0.15rem" }}>
                {["speed", "throttle", "brake", "rpm"].map((chan) => (
                  <button
                    key={chan}
                    className="btn"
                    style={{ 
                      padding: "0.2rem 0.5rem", 
                      fontSize: "0.7rem", 
                      backgroundColor: telemetryChannel === chan ? "var(--f1-red)" : "transparent",
                      color: telemetryChannel === chan ? "white" : "var(--text-secondary)"
                    }}
                    onClick={() => setTelemetryChannel(chan)}
                  >
                    {chan.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom chart plotting */}
            <div className="custom-chart-wrapper">
              {drawTelemetryChart()}
            </div>

            {/* Custom interactive legend / Hover inspector */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
              <div className="telemetry-legend">
                <div className="telemetry-legend-item">
                  <span className="telemetry-legend-color" style={{ backgroundColor: "var(--f1-red)" }}></span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{channelData.driverA.name}</span>
                </div>
                <div className="telemetry-legend-item">
                  <span className="telemetry-legend-color" style={{ backgroundColor: "var(--drs-cyan)" }}></span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{channelData.driverB.name}</span>
                </div>
              </div>

              {/* Live hover metrics overlay */}
              {hoverIndex !== null && (
                <div style={{ display: "flex", gap: "1.5rem", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "0.375rem", padding: "0.4rem 0.75rem", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>DIST:</span> {channelData.distance[hoverIndex]}m
                  </div>
                  <div style={{ color: "var(--f1-red)", fontWeight: "bold" }}>
                    <span>DRIVER A:</span> {
                      telemetryChannel === "speed" ? `${channelData.driverA.speed[hoverIndex]} km/h` :
                      telemetryChannel === "throttle" ? `${channelData.driverA.throttle[hoverIndex]}%` :
                      telemetryChannel === "brake" ? `${channelData.driverA.brake[hoverIndex]}%` :
                      `${channelData.driverA.rpm[hoverIndex]} RPM`
                    }
                  </div>
                  <div style={{ color: "var(--drs-cyan)", fontWeight: "bold" }}>
                    <span>DRIVER B:</span> {
                      telemetryChannel === "speed" ? `${channelData.driverB.speed[hoverIndex]} km/h` :
                      telemetryChannel === "throttle" ? `${channelData.driverB.throttle[hoverIndex]}%` :
                      telemetryChannel === "brake" ? `${channelData.driverB.brake[hoverIndex]}%` :
                      `${channelData.driverB.rpm[hoverIndex]} RPM`
                    }
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Side: Micro-sector metrics Analysis Panel */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Gauge size={18} style={{ color: "var(--f1-red)" }} />
              Corner Sector Analysis
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              
              <div style={{ background: "var(--bg-secondary)", borderRadius: "0.5rem", padding: "0.75rem", border: "1px solid var(--border-color)" }}>
                <span className="form-label" style={{ fontSize: "0.7rem", marginBottom: "0.15rem" }}>Apex Velocity Delta</span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--f1-red)" }}>
                    VER (+7 km/h)
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>At Apex (T{activeCornerId})</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  Red Bull chassis achieves earlier throttle pick-up at 195m, gaining speed advantage onto exit.
                </p>
              </div>

              <div style={{ background: "var(--bg-secondary)", borderRadius: "0.5rem", padding: "0.75rem", border: "1px solid var(--border-color)" }}>
                <span className="form-label" style={{ fontSize: "0.7rem", marginBottom: "0.15rem" }}>Braking Pressure Decel</span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--drs-cyan)" }}>
                    LEC (-15m braking point)
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Brake Entry Zone</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  Ferrari braking profile shows Charles Leclerc braking 15 meters later with 90% peak pressure at entry.
                </p>
              </div>

              <div style={{ background: "var(--bg-secondary)", borderRadius: "0.5rem", padding: "0.75rem", border: "1px solid var(--border-color)" }}>
                <span className="form-label" style={{ fontSize: "0.7rem", marginBottom: "0.15rem" }}>Aero DRS Balance Index</span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: "bold", fontFamily: "var(--font-heading)" }}>
                    Drag Coefficient: 0.312
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>DRS Active Zone</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  Telemetry indicates that DRS activation reduces drag by 18.5%, providing 12.8km/h speed gain.
                </p>
              </div>

            </div>
          </div>

          <div className="card red-indicator">
            <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              ApexAI Corner Briefing
            </h3>
            <p style={{ fontSize: "0.825rem", lineHeight: "1.5", color: "var(--text-secondary)" }}>
              Analysis at <strong>T{activeCornerId} ({circuit.corners.find(c => c.id === activeCornerId)?.name || "Telemetry corner"})</strong> reveals that Red Bull's straight-line drag advantage allows Max Verstappen to gain +0.082s along the straight entry, despite Charles Leclerc carrying 3.5km/h higher mid-corner minimum speed. The Ferrari holds higher downforce but suffers on high-speed exits.
            </p>
          </div>

        </aside>

      </div>
    </div>
  );
}
