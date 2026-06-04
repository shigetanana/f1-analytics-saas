import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  RotateCcw, 
  CloudRain, 
  Sun, 
  Cloud,
  ChevronUp, 
  ChevronDown, 
  Download,
  Info,
  Layers,
  Sparkles,
  Sliders,
  TrendingUp
} from "lucide-react";
import { CIRCUITS, DRIVERS, TEAMS } from "../data/f1Data";

export default function PredictorView() {
  const [selectedCircuitId, setSelectedCircuitId] = useState("monza");
  const [weather, setWeather] = useState("sunny"); // sunny, overcast, rain
  const [safetyCarRate, setSafetyCarRate] = useState("medium"); // low, medium, high
  const [aggression, setAggression] = useState(50);
  const [tireManagement, setTireManagement] = useState(50);
  
  // Grid lineup state
  const [grid, setGrid] = useState(() => {
    const sorted = [...DRIVERS]
      .sort((a, b) => b.qualySpeed * 0.7 + Math.random() * 20 - (a.qualySpeed * 0.7 + Math.random() * 20))
      .slice(0, 15);
    return sorted.map((d, index) => ({
      ...d,
      gridPos: index + 1,
      currentPos: index + 1,
      gapToLeader: index * 1.8,
      tireCompound: "medium",
      tireAge: 0,
      tireHealth: 100,
      stops: 0,
      dnf: false,
      dnfReason: ""
    }));
  });
  
  // Simulation states
  const [simRunning, setSimRunning] = useState(false);
  const [currentLap, setCurrentLap] = useState(0);
  const [simLogs, setSimLogs] = useState(() => [
    { time: "00:00", msg: `🏎️ Grid lined up at Monza (Temple of Speed). Lights out in 5 seconds...` }
  ]);
  const [tireWearHistory, setTireWearHistory] = useState([]); // for SVG chart
  const [safetyCarActive, setSafetyCarActive] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  const simInterval = useRef(null);
  const circuit = CIRCUITS.find(c => c.id === selectedCircuitId);

  const resetSimulation = () => {
    if (simInterval.current) clearInterval(simInterval.current);
    setSimRunning(false);
    setCurrentLap(0);
    setSafetyCarActive(false);
    setShowSummary(false);
    setTireWearHistory([]);
    setSimLogs([
      { time: "00:00", msg: `🏎️ Grid lined up at ${circuit.name}. Lights out in 5 seconds...` }
    ]);
    
    setGrid(prev => prev.map((d, index) => {
      let initialCompound = "medium";
      if (weather === "rain") {
        initialCompound = "inters";
      }
      return {
        ...d,
        currentPos: index + 1,
        gapToLeader: index * 1.8,
        tireCompound: initialCompound,
        tireAge: 0,
        tireHealth: 100,
        stops: 0,
        dnf: false,
        dnfReason: ""
      };
    }));
  };

  const handleCircuitSelect = (circuitId) => {
    setSelectedCircuitId(circuitId);
    const targetCircuit = CIRCUITS.find(c => c.id === circuitId);
    
    const sorted = [...DRIVERS]
      .sort((a, b) => b.qualySpeed * 0.7 + Math.random() * 20 - (a.qualySpeed * 0.7 + Math.random() * 20))
      .slice(0, 15);
      
    const initialCompound = weather === "rain" ? "inters" : "medium";
    const initialGrid = sorted.map((d, index) => ({
      ...d,
      gridPos: index + 1,
      currentPos: index + 1,
      gapToLeader: index * 1.8,
      tireCompound: initialCompound,
      tireAge: 0,
      tireHealth: 100,
      stops: 0,
      dnf: false,
      dnfReason: ""
    }));

    setGrid(initialGrid);
    if (simInterval.current) clearInterval(simInterval.current);
    setSimRunning(false);
    setCurrentLap(0);
    setSafetyCarActive(false);
    setShowSummary(false);
    setTireWearHistory([]);
    setSimLogs([
      { time: "00:00", msg: `🏎️ Grid lined up at ${targetCircuit.name}. Lights out in 5 seconds...` }
    ]);
  };

  // Drag grid item actions (up/down)
  const moveGridItem = (index, direction) => {
    if (simRunning || currentLap > 0) return; // disable during simulation
    const newGrid = [...grid];
    if (direction === "up" && index > 0) {
      const temp = newGrid[index];
      newGrid[index] = newGrid[index - 1];
      newGrid[index - 1] = temp;
    } else if (direction === "down" && index < newGrid.length - 1) {
      const temp = newGrid[index];
      newGrid[index] = newGrid[index + 1];
      newGrid[index + 1] = temp;
    }
    // Update grid starting details
    setGrid(newGrid.map((d, idx) => ({
      ...d,
      gridPos: idx + 1,
      currentPos: idx + 1,
      gapToLeader: idx * 1.8
    })));
  };

  // Run Simulation Tick (1 tick = 1 lap)
  const runSimTick = () => {
    setCurrentLap(prevLap => {
      const nextLap = prevLap + 1;
      
      if (nextLap > circuit.laps) {
        setSimRunning(false);
        if (simInterval.current) clearInterval(simInterval.current);
        setShowSummary(true);
        setSimLogs(prev => [...prev, { time: `Lap ${circuit.laps}`, msg: "🏁 CHEQUERED FLAG! The race is finished.", highlight: true }]);
        return prevLap;
      }

      setGrid(prevGrid => {
        // 1. Calculate new lap times/gaps for each driver
        let safetyCarRoll = Math.random() * 100;
        let safetyCarThresh = safetyCarRate === "low" ? 1 : safetyCarRate === "medium" ? 3 : 6;
        let isSafetyCarTick = false;
        
        if (safetyCarActive) {
          // 30% chance safety car returns to pits
          if (Math.random() < 0.3) {
            setSafetyCarActive(false);
            setSimLogs(prev => [...prev, { time: `Lap ${nextLap}`, msg: "🟢 Safety Car ending. Green Flag! Race restarts.", highlight: true }]);
          }
        } else {
          // Check for safety car trigger
          if (safetyCarRoll < safetyCarThresh && nextLap > 2 && nextLap < circuit.laps - 2) {
            setSafetyCarActive(true);
            isSafetyCarTick = true;
            setSimLogs(prev => [...prev, { time: `Lap ${nextLap}`, msg: "⚠️ SAFETY CAR DEPLOYED! Track debris in Sector 2.", warning: true }]);
          }
        }

        // Map driver adjustments
        const newDrivers = prevGrid.map((driver) => {
          if (driver.dnf) return driver;

          // Check for mechanical/crash DNF
          // Base DNF probability: 0.1% * multiplier based on constructor aero/reliability
          const team = TEAMS[driver.teamId];
          const crashFactor = (100 - driver.defense) * (aggression / 50) * 0.01;
          const mechanicalFactor = (100 - team.downforce) * 0.005;
          const dnfRoll = Math.random() * 1000;
          
          if (dnfRoll < (crashFactor + mechanicalFactor + (weather === "rain" ? 1.5 : 0)) * 10) {
            const isCrash = Math.random() > 0.4;
            const reason = isCrash ? "Crash in barrier" : "Engine failure (MGU-H)";
            setSimLogs(prev => [...prev, { 
              time: `Lap ${nextLap}`, 
              msg: `❌ DNF: ${driver.name} has retired. (${reason})`, 
              danger: true 
            }]);
            return { ...driver, dnf: true, dnfReason: reason };
          }

          // Calculate lap pace variables
          let basePace = circuit.baseLapTimeSec;
          
          // Constructor factors
          const constructorAeroBonus = (team.aeroEfficiency - 90) * 0.05; // McLaren/Red Bull faster
          const constructorPowerBonus = (team.enginePower - 90) * 0.08; // Straight-line speeds
          
          // Driver attributes
          const driverQualyBonus = (driver.qualySpeed - 80) * 0.04;
          const rainSkillBonus = weather === "rain" ? (driver.rainSkill - 85) * 0.15 : 0;
          const userAggressionFactor = (aggression - 50) * 0.02; // higher aggression = faster pace but higher tire wear

          // Tire wear decay logic
          let wearRate = 1.0;
          if (driver.tireCompound === "soft") wearRate = 3.5;
          else if (driver.tireCompound === "medium") wearRate = 2.0;
          else if (driver.tireCompound === "hard") wearRate = 1.1;
          else if (driver.tireCompound === "inters" || driver.tireCompound === "wets") wearRate = 1.3;

          // Weather/Tire mismatch penalty
          let tireMismatchPenalty = 0;
          if (weather === "rain" && (driver.tireCompound === "soft" || driver.tireCompound === "medium" || driver.tireCompound === "hard")) {
            tireMismatchPenalty = 8.5; // massive loss of grip
          } else if (weather !== "rain" && (driver.tireCompound === "inters" || driver.tireCompound === "wets")) {
            tireMismatchPenalty = 4.0; // burning wet tires on dry track
            wearRate *= 3.0; // extreme tire wear
          }

          // Apply tire management stat
          const tireMgmtBonus = (driver.tireMgmt - 50) * 0.01; 
          const netTireWear = Math.max(1, wearRate * (1 - tireMgmtBonus) * (1 + (100 - tireManagement) * 0.005) * (1 + userAggressionFactor * 0.1));
          
          const newTireAge = driver.tireAge + 1;
          const newTireHealth = Math.max(0, 100 - (newTireAge * netTireWear));

          // Tire performance drop
          let tirePaceDrop = 0;
          if (newTireHealth < 50) {
            tirePaceDrop = (50 - newTireHealth) * 0.06;
          }
          if (driver.tireCompound === "soft" && newTireAge > 12) tirePaceDrop += 1.5;

          // Compute lap time
          let driverLapTime = basePace 
            - constructorAeroBonus 
            - constructorPowerBonus 
            - driverQualyBonus 
            - rainSkillBonus 
            + tireMismatchPenalty 
            + tirePaceDrop 
            + (Math.random() * 0.4 - 0.2);

          // Pit stop trigger
          let willPit = false;
          let newCompound = driver.tireCompound;
          
          // Trigger pit if tires worn below threshold or weather changed
          if (newTireHealth < 20) {
            willPit = true;
            // Switch compound (e.g. medium -> hard, soft -> medium, etc.)
            if (weather === "rain") {
              newCompound = "inters";
            } else {
              newCompound = driver.tireCompound === "soft" ? "medium" : "hard";
            }
          }
          
          let pitStopDelay = 0;
          let newStops = driver.stops;
          if (willPit) {
            const pitTime = 20.0 + (100 - team.pitstopSpeed) * 0.08; // average 20-22 seconds total pitlane loss
            pitStopDelay = pitTime;
            newStops += 1;
            setSimLogs(prev => [...prev, { 
              time: `Lap ${nextLap}`, 
              msg: `🔧 Pit Stop: ${driver.name} pits for fresh ${newCompound.toUpperCase()} (Tire age was ${newTireAge} laps).` 
            }]);
          }

          return {
            ...driver,
            tireAge: willPit ? 0 : newTireAge,
            tireHealth: willPit ? 100 : newTireHealth,
            tireCompound: newCompound,
            stops: newStops,
            lastLapTime: driverLapTime,
            pitStopDelay // to be added to gaps
          };
        });

        // 2. Adjust gaps based on lap times and pit delays
        const activeDrivers = newDrivers.filter(d => !d.dnf);
        
        // Let's compute running cumulative times
        // If Safety Car is active, compress all gaps
        if (safetyCarActive || isSafetyCarTick) {
          activeDrivers.forEach((driver, idx) => {
            driver.gapToLeader = idx * 0.8; // compressed safety car queue
          });
        } else {
          // Standard racing gap physics
          // Leader establishes pace. Let's sort current list by their cumulative gaps first.
          activeDrivers.sort((a, b) => a.gapToLeader - b.gapToLeader);
          
          activeDrivers.forEach((driver, idx) => {
            if (idx === 0) {
              driver.gapToLeader = 0;
            } else {
              const prev = activeDrivers[idx - 1];
              // Gap is previous gap + diff in lap time + pit delay
              let gapDiff = (driver.lastLapTime - prev.lastLapTime) + (driver.pitStopDelay || 0);
              // Clean up pit delay for next lap
              driver.pitStopDelay = 0;
              
              // DRS zone check (if gap within 1.0s behind, DRS gives 0.4s advantage)
              let drsActive = false;
              let currentGap = prev.gapToLeader + gapDiff;
              if (currentGap - prev.gapToLeader < 1.0 && currentGap - prev.gapToLeader > 0.2) {
                drsActive = true;
                gapDiff -= 0.3; // DRS speed boost
              }
              
              // Overtaking logic: if gap becomes negative, swap positions!
              let newGap = Math.max(0.1, prev.gapToLeader + gapDiff);
              
              if (newGap < prev.gapToLeader) {
                // Potential overtake attempt
                const overtakerRating = driver.overtaking * (1 + (aggression - 50)*0.01);
                const defenderRating = prev.defense;
                
                if (overtakerRating * Math.random() > defenderRating * Math.random() && circuit.overtakeDifficulty < 80) {
                  // Overtake succeeded! Swap their relative positions
                  newGap = prev.gapToLeader;
                  prev.gapToLeader = newGap + 0.6; // put defender slightly behind
                  
                  setSimLogs(prevLogs => [...prevLogs, {
                    time: `Lap ${nextLap}`,
                    msg: `⚔️ Overtake: ${driver.name} passes ${prev.name} for P${idx}!${drsActive ? " (DRS Assisted)" : ""}`
                  }]);
                } else {
                  // Overtake blocked
                  newGap = prev.gapToLeader + 0.3;
                }
              }
              driver.gapToLeader = newGap;
            }
          });
        }

        // Re-sort and map ranking positions
        const sortedGrid = [...newDrivers].sort((a, b) => {
          if (a.dnf && !b.dnf) return 1;
          if (!a.dnf && b.dnf) return -1;
          if (a.dnf && b.dnf) return 0;
          return a.gapToLeader - b.gapToLeader;
        });

        const finalGrid = sortedGrid.map((d, index) => ({
          ...d,
          currentPos: d.dnf ? 99 : index + 1
        }));

        // Log general race updates (e.g. gaps at top 3)
        if (nextLap % 5 === 0 && !safetyCarActive && finalGrid.length > 2 && !finalGrid[0].dnf) {
          const leader = finalGrid[0];
          const second = finalGrid[1];
          setSimLogs(prev => [...prev, {
            time: `Lap ${nextLap}`,
            msg: `📊 Race Leader: ${leader.name} (${leader.tireCompound.toUpperCase()}) leads ${second.name} by +${second.gapToLeader.toFixed(2)}s.`
          }]);
        }

        // Save tire wear history for top 3 active drivers for SVG drawing
        const top3TireWears = finalGrid.slice(0, 3).map(d => ({
          code: d.code,
          wear: d.tireHealth,
          compound: d.tireCompound
        }));
        setTireWearHistory(prev => [...prev, { lap: nextLap, drivers: top3TireWears }]);

        return finalGrid;
      });

      return nextLap;
    });
  };

  // Toggle Play / Pause
  const toggleSimulation = () => {
    if (simRunning) {
      if (simInterval.current) clearInterval(simInterval.current);
      setSimRunning(false);
    } else {
      setSimRunning(true);
      simInterval.current = setInterval(runSimTick, 250);
    }
  };

  useEffect(() => {
    return () => {
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, []);

  // Export strategy report helper
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Pos,Driver,Team,Stops,Tire,Tire Health,Gap to Leader,Status"].join(",") + "\n"
      + grid.map(d => [
          d.dnf ? "DNF" : d.currentPos,
          d.name,
          TEAMS[d.teamId].name,
          d.stops,
          d.tireCompound.toUpperCase(),
          d.dnf ? "0%" : `${Math.round(d.tireHealth)}%`,
          d.dnf ? "-" : `+${d.gapToLeader.toFixed(2)}s`,
          d.dnf ? `Retired (${d.dnfReason})` : "Finished"
        ].join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ApexGP_${selectedCircuitId}_simulation_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render dynamic SVG graph of tire wear degradation
  const renderTireWearChart = () => {
    if (tireWearHistory.length < 2) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Run the simulation to see real-time tire degradation profiles.
        </div>
      );
    }

    const width = 450;
    const height = 180;
    const padding = 25;
    
    // Find lines data grouped by driver code
    const lines = {};
    tireWearHistory.forEach(tick => {
      tick.drivers.forEach(d => {
        if (!lines[d.code]) lines[d.code] = [];
        lines[d.code].push({ lap: tick.lap, wear: d.wear });
      });
    });

    const maxLaps = circuit.laps;
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="telemetry-custom-svg-chart">
        {/* Horizontal grid lines */}
        {[0, 25, 50, 75, 100].map(val => {
          const y = height - padding - (val / 100) * (height - 2 * padding);
          return (
            <g key={val}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} className="telemetry-grid-line" />
              <text x={padding - 5} y={y + 3} className="telemetry-axis-label" textAnchor="end">{val}%</text>
            </g>
          );
        })}
        {/* X Axis Laps */}
        <text x={width / 2} y={height - 2} className="telemetry-axis-label" textAnchor="middle">Race Laps</text>
        
        {/* Plot lines */}
        {Object.keys(lines).map((code, index) => {
          const points = lines[code];
          const pathD = points.map((p, i) => {
            const x = padding + (p.lap / maxLaps) * (width - 2 * padding);
            const y = height - padding - (p.wear / 100) * (height - 2 * padding);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(" ");

          const driverColor = DRIVERS.find(d => d.code === code)?.teamId === "redbull" ? "var(--f1-red)" : (index === 1 ? "var(--drs-cyan)" : "var(--telemetry-green)");

          return (
            <g key={code}>
              <path d={pathD} fill="none" stroke={driverColor} strokeWidth="2.5" filter={`drop-shadow(0 0 2px ${driverColor}88)`} />
              {/* End Label */}
              {points.length > 0 && (
                <text 
                  x={padding + (points[points.length-1].lap / maxLaps) * (width - 2 * padding) + 5} 
                  y={height - padding - (points[points.length-1].wear / 100) * (height - 2 * padding) + 3}
                  className="telemetry-axis-label"
                  style={{ fill: driverColor, fontWeight: "bold" }}
                >
                  {code}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="main-content">
      {/* Header */}
      <header className="view-header">
        <div className="header-title-section">
          <h1>Predictor Simulator</h1>
          <span className="header-subtitle">Monte Carlo strategy engine and pit window modeling</span>
        </div>
        <div className="header-actions">
          {currentLap > 0 && (
            <button className="btn btn-secondary" onClick={handleExportCSV}>
              <Download size={14} /> Export CSV
            </button>
          )}
          <button 
            className={`btn ${simRunning ? "btn-secondary" : "btn-primary"}`} 
            onClick={toggleSimulation}
          >
            {simRunning ? "Pause" : <><Play size={14} fill="white" /> Start Race</>}
          </button>
          <button className="btn btn-secondary" onClick={resetSimulation}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </header>

      {/* Simulator Layout Grid */}
      <div className="simulator-layout">
        
        {/* Left Control Panel */}
        <aside className="simulator-sidebar">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sliders size={18} style={{ color: "var(--f1-red)" }} />
            Control Parameters
          </h3>
          
          <div className="form-group">
            <label className="form-label">Circuit Select</label>
            <select 
              className="form-control" 
              value={selectedCircuitId}
              onChange={(e) => handleCircuitSelect(e.target.value)}
              disabled={simRunning || currentLap > 0}
            >
              {CIRCUITS.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.laps} Laps)</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Weather Matrix</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                type="button"
                className={`btn btn-secondary ${weather === "sunny" ? "btn-cyan" : ""}`}
                style={{ flex: 1, padding: "0.4rem" }}
                onClick={() => setWeather("sunny")}
                disabled={simRunning || currentLap > 0}
              >
                <Sun size={14} /> Sunny
              </button>
              <button 
                type="button"
                className={`btn btn-secondary ${weather === "overcast" ? "btn-cyan" : ""}`}
                style={{ flex: 1, padding: "0.4rem" }}
                onClick={() => setWeather("overcast")}
                disabled={simRunning || currentLap > 0}
              >
                <Cloud size={14} /> Cloudy
              </button>
              <button 
                type="button"
                className={`btn btn-secondary ${weather === "rain" ? "btn-cyan" : ""}`}
                style={{ flex: 1, padding: "0.4rem" }}
                onClick={() => setWeather("rain")}
                disabled={simRunning || currentLap > 0}
              >
                <CloudRain size={14} /> Rain
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Safety Car Probability</label>
            <select 
              className="form-control"
              value={safetyCarRate}
              onChange={(e) => setSafetyCarRate(e.target.value)}
              disabled={simRunning || currentLap > 0}
            >
              <option value="low">Low (1-2% / Lap)</option>
              <option value="medium">Medium (3-4% / Lap)</option>
              <option value="high">High (6-8% / Lap)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="form-label">Tire Aggression Coefficient</label>
              <span style={{ fontSize: "0.8rem", color: "var(--drs-cyan)" }}>{aggression}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              className="form-control" 
              style={{ padding: 0 }}
              value={aggression}
              onChange={(e) => setAggression(parseInt(e.target.value))}
            />
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Increases pace, speeds up compound wear.</span>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="form-label">Chassis Tire Preservation</label>
              <span style={{ fontSize: "0.8rem", color: "var(--telemetry-green)" }}>{tireManagement}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              className="form-control" 
              style={{ padding: 0 }}
              value={tireManagement}
              onChange={(e) => setTireManagement(parseInt(e.target.value))}
            />
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Reduces lap degradation rate.</span>
          </div>

          {/* Grid lineup builder */}
          <div style={{ marginTop: "1.5rem" }}>
            <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Starting Grid Lineup
            </h4>
            <div className="grid-builder-list">
              {grid.map((driver, index) => {
                const team = TEAMS[driver.teamId];
                return (
                  <div key={driver.id} className="grid-builder-item">
                    <span className="grid-builder-index">{index + 1}</span>
                    <span style={{ width: "3px", height: "18px", backgroundColor: team.color, marginRight: "0.5rem", borderRadius: "1px" }}></span>
                    <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>{driver.code}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginLeft: "0.25rem" }}>({team.name.split(" ")[0]})</span>
                    
                    <div className="grid-builder-actions">
                      <button 
                        className="btn-icon-sm" 
                        onClick={() => moveGridItem(index, "up")}
                        disabled={simRunning || currentLap > 0 || index === 0}
                      >
                        <ChevronUp size={12} />
                      </button>
                      <button 
                        className="btn-icon-sm" 
                        onClick={() => moveGridItem(index, "down")}
                        disabled={simRunning || currentLap > 0 || index === grid.length - 1}
                      >
                        <ChevronDown size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Main Panel */}
        <main className="simulator-main">
          
          {/* Top Status Header */}
          <div className="card" style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <span className="form-label" style={{ marginBottom: "0.1rem" }}>Current Lap</span>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: "800", fontStyle: "italic" }}>
                  {currentLap} <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/ {circuit.laps}</span>
                </div>
              </div>
              <div>
                <span className="form-label" style={{ marginBottom: "0.1rem" }}>Weather</span>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold", textTransform: "capitalize", display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.25rem" }}>
                  {weather === "sunny" && <Sun size={18} style={{ color: "var(--safety-yellow)" }} />}
                  {weather === "overcast" && <Cloud size={18} style={{ color: "var(--text-secondary)" }} />}
                  {weather === "rain" && <CloudRain size={18} style={{ color: "var(--drs-cyan)" }} />}
                  {weather}
                </div>
              </div>
              <div>
                <span className="form-label" style={{ marginBottom: "0.1rem" }}>Safety Car Status</span>
                <div style={{ marginTop: "0.25rem" }}>
                  {safetyCarActive ? (
                    <span className="badge badge-yellow" style={{ animation: "pulse 1s infinite" }}>⚠️ SAFETY CAR</span>
                  ) : (
                    <span className="badge badge-green">🟢 CLEAR TRACK</span>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: "right" }}>
              <span className="form-label" style={{ marginBottom: "0.1rem" }}>Circuit Type</span>
              <div style={{ fontSize: "0.9rem", color: "var(--drs-cyan)", fontWeight: "600" }}>{circuit.characteristics}</div>
            </div>
          </div>

          {/* Leaderboard and Live Charts Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            
            {/* Live Leaderboard */}
            <div className="card">
              <h3 style={{ fontSize: "1.05rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Layers size={16} /> Live Leaderboard
              </h3>
              <div style={{ maxHeight: "350px", overflowY: "auto", paddingRight: "0.25rem" }}>
                {grid.map((driver) => {
                  const team = TEAMS[driver.teamId];
                  const posClass = driver.currentPos <= 3 ? `podium-${driver.currentPos}` : "";
                  
                  return (
                    <div 
                      key={driver.id} 
                      className="driver-sim-card" 
                      style={{ 
                        opacity: driver.dnf ? 0.4 : 1,
                        borderColor: driver.dnf ? "var(--f1-red)" : "var(--border-color)"
                      }}
                    >
                      <div className={`driver-sim-position ${posClass}`}>
                        {driver.dnf ? "OUT" : driver.currentPos}
                      </div>
                      <div className="driver-team-stripe" style={{ backgroundColor: team.color }}></div>
                      <div className="driver-sim-details">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <span className="driver-sim-name">{driver.name}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{driver.flag}</span>
                        </div>
                        <div className="driver-sim-team">{team.name}</div>
                      </div>
                      
                      <div className="driver-sim-stats" style={{ textAlign: "right" }}>
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                            {driver.dnf ? (
                              <span style={{ color: "var(--f1-red)" }}>DNF</span>
                            ) : driver.currentPos === 1 ? (
                              "LEADER"
                            ) : (
                              `+${driver.gapToLeader.toFixed(2)}s`
                            )}
                          </div>
                          <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                            {!driver.dnf && `LTime: ${driver.lastLapTime ? driver.lastLapTime.toFixed(3) : "-"}`}
                          </div>
                        </div>
                        
                        {!driver.dnf && (
                          <div style={{ minWidth: "60px", textAlign: "left" }}>
                            <span 
                              className={`badge ${
                                driver.tireCompound === "soft" ? "badge-red" : 
                                driver.tireCompound === "medium" ? "badge-yellow" : 
                                driver.tireCompound === "hard" ? "badge-green" : "badge-cyan"
                              }`}
                              style={{ display: "block", textAlign: "center", fontSize: "0.65rem", padding: "0.1rem 0.25rem" }}
                            >
                              {driver.tireCompound.toUpperCase()} ({Math.round(driver.tireHealth)}%)
                            </span>
                            <span style={{ fontSize: "0.6rem", color: "var(--text-secondary)", display: "block", textAlign: "center", marginTop: "0.15rem" }}>
                              Stops: {driver.stops}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Degradation Graph & Strategy Log */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Custom SVG degradation chart */}
              <div className="card" style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <TrendingUp size={16} /> Tire Degradation Profiles
                </h3>
                <div style={{ height: "180px", marginTop: "0.5rem" }}>
                  {renderTireWearChart()}
                </div>
              </div>

              {/* Live Race Feed Logs */}
              <div className="card" style={{ height: "200px", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Info size={16} /> Strategy Log Feed
                </h3>
                <div className="live-log-container" style={{ flex: 1 }}>
                  {[...simLogs].reverse().map((log, index) => (
                    <div key={index} className="live-log-entry">
                      <span className="live-log-time">[{log.time}]</span>
                      <span className={`live-log-msg ${log.highlight ? 'highlight' : ''} ${log.danger ? 'danger' : ''} ${log.warning ? 'highlight' : ''}`}>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* AI Strategic Summary */}
          {showSummary && grid.length > 0 && !grid[0].dnf && (
            <div className="card red-indicator" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderLeft: "4px solid var(--f1-red)" }}>
              <h3 style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)" }}>
                <Sparkles size={20} style={{ color: "var(--f1-red)" }} />
                ApexAI Strategy Report: Race Review
              </h3>
              <p style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "var(--text-secondary)" }}>
                <strong>{grid[0].name}</strong> won the simulation at <strong>{circuit.name}</strong> running a <strong>{grid[0].stops}-stop strategy</strong>. 
                {weather === "rain" ? (
                  " The wet conditions heavily favored drivers with high rain adaptability. Tire compound switches to WET/INTERMEDIATE compounds were critical as standard dry tires lost substantial traction."
                ) : (
                  " The dry track surface favored low-drag tire models. Starting on mediums and switching to hard compound around the pit window proved to be the optimal path."
                )} 
                {safetyCarRate === "high" && " The high frequency of Safety Cars packed the grid together, giving tactical advantages to constructors with faster pit lane times."}
                {" Red Bull and McLaren chassis demonstrated superior high-speed corner aero efficiency throughout the simulation runs."}
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
