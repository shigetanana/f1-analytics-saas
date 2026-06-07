import { useState } from "react";
import { 
  Award,
  BookOpen,
  ChevronRight,
  Send,
  Sparkles
} from "lucide-react";
import { STANDINGS_2025, STANDINGS_2024, RECENT_NEWS, TEAMS, DRIVERS, CIRCUITS, getWeatherDetails } from "../data/f1Data";

export default function DashboardView({ setActiveTab }) {
  const [standingsTab, setStandingsTab] = useState("drivers");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: "ApexAI", 
      text: "Welcome to ApexGP. I am your telemetry and race strategy assistant. Ask me anything about driver ratings, circuit characteristics, or upcoming strategy variables!",
      time: "11:09 AM"
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: "You",
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const query = chatInput.toLowerCase();
    setChatInput("");

    // Identify if the user is asking about race or session results (FP1/2/3, Qualy, Race)
    const isFp1 = query.includes("fp1") || query.includes("p1") || (query.includes("フリー走行") && query.includes("1")) || (query.includes("練習") && query.includes("1"));
    const isFp2 = query.includes("fp2") || query.includes("p2") || (query.includes("フリー走行") && query.includes("2")) || (query.includes("練習") && query.includes("2"));
    const isFp3 = query.includes("fp3") || query.includes("p3") || (query.includes("フリー走行") && query.includes("3")) || (query.includes("練習") && query.includes("3"));
    const isQualy = query.includes("qualifying") || query.includes("qualy") || query.includes("予選");
    const isRace = query.includes("race") || query.includes("results") || query.includes("決勝") || query.includes("結果") || query.includes("本戦");
    const isAnySession = isFp1 || isFp2 || isFp3 || isQualy || isRace || query.includes("フリー走行") || query.includes("練習走行");

    // Match year (2000 to 2025)
    const yearMatch = query.match(/\b(200\d|201\d|202[0-5])\b/);

    if (isAnySession && yearMatch) {
      const year = yearMatch[1];
      const sessionType = isFp1 ? "fp1" : isFp2 ? "fp2" : isFp3 ? "fp3" : isQualy ? "qualifying" : isRace ? "race" : "fp1";

      const typingId = Date.now();
      // Insert a loading message immediately
      setChatMessages(prev => [...prev, {
        id: typingId,
        sender: "ApexAI",
        text: `📡 Connecting to Jolpica API to fetch ${year} session telemetry and standings...`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      const fetchAndReply = async () => {
        try {
          // Fetch races list for the target year
          const scheduleRes = await fetch(`https://api.jolpi.ca/ergast/f1/${year}.json`);
          if (!scheduleRes.ok) throw new Error("Could not load season schedule.");
          const scheduleData = await scheduleRes.json();
          const races = scheduleData.MRData.RaceTable.Races || [];

          if (races.length === 0) {
            throw new Error(`No GP rounds found for the ${year} season.`);
          }

          // Try to match circuit/GP name from the query
          let matchedRace = null;
          for (const r of races) {
            const name = r.raceName.toLowerCase();
            const circ = r.Circuit.circuitName.toLowerCase();
            const loc = r.Circuit.Location.locality.toLowerCase();
            
            if (query.includes(name.split(" ")[0]) || query.includes(circ.split(" ")[0]) || query.includes(loc) ||
                (query.includes("モナコ") && name.includes("monaco")) ||
                (query.includes("イタリア") && name.includes("italian")) ||
                (query.includes("モンツァ") && name.includes("italian")) ||
                (query.includes("日本") && name.includes("japanese")) ||
                (query.includes("鈴鹿") && name.includes("japanese")) ||
                (query.includes("イギリス") && name.includes("british")) ||
                (query.includes("シルバーストン") && name.includes("british")) ||
                (query.includes("ベルギー") && name.includes("belgian")) ||
                (query.includes("スパ") && name.includes("belgian")) ||
                (query.includes("アブダビ") && name.includes("abu dhabi")) ||
                (query.includes("シンガポール") && name.includes("singapore")) ||
                (query.includes("バーレーン") && name.includes("bahrain")) ||
                (query.includes("オーストラリア") && name.includes("australian")) ||
                (query.includes("メルボルン") && name.includes("australian")) ||
                (query.includes("スペイン") && name.includes("spanish")) ||
                (query.includes("カナダ") && name.includes("canadian")) ||
                (query.includes("モントリオール") && name.includes("canadian")) ||
                (query.includes("オーストリア") && name.includes("austrian"))
            ) {
              matchedRace = r;
              break;
            }
          }

          // Match round number explicitly if present (e.g. "round 5", "第5戦")
          const roundMatch = query.match(/round\s*(\d+)|第\s*(\d+)\s*戦/);
          if (roundMatch) {
            const rNum = roundMatch[1] || roundMatch[2];
            const foundByRound = races.find(r => r.round === rNum);
            if (foundByRound) matchedRace = foundByRound;
          }

          // If no specific GP match, default to Round 1 or Monaco
          if (!matchedRace) {
            matchedRace = races.find(r => r.raceName.toLowerCase().includes("monaco")) || races[0];
          }

          const round = matchedRace.round;
          const gpName = matchedRace.raceName;
          
          const isRaceSession = sessionType === "race";
          const isQualySession = sessionType === "qualifying";
          
          const endpoint = isRaceSession ? "results" : "qualifying";
          const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/${endpoint}.json`;

          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP status: ${res.status}`);
          const data = await res.json();
          
          const raceData = data.MRData.RaceTable.Races[0];
          if (!raceData) {
            throw new Error(`No data available for Round ${round}`);
          }

          const weatherInfo = getWeatherDetails(year, round, gpName, sessionType);
          const getEmoji = (w) => {
            if (w === "Rainy") return "🌧️";
            if (w === "Overcast") return "☁️";
            if (w === "Partly Cloudy") return "⛅";
            return "☀️";
          };
          let replyText = `📊 **[${year} ${gpName} (Round ${round}) - ${sessionType.toUpperCase()} Results]**\n`;
          replyText += `${getEmoji(weatherInfo.weather)} Weather: **${weatherInfo.weather}** | 🌡️ Air Temp: **${weatherInfo.airTemp} °C** | 🏎️ Track Temp: **${weatherInfo.trackTemp} °C** | 💧 Humidity: **${weatherInfo.humidity}%**\n\n`;

          if (isRaceSession) {
            const results = raceData.Results || [];
            if (results.length === 0) {
              replyText += "No race classification available.";
            } else {
              replyText += "| Pos | Driver | Team | Laps | Grid | Time/Status |\n";
              replyText += "| :--- | :--- | :--- | :--- | :--- | :--- |\n";
              results.slice(0, 8).forEach(item => {
                const driverName = `${item.Driver.givenName} ${item.Driver.familyName}`;
                replyText += `| **P${item.position}** | ${driverName} | ${item.Constructor.name} | ${item.laps} | ${item.grid} | ${item.Time ? item.Time.time : item.status} |\n`;
              });
              replyText += `\n*Showing top 8 drivers. Trace full results in the Database & H2H workspace.*`;
            }
          } else if (isQualySession) {
            const results = raceData.QualifyingResults || [];
            if (results.length === 0) {
              replyText += "No qualifying classification available.";
            } else {
              replyText += "| Pos | Driver | Team | Q1 | Q2 | Q3 |\n";
              replyText += "| :--- | :--- | :--- | :--- | :--- | :--- |\n";
              results.slice(0, 8).forEach(item => {
                const driverName = `${item.Driver.givenName} ${item.Driver.familyName}`;
                replyText += `| **P${item.position}** | ${driverName} | ${item.Constructor.name} | ${item.Q1 || "-"} | ${item.Q2 || "-"} | ${item.Q3 || "-"} |\n`;
              });
              replyText += `\n*Showing top 8 drivers. Track full classification in the Database & H2H workspace.*`;
            }
          } else {
            // FP1, FP2, FP3
            let practiceResults = null;
            const isModern = parseInt(year) >= 2023;

            if (isModern) {
              try {
                const sessionNameMap = { fp1: "Practice 1", fp2: "Practice 2", fp3: "Practice 3" };
                const sessionName = sessionNameMap[sessionType];
                const locality = gpName.replace(" Grand Prix", "").replace("GP", "").trim();

                const sessionUrl = `https://api.openf1.org/v1/sessions?year=${year}&session_name=${encodeURIComponent(sessionName)}`;
                const sessionRes = await fetch(sessionUrl);
                if (!sessionRes.ok) throw new Error("OpenF1 sessions API connection failed.");
                const sessions = await sessionRes.json();

                let targetSession = sessions.find(s => 
                  s.location.toLowerCase().includes(locality.toLowerCase()) ||
                  locality.toLowerCase().includes(s.location.toLowerCase()) ||
                  s.country_name.toLowerCase().includes(locality.toLowerCase())
                );
                if (!targetSession && sessions.length > 0) {
                  targetSession = sessions[0];
                }
                if (!targetSession) {
                  throw new Error(`Practice session details unavailable in OpenF1.`);
                }

                const sessionKey = targetSession.session_key;

                const [driversRes, lapsRes] = await Promise.all([
                  fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`),
                  fetch(`https://api.openf1.org/v1/laps?session_key=${sessionKey}`)
                ]);

                if (!driversRes.ok || !lapsRes.ok) throw new Error("OpenF1 timing feeds offline.");
                const [openF1Drivers, laps] = await Promise.all([driversRes.json(), lapsRes.json()]);

                const driverBestLaps = {};
                laps.forEach(lap => {
                  const num = lap.driver_number;
                  const duration = lap.lap_duration;
                  if (duration && typeof duration === "number" && duration > 45.0) {
                    if (!driverBestLaps[num] || duration < driverBestLaps[num].lapTime) {
                      driverBestLaps[num] = { lapTime: duration, lapsCompleted: 0 };
                    }
                    driverBestLaps[num].lapsCompleted += 1;
                  }
                });

                const mappedList = Object.keys(driverBestLaps).map(num => {
                  const bestInfo = driverBestLaps[num];
                  const f1Driver = openF1Drivers.find(d => d.driver_number === parseInt(num)) || {};
                  let name = f1Driver.full_name || f1Driver.broadcast_name || `Driver #${num}`;
                  if (f1Driver.broadcast_name) {
                    const parts = f1Driver.broadcast_name.split(" ");
                    const last = parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
                    const matched = DRIVERS.find(d => d.name.toLowerCase().includes(last.toLowerCase()));
                    if (matched) name = matched.name;
                  }

                  return {
                    number: num,
                    name: name,
                    team: f1Driver.team_name || "N/A",
                    bestLapSec: bestInfo.lapTime,
                    laps: bestInfo.lapsCompleted
                  };
                }).sort((a, b) => a.bestLapSec - b.bestLapSec);

                if (mappedList.length === 0) throw new Error("No timing records parsed.");

                const leaderTime = mappedList[0].bestLapSec;
                practiceResults = mappedList.map((d, index) => {
                  const gapSec = d.bestLapSec - leaderTime;
                  const min = Math.floor(d.bestLapSec / 60);
                  const sec = (d.bestLapSec % 60).toFixed(3);
                  const timeStr = `${min}:${sec.padStart(6, "0")}`;

                  return {
                    rank: index + 1,
                    number: d.number,
                    name: d.name,
                    team: d.team,
                    bestLap: timeStr,
                    gap: index === 0 ? "LEADER" : `+${gapSec.toFixed(3)}s`,
                    laps: d.laps
                  };
                });
              } catch (err) {
                console.warn("OpenF1 live chatbot fetch failed, falling back to simulation:", err);
              }
            }

            if (practiceResults) {
              replyText += "| Pos | Driver | Team | Best Lap | Gap | Laps |\n";
              replyText += "| :--- | :--- | :--- | :--- | :--- | :--- |\n";
              practiceResults.slice(0, 8).forEach(item => {
                replyText += `| **P${item.rank}** | ${item.name} | ${item.team} | ${item.bestLap} | ${item.gap} | ${item.laps} |\n`;
              });
              replyText += `\n*Showing top 8 drivers from OpenF1 live feeds. Track full telemetry in the Database & H2H workspace.*`;
            } else {
              const results = raceData.QualifyingResults || [];
              if (results.length === 0) {
                replyText += `No qualifying data available to simulate ${sessionType.toUpperCase()} practice rankings.`;
              } else {
                const fpIndexMultiplier = sessionType === "fp1" ? 3 : sessionType === "fp2" ? 7 : 11;
                const sorted = [...results].sort((a, b) => {
                  const valA = parseInt(a.position) + (parseInt(a.number) % fpIndexMultiplier);
                  const valB = parseInt(b.position) + (parseInt(b.number) % fpIndexMultiplier);
                  return valA - valB;
                });

                // Differentiate baseline speed by session (FP1 slowest, FP3 fastest practice)
                let sessionOffset = 1.8;
                if (sessionType === "fp2") sessionOffset = 1.1;
                else if (sessionType === "fp3") sessionOffset = 0.6;

                let baseSec = 80.0;
                const firstQ1 = results[0]?.Q1;
                if (firstQ1 && firstQ1.includes(":")) {
                  const [m, s] = firstQ1.split(":");
                  baseSec = parseInt(m) * 60 + parseFloat(s) + sessionOffset;
                }

                replyText += "| Pos | Driver | Team | Best Lap | Gap | Laps |\n";
                replyText += "| :--- | :--- | :--- | :--- | :--- | :--- |\n";
                sorted.slice(0, 8).forEach((item, index) => {
                  const driverName = `${item.Driver.givenName} ${item.Driver.familyName}`;
                  const driverSeed = parseInt(item.number) || index;
                  // Generate minor session variance per driver so leader times aren't identical across sessions
                  const sessionVar = (((driverSeed + fpIndexMultiplier) % 9) - 4.5) * 0.06;

                  const gap = index === 0 ? 0.0 : index * 0.12 + (driverSeed % 5) * 0.07 + sessionVar;
                  const lapTimeSec = baseSec + gap + (index === 0 ? sessionVar : 0);
                  
                  const min = Math.floor(lapTimeSec / 60);
                  const sec = (Math.abs(lapTimeSec) % 60).toFixed(3);
                  const timeStr = `${min}:${sec.padStart(6, "0")}`;
                  const gapStr = index === 0 ? "LEADER" : `+${gap.toFixed(3)}s`;
                  const completedLaps = 14 + (driverSeed % 15);

                  replyText += `| **P${index + 1}** | ${driverName} | ${item.Constructor.name} | ${timeStr} | ${gapStr} | ${completedLaps} |\n`;
                });
                replyText += `\n*Simulated practice classifications utilizing qualifying datasets (+1.6s baseline offset). Track full standings in the Database & H2H workspace.*`;
              }
            }
          }

          // Append direct link to official FIA F1 Timing Archives
          const fiaSlug = gpName.toLowerCase().replace(" grand prix", "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") + "-grand-prix";
          const fiaUrl = `https://www.fia.com/championship/events/fia-formula-one-world-championship/season-${year}/${fiaSlug}`;
          replyText += `\n\n📂 **Official FIA Timing Documents:**\nAccess official classifications, timing sheets, and stewards' decision PDFs at the [FIA F1 Archives](${fiaUrl}).`;

          setChatMessages(prev => prev.map(m => m.id === typingId ? {
            ...m,
            text: replyText
          } : m));

        } catch (err) {
          setChatMessages(prev => prev.map(m => m.id === typingId ? {
            ...m,
            text: `⚠️ **[Telemetry Query Error]**\nUnable to retrieve session data. Details: ${err.message}. Please verify the target year (${year}) and GP name.`
          } : m));
        }
      };

      fetchAndReply();
      return;
    }

    // Simulate AI response after short delay
    setTimeout(() => {
      let aiText = "I've analyzed the historical telemetry database. Try asking for specific driver stats (e.g. 'Hamilton', 'Verstappen info'), circuit specifications ('Monza GP', 'Monaco layout'), or championship standing details ('2024 standings', 'points leader').";

      // 1. Search for specific driver match
      const matchedDriver = DRIVERS.find(d => 
        query.includes(d.id.toLowerCase()) || 
        query.includes(d.name.toLowerCase()) || 
        query.includes(d.code.toLowerCase())
      );

      // 2. Search for circuit match
      const matchedCircuit = CIRCUITS.find(c => 
        query.includes(c.id.toLowerCase()) || 
        query.includes(c.name.toLowerCase().split(" ")[0])
      );

      // 3. Check for general standings queries
      const isStandingsQuery = query.includes("standing") || query.includes("points") || query.includes("順位") || query.includes("ランキング") || query.includes("ポイント") || query.includes("leader") || query.includes("チャンプ");

      if (matchedDriver) {
        const team = TEAMS[matchedDriver.teamId] || { name: "Unknown" };
        const stand2025 = STANDINGS_2025.drivers.find(d => d.name === matchedDriver.name);
        const stand2024 = STANDINGS_2024.drivers.find(d => d.name === matchedDriver.name);
        
        aiText = `📊 [Driver Profile: ${matchedDriver.name} (${matchedDriver.code})]
• Current Team: ${team.name} (Car: ${team.car || "Unknown"})
• Driver Ratings in Database:
  - Overall Skill: ${matchedDriver.skill}/100
  - Qualifying Speed: ${matchedDriver.qualySpeed}/100
  - Tire Management: ${matchedDriver.tireMgmt}/100
  - Overtaking Index: ${matchedDriver.overtaking}/100
  - Rain Adaptability: ${matchedDriver.rainSkill}/100
• Performance History:
  ${stand2025 ? `- 2025 Season: Standings P${stand2025.rank} (${stand2025.points} pts, ${stand2025.wins} wins)` : ""}
  ${stand2024 ? `- 2024 Season: Finished P${stand2024.rank} (${stand2024.points} pts, ${stand2024.wins} wins)` : ""}`;
      } 
      else if (matchedCircuit) {
        aiText = `🏁 [Circuit Specification: ${matchedCircuit.name}]
• Location: ${matchedCircuit.location}
• Laps: ${matchedCircuit.laps} Laps (Length: ${matchedCircuit.lengthKm} km)
• Characteristics: ${matchedCircuit.characteristics}
• Strategy Weights:
  - Downforce Requirement: ${matchedCircuit.downforceReq}/100
  - Power / Straight Speed demand: ${matchedCircuit.powerReq}/100
  - Lateral Tire Wear multiplier: ${matchedCircuit.tireWearRate}%
  - Overtaking Difficulty: ${matchedCircuit.overtakeDifficulty}/100
• Track Corners: ${matchedCircuit.corners.map(c => `T${c.id} ${c.name}`).join(", ")}`;
      }
      else if (isStandingsQuery) {
        const is2024 = query.includes("2024");
        const source = is2024 ? STANDINGS_2024 : STANDINGS_2025;
        const year = is2024 ? "2024" : "2025";
        
        const topD = source.drivers.slice(0, 3).map(d => `P${d.rank} ${d.name} (${d.points} pts)`).join(", ");
        const topC = source.constructors.slice(0, 3).map(c => `P${c.rank} ${c.name} (${c.points} pts)`).join(", ");
        
        aiText = `🏆 [${year} Championship Standing Summary]
• Drivers Championship Leaderboard:
  ${topD}
• Constructors Championship Leaderboard:
  ${topC}
• Use the 'Database & H2H' tab to view full historical tables.`;
      }
      else if (query.includes("tire") || query.includes("tyre") || query.includes("タイヤ") || query.includes("strategy") || query.includes("戦略") || query.includes("作戦")) {
        aiText = "Tire wear is a major strategy driver. For Silverstone, high lateral tire loads (80% wear rate) suggest a Medium-Hard two-stop strategy. For Monza, a 1-stop (Soft-Hard) is highly optimal. Check the 'Predictor Sim' tab to simulate pit stop windows!";
      }

      const aiMsg = {
        sender: "ApexAI",
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 800);
  };
  const topDrivers = STANDINGS_2025.drivers.slice(0, 5);
  const topConstructors = STANDINGS_2025.constructors.slice(0, 5);
  const leaderDriver = STANDINGS_2025.drivers[0];
  const leaderConstructor = STANDINGS_2025.constructors[0];
  const leaderTeamKey = leaderConstructor ? Object.keys(TEAMS).find(k => TEAMS[k].name === leaderConstructor.name) : null;
  const leaderEngine = leaderTeamKey ? TEAMS[leaderTeamKey].engine : "Mercedes";

  const getDriverInitialFormat = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.split(" ");
    if (parts.length <= 1) return fullName;
    return `${parts[0][0]}. ${parts[parts.length - 1]}`;
  };

  return (
    <div className="main-content">
      {/* Header */}
      <header className="view-header">
        <div className="header-title-section">
          <h1>Race Hub</h1>
          <span className="header-subtitle">Real-time telemetry and strategy simulation workspace</span>
        </div>
        <div className="header-actions">
          <div className="badge badge-red" style={{ gap: "0.25rem", padding: "0.4rem 0.8rem" }}>
            <span className="live-dot" style={{ width: "8px", height: "8px", backgroundColor: "#ff1801", borderRadius: "50%", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
            Season 2025 Active
          </div>
          <div className="badge badge-cyan" style={{ padding: "0.4rem 0.8rem" }}>
            Next: Canadian GP
          </div>
        </div>
      </header>

      {/* Grid Dashboard */}
      <div className="dashboard-grid">
        
        {/* KPI Cards */}
        <div className="col-3">
          <div className="card red-indicator">
            <span className="form-label">Drivers Leader</span>
            <h3 style={{ fontSize: "1.75rem", margin: "0.25rem 0", fontFamily: "var(--font-heading)" }}>
              {leaderDriver ? getDriverInitialFormat(leaderDriver.name) : "L. Norris"}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {leaderDriver ? `${leaderDriver.team} • ${leaderDriver.points} pts` : "McLaren • 423 pts"}
            </p>
          </div>
        </div>
        
        <div className="col-3">
          <div className="card cyan-indicator">
            <span className="form-label">Constructors Leader</span>
            <h3 style={{ fontSize: "1.75rem", margin: "0.25rem 0", fontFamily: "var(--font-heading)" }}>
              {leaderConstructor ? leaderConstructor.name : "McLaren"}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {leaderEngine} Engine • {leaderConstructor ? leaderConstructor.points : 833} pts
            </p>
          </div>
        </div>
        
        <div className="col-3">
          <div className="card">
            <span className="form-label">Strategy Success Rate</span>
            <h3 style={{ fontSize: "1.75rem", margin: "0.25rem 0", fontFamily: "var(--font-heading)", color: "var(--telemetry-green)" }}>94.2%</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Based on 1.2k simulator runs</p>
          </div>
        </div>
        
        <div className="col-3">
          <div className="card">
            <span className="form-label">Track Temperature</span>
            <h3 style={{ fontSize: "1.75rem", margin: "0.25rem 0", fontFamily: "var(--font-heading)", color: "var(--safety-yellow)" }}>42.8 °C</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Montreal, QC • Sunny</p>
          </div>
        </div>

        {/* Live News and Analysis */}
        <div className="col-8">
          <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen size={22} style={{ color: "var(--f1-red)" }} />
            Premium Analysis & Briefings
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {RECENT_NEWS.map((news) => (
              <div key={news.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="badge badge-cyan">{news.category}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{news.date} • {news.readTime}</span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "600", color: "var(--text-primary)" }}>{news.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{news.summary}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>By {news.author}</span>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}
                    onClick={() => setActiveTab(news.category.includes("Telemetry") ? "telemetry" : "predictor")}
                  >
                    Launch Telemetry <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Standings & AI Chat */}
        <div className="col-4" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Quick Standings */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Award size={22} style={{ color: "var(--f1-red)" }} /> Standings</h2>
              <div style={{ display: "flex", gap: "0.25rem", border: "1px solid var(--border-color)", borderRadius: "0.375rem", padding: "0.15rem" }}>
                <button 
                  className={`btn`} 
                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.7rem", backgroundColor: standingsTab === "drivers" ? "var(--f1-red)" : "transparent", color: standingsTab === "drivers" ? "white" : "var(--text-secondary)" }}
                  onClick={() => setStandingsTab("drivers")}
                >
                  Drivers
                </button>
                <button 
                  className={`btn`} 
                  style={{ padding: "0.2rem 0.5rem", fontSize: "0.7rem", backgroundColor: standingsTab === "constructors" ? "var(--f1-red)" : "transparent", color: standingsTab === "constructors" ? "white" : "var(--text-secondary)" }}
                  onClick={() => setStandingsTab("constructors")}
                >
                  Teams
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="f1-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>Pos</th>
                    <th>Name</th>
                    <th style={{ textAlign: "right" }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standingsTab === "drivers" ? (
                    topDrivers.map((driver) => (
                      <tr key={driver.rank}>
                        <td style={{ fontWeight: "bold" }}>{driver.rank}</td>
                        <td>
                          <div>{driver.name}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{driver.team}</div>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>{driver.points}</td>
                      </tr>
                    ))
                  ) : (
                    topConstructors.map((team) => {
                      const color = TEAMS[Object.keys(TEAMS).find(k => TEAMS[k].name === team.name)]?.color || "var(--border-color)";
                      return (
                        <tr key={team.rank}>
                          <td style={{ fontWeight: "bold" }}>{team.rank}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ width: "4px", height: "16px", backgroundColor: color, display: "inline-block", borderRadius: "2px" }}></span>
                              {team.name}
                            </div>
                          </td>
                          <td style={{ textAlign: "right", fontWeight: "600" }}>{team.points}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Assistant */}
          <div>
            <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={20} style={{ color: "var(--drs-cyan)" }} />
              ApexAI Commentary
            </h2>
            <div className="ai-chatbot-container">
              <div className="ai-chatbot-header">
                <span style={{ width: "8px", height: "8px", backgroundColor: "var(--drs-cyan)", borderRadius: "50%", display: "inline-block", boxShadow: "var(--shadow-neon-cyan)" }}></span>
                <span style={{ fontSize: "0.8rem", fontWeight: "bold", fontFamily: "var(--font-heading)", letterSpacing: "0.05em" }}>APEX STRATEGY ENGINE</span>
              </div>
              <div className="ai-chatbot-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`ai-message ${msg.sender === "You" ? "user" : "assistant"}`}>
                    <span className="ai-message-sender">{msg.sender}</span>
                    <div style={{ 
                      whiteSpace: "pre-wrap", 
                      fontFamily: msg.text.includes("|") ? "var(--font-mono)" : "inherit", 
                      fontSize: msg.text.includes("|") ? "0.72rem" : "0.85rem",
                      lineHeight: "1.4",
                      marginTop: "0.25rem"
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="ai-chatbot-input-container">
                <input 
                  type="text" 
                  className="ai-chatbot-input" 
                  placeholder="Ask about Silverstone strategy or Leclerc ratings..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="ai-chatbot-send-btn">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
