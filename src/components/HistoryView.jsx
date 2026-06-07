import { useState, useEffect } from "react";
import { 
  Search, 
  UserCheck, 
  Globe, 
  Database,
  Cpu,
  Code
} from "lucide-react";
import { DRIVERS, TEAMS, STANDINGS_2024, STANDINGS_2025, getWeatherDetails } from "../data/f1Data";

const DRIVER_ID_MAP = {
  "verstappen": "max_verstappen",
  "max_verstappen": "max_verstappen",
  "hamilton": "hamilton",
  "leclerc": "leclerc",
  "norris": "norris",
  "piastri": "piastri",
  "sainz": "sainz",
  "russell": "russell",
  "antonelli": "antonelli",
  "perez": "perez",
  "alonso": "alonso",
  "stroll": "stroll",
  "albon": "albon",
  "tsunoda": "tsunoda",
  "hadjar": "hadjar",
  "gasly": "gasly",
  "doohan": "doohan",
  "hulkenberg": "hulkenberg",
  "bortoleto": "bortoleto",
  "ocon": "ocon",
  "bearman": "bearman",
  "lawson": "lawson",
  "liam_lawson": "lawson",
  "colapinto": "colapinto",
  "franco_colapinto": "colapinto",
  "bottas": "bottas",
  "valtteri_bottas": "bottas",
  "alexander_albon": "albon",
  "alex_albon": "albon",
  "nico_hulkenberg": "hulkenberg",
  "sergio_perez": "perez",
  "kimi_antonelli": "antonelli",
  "andrea_kimi_antonelli": "antonelli",
  "magnussen": "magnussen",
  "kevin_magnussen": "magnussen",
  "sargeant": "sargeant",
  "logan_sargeant": "sargeant",
  "ricciardo": "ricciardo",
  "daniel_ricciardo": "ricciardo",
  "zhou": "zhou",
  "guanyu_zhou": "zhou",
  "vettel": "vettel",
  "sebastian_vettel": "vettel",
  "raikkonen": "raikkonen",
  "kimi_raikkonen": "raikkonen"
};

const DRIVER_CAREER_STATS = {
  "max_verstappen": { starts: 238, wins: 71, podiums: 128, poles: 48, points: 3487.5, titles: 4, fastestLaps: 37, teams: ["Toro Rosso", "Red Bull Racing"] },
  "hamilton": { starts: 385, wins: 105, podiums: 204, poles: 104, points: 5090.5, titles: 7, fastestLaps: 68, teams: ["McLaren", "Mercedes", "Ferrari"] },
  "leclerc": { starts: 176, wins: 8, podiums: 52, poles: 27, points: 1747.0, titles: 0, fastestLaps: 11, teams: ["Sauber", "Ferrari"] },
  "norris": { starts: 156, wins: 11, podiums: 45, poles: 16, points: 1488.0, titles: 1, fastestLaps: 18, teams: ["McLaren"] },
  "piastri": { starts: 73, wins: 9, podiums: 28, poles: 6, points: 847.0, titles: 0, fastestLaps: 9, teams: ["McLaren"] },
  "sainz": { starts: 234, wins: 4, podiums: 29, poles: 6, points: 1342.5, titles: 0, fastestLaps: 4, teams: ["Toro Rosso", "Renault", "McLaren", "Ferrari", "Williams"] },
  "russell": { starts: 157, wins: 6, podiums: 26, poles: 7, points: 1121.0, titles: 0, fastestLaps: 11, teams: ["Williams", "Mercedes"] },
  "perez": { starts: 286, wins: 6, podiums: 39, poles: 3, points: 1638.0, titles: 0, fastestLaps: 12, teams: ["Sauber", "McLaren", "Force India", "Racing Point", "Red Bull Racing"] },
  "alonso": { starts: 430, wins: 32, podiums: 106, poles: 22, points: 2393.0, titles: 2, fastestLaps: 26, teams: ["Minardi", "Renault", "McLaren", "Ferrari", "Alpine", "Aston Martin"] },
  "albon": { starts: 128, wins: 0, podiums: 2, poles: 0, points: 313.0, titles: 0, fastestLaps: 1, teams: ["Toro Rosso", "Red Bull Racing", "Williams"] },
  "tsunoda": { starts: 111, wins: 0, podiums: 0, poles: 0, points: 124.0, titles: 0, fastestLaps: 1, teams: ["AlphaTauri", "RB", "Red Bull Racing"] },
  "bottas": { starts: 251, wins: 10, podiums: 67, poles: 20, points: 1797.0, titles: 0, fastestLaps: 19, teams: ["Williams", "Mercedes", "Sauber"] },
  "hulkenberg": { starts: 250, wins: 0, podiums: 1, poles: 1, points: 622.0, titles: 0, fastestLaps: 2, teams: ["Williams", "Force India", "Sauber", "Renault", "Racing Point", "Aston Martin", "Haas"] },
  "ocon": { starts: 180, wins: 1, podiums: 4, poles: 0, points: 484.0, titles: 0, fastestLaps: 1, teams: ["Manor", "Force India", "Racing Point", "Renault", "Alpine", "Haas"] },
  "gasly": { starts: 177, wins: 1, podiums: 5, poles: 0, points: 458.0, titles: 0, fastestLaps: 3, teams: ["Toro Rosso", "Red Bull Racing", "AlphaTauri", "Alpine"] },
  "stroll": { starts: 194, wins: 0, podiums: 3, poles: 1, points: 325.0, titles: 0, fastestLaps: 0, teams: ["Williams", "Racing Point", "Aston Martin"] },
  "magnussen": { starts: 185, wins: 0, podiums: 1, poles: 1, points: 202.0, titles: 0, fastestLaps: 3, teams: ["McLaren", "Renault", "Haas"] },
  "ricciardo": { starts: 257, wins: 8, podiums: 32, poles: 3, points: 1329.0, titles: 0, fastestLaps: 17, teams: ["HRT", "Toro Rosso", "Red Bull Racing", "Renault", "McLaren", "AlphaTauri", "RB"] },
  "colapinto": { starts: 26, wins: 0, podiums: 0, poles: 0, points: 5.0, titles: 0, fastestLaps: 0, teams: ["Williams", "Alpine"] },
  "lawson": { starts: 35, wins: 0, podiums: 0, poles: 0, points: 44.0, titles: 0, fastestLaps: 0, teams: ["AlphaTauri", "RB", "Red Bull Racing"] },
  "bortoleto": { starts: 24, wins: 0, podiums: 0, poles: 0, points: 19.0, titles: 0, fastestLaps: 0, teams: ["Sauber"] },
  "antonelli": { starts: 24, wins: 0, podiums: 3, poles: 0, points: 150.0, titles: 0, fastestLaps: 0, teams: ["Mercedes"] },
  "bearman": { starts: 27, wins: 0, podiums: 0, poles: 0, points: 48.0, titles: 0, fastestLaps: 0, teams: ["Ferrari", "Haas"] },
  "doohan": { starts: 7, wins: 0, podiums: 0, poles: 0, points: 0.0, titles: 0, fastestLaps: 0, teams: ["Alpine"] },
  "hadjar": { starts: 23, wins: 0, podiums: 1, poles: 0, points: 51.0, titles: 0, fastestLaps: 0, teams: ["RB"] }
};

const getPitDetails = (driverNumber, rank, status, raceName, season, round, weather) => {
  const nameLower = (raceName || "").toLowerCase();
  
  // 1. Pit lane transit loss delta by circuit
  let pitLaneDelta = 21.0; 
  if (nameLower.includes("monaco")) pitLaneDelta = 19.5;
  else if (nameLower.includes("silverstone")) pitLaneDelta = 18.0;
  else if (nameLower.includes("monza")) pitLaneDelta = 21.0;
  else if (nameLower.includes("spa")) pitLaneDelta = 20.0;
  else if (nameLower.includes("suzuka")) pitLaneDelta = 20.5;
  else if (nameLower.includes("singapore")) pitLaneDelta = 24.0;
  else if (nameLower.includes("belgian")) pitLaneDelta = 20.0;
  else if (nameLower.includes("british")) pitLaneDelta = 18.0;
  else if (nameLower.includes("italian")) pitLaneDelta = 21.0;
  else if (nameLower.includes("japanese")) pitLaneDelta = 20.5;
  
  const isRetired = status && status !== "Finished" && !status.startsWith("+");
  const dSeed = (parseInt(driverNumber) || rank) + parseInt(season) + parseInt(round);
  
  let stops;
  const stopRoll = dSeed % 100;
  
  if (weather === "Rainy") {
    stops = (stopRoll < 40) ? 2 : 3; 
  } else {
    if (nameLower.includes("monaco") || nameLower.includes("monza")) {
      stops = (stopRoll < 15) ? 2 : 1;
    } else {
      stops = (stopRoll < 60) ? 2 : 1; 
    }
  }
  
  if (isRetired) {
    stops = (dSeed % 3 === 0) ? 0 : 1;
  }
  
  if (stops === 0) {
    return { stops: 0, loss: "0.0s", pitLaneDelta };
  }
  
  let totalStopDuration = 0;
  for (let i = 0; i < stops; i++) {
    const stopSeed = dSeed + i * 7;
    const workRoll = stopSeed % 100;
    let stopTime;
    
    if (workRoll < 5) {
      stopTime = 5.0 + (workRoll % 5) * 1.5; 
    } else if (workRoll < 20) {
      stopTime = 3.2 + (workRoll % 10) * 0.1; 
    } else {
      stopTime = 2.1 + (workRoll % 10) * 0.08; 
    }
    totalStopDuration += stopTime;
  }
  
  const totalLoss = stops * pitLaneDelta + totalStopDuration;
  return {
    stops: stops,
    loss: `${totalLoss.toFixed(1)}s`,
    pitLaneDelta
  };
};


export default function HistoryView() {
  const [season, setSeason] = useState("2026");
  const [dbTab, setDbTab] = useState("drivers");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Historical Standings API state
  const [apiStandings, setApiStandings] = useState(null);
  const [loadingStandings, setLoadingStandings] = useState(false);
  const [errorStandings, setErrorStandings] = useState("");

  // GP Results states
  const [racesList, setRacesList] = useState([]);
  const [selectedRound, setSelectedRound] = useState("");
  const [sessionTab, setSessionTab] = useState("race"); // race or qualifying
  const [sessionResults, setSessionResults] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [errorSession, setErrorSession] = useState("");
  
  // Head-to-Head Comparison States
  const [driverAId, setDriverAId] = useState("verstappen");
  const [driverBId, setDriverBId] = useState("leclerc");

  // Driver Dynamic Profile Modal States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [driverProfileData, setDriverProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState("");

  // Map local driver IDs or raw names to Ergast/Jolpi.ca driver IDs
  const getErgastDriverId = (idOrName) => {
    if (!idOrName) return "";
    
    const normalized = idOrName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    
    if (DRIVER_ID_MAP[normalized]) {
      return DRIVER_ID_MAP[normalized];
    }
    
    const snakeCase = normalized.replace(/\s+/g, "_");
    if (DRIVER_ID_MAP[snakeCase]) {
      return DRIVER_ID_MAP[snakeCase];
    }
    
    const parts = normalized.split(/\s+/);
    const lastName = parts[parts.length - 1];
    if (DRIVER_ID_MAP[lastName]) {
      return DRIVER_ID_MAP[lastName];
    }
    
    return lastName;
  };

  const fetchDriverProfile = async (driverId) => {
    setLoadingProfile(true);
    setErrorProfile("");
    setDriverProfileData(null);
    setIsProfileModalOpen(true);

    const apiDriverId = getErgastDriverId(driverId);
    
    // API Endpoints for 2026 differences and profile
    const isModern = season === "2026";
    const profileUrl = `https://api.jolpi.ca/ergast/f1/drivers/${apiDriverId}.json`;
    const standings2026Url = `https://api.jolpi.ca/ergast/f1/2026/drivers/${apiDriverId}/driverStandings.json`;
    const results2026Url = `https://api.jolpi.ca/ergast/f1/2026/drivers/${apiDriverId}/results.json`;
    const poles2026Url = `https://api.jolpi.ca/ergast/f1/2026/drivers/${apiDriverId}/qualifying.json?position=1&limit=1`;
    
    // For past seasons, query team info pin-pointed
    const pastSeasonUrl = !isModern ? `https://api.jolpi.ca/ergast/f1/${season}/drivers/${apiDriverId}/driverStandings.json` : null;

    try {
      const requests = [
        fetch(profileUrl),
        fetch(standings2026Url),
        fetch(results2026Url),
        fetch(poles2026Url)
      ];
      if (pastSeasonUrl) {
        requests.push(fetch(pastSeasonUrl));
      }

      const responses = await Promise.all(requests);
      
      for (const res of responses) {
        if (!res.ok) throw new Error("データの取得に失敗しました。");
      }

      const jsonPromises = responses.map(r => r.json());
      const data = await Promise.all(jsonPromises);

      const profileData = data[0];
      const standings2026Data = data[1];
      const results2026Data = data[2];
      const poles2026Data = data[3];
      const pastSeasonData = pastSeasonUrl ? data[4] : null;

      const driverObj = profileData.MRData.DriverTable.Drivers[0];
      if (!driverObj) throw new Error("ドライバー情報が見つかりませんでした。");

      // 1. Gather 2026 Delta wins and points
      let wins2026 = 0;
      let points2026 = 0.0;
      try {
        const standingsList = standings2026Data.MRData.StandingsTable.StandingsLists[0];
        const standing = standingsList && standingsList.DriverStandings && standingsList.DriverStandings[0];
        if (standing) {
          wins2026 = parseInt(standing.wins) || 0;
          points2026 = parseFloat(standing.points) || 0.0;
        }
      } catch (err) {
        console.warn("2026 standings parsing error:", err);
      }

      // 2. Gather 2026 Delta starts, podiums, and team
      let starts2026 = 0;
      let podiums2026 = 0;
      let fastestLaps2026 = 0;
      let team2026 = "";
      try {
        const races2026 = results2026Data.MRData.RaceTable.Races || [];
        starts2026 = parseInt(results2026Data.MRData.total) || races2026.length;
        races2026.forEach(race => {
          const res = race.Results && race.Results[0];
          if (res) {
            const pos = res.position;
            if (pos === "1" || pos === "2" || pos === "3") {
              podiums2026++;
            }
            if (res.FastestLap && res.FastestLap.rank === "1") {
              fastestLaps2026++;
            }
            if (!team2026 && res.Constructor) {
              team2026 = res.Constructor.name;
            }
          }
        });
      } catch (err) {
        console.warn("2026 results parsing error:", err);
      }

      // 3. Gather 2026 Delta poles
      let poles2026 = 0;
      try {
        poles2026 = parseInt(poles2026Data.MRData.total) || 0;
      } catch (err) {
        console.warn("2026 poles parsing error:", err);
      }

      // Resolve team based on active season
      let currentTeam = "F1 Driver";
      if (pastSeasonData) {
        try {
          const standingsList = pastSeasonData.MRData.StandingsTable.StandingsLists[0];
          const standing = standingsList && standingsList.DriverStandings && standingsList.DriverStandings[0];
          if (standing && standing.Constructors && standing.Constructors[0]) {
            currentTeam = standing.Constructors[0].name;
          }
        } catch (err) {
          console.warn("Past season parsing error:", err);
        }
      } else {
        if (team2026) {
          currentTeam = team2026;
        } else {
          const localDriver = DRIVERS.find(d => d.id === driverId);
          if (localDriver && TEAMS[localDriver.teamId]) {
            currentTeam = TEAMS[localDriver.teamId].name;
          }
        }
      }

      // Merge with 2025 Career Stats Baseline
      const baseline = DRIVER_CAREER_STATS[apiDriverId] || { starts: 0, wins: 0, podiums: 0, poles: 0, points: 0.0, titles: 0, fastestLaps: 0, teams: [] };
      const totalRaces = baseline.starts + starts2026;
      const totalWins = baseline.wins + wins2026;
      const totalPodiums = baseline.podiums + podiums2026;
      const totalPoles = baseline.poles + poles2026;
      const totalPoints = parseFloat((baseline.points + points2026).toFixed(1));
      const totalTitles = baseline.titles;
      const totalFastestLaps = baseline.fastestLaps + fastestLaps2026;

      // Update teams array with currentTeam if not already included
      const allTeams = [...(baseline.teams || [])];
      if (currentTeam && currentTeam !== "F1 Driver" && !allTeams.includes(currentTeam)) {
        allTeams.push(currentTeam);
      }

      // Calculate Age
      let age = null;
      if (driverObj.dateOfBirth) {
        const birthDate = new Date(driverObj.dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      setDriverProfileData({
        givenName: driverObj.givenName,
        familyName: driverObj.familyName,
        fullName: `${driverObj.givenName} ${driverObj.familyName}`,
        dateOfBirth: driverObj.dateOfBirth,
        age: age,
        nationality: driverObj.nationality,
        permanentNumber: driverObj.permanentNumber || "N/A",
        code: driverObj.code || "N/A",
        wikipediaUrl: driverObj.url,
        totalRaces,
        totalWins,
        totalPodiums,
        totalPoles,
        totalPoints,
        totalTitles,
        totalFastestLaps,
        teams: allTeams,
        currentTeam
      });

    } catch (err) {
      console.error("Failed to fetch driver career stats:", err);
      setErrorProfile(err.message || "データの読み込み中にエラーが発生しました。");
    } finally {
      setLoadingProfile(false);
    }
  };

  // API demo state
  const [apiEndpoint, setApiEndpoint] = useState("drivers");
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  const driverA = DRIVERS.find(d => d.id === driverAId);
  const driverB = DRIVERS.find(d => d.id === driverBId);
  const selectedRace = racesList.find(r => r.round === selectedRound);

  // Filter standings based on search query
  const getFilteredStandings = () => {
    const list = apiStandings || [];
    return list.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.team && item.team.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // Pull standings for selected season/tab from api.jolpi.ca
  useEffect(() => {
    const fetchStandings = async () => {
      setLoadingStandings(true);
      setErrorStandings("");
      
      const isDriver = dbTab === "drivers";
      const endpoint = isDriver ? "driverStandings" : "constructorStandings";
      const url = `https://api.jolpi.ca/ergast/f1/${season}/${endpoint}.json`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP status: ${res.status}`);
        const data = await res.json();
        
        const standingsList = data.MRData.StandingsTable.StandingsLists[0];
        if (!standingsList) {
          throw new Error("No standings records found.");
        }

        let mapped = [];
        if (isDriver) {
          const standings = standingsList.DriverStandings || [];
          mapped = standings.map(item => ({
            rank: parseInt(item.position),
            name: `${item.Driver.givenName} ${item.Driver.familyName}`,
            team: item.Constructors && item.Constructors[0] ? item.Constructors[0].name : "N/A",
            wins: parseInt(item.wins) || 0,
            points: parseFloat(item.points) || 0
          }));
        } else {
          const standings = standingsList.ConstructorStandings || [];
          mapped = standings.map(item => ({
            rank: parseInt(item.position),
            name: item.Constructor.name,
            wins: parseInt(item.wins) || 0,
            points: parseFloat(item.points) || 0
          }));
        }

        setApiStandings(mapped);
      } catch (err) {
        console.error("API standings pull failure:", err);
        // Fallback to offline pre-loaded records
        if (season === "2025" || season === "2024") {
          const fallbackSource = season === "2025" ? STANDINGS_2025 : STANDINGS_2024;
          const fallbackList = isDriver ? fallbackSource.drivers : fallbackSource.constructors;
          setApiStandings(fallbackList);
        } else {
          setErrorStandings(`Failed to fetch standings: ${err.message}.`);
          setApiStandings([]);
        }
      } finally {
        setLoadingStandings(false);
      }
    };

    fetchStandings();
  }, [season, dbTab]);

  // Pull GP Schedule (races list) when season changes
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const res = await fetch(`https://api.jolpi.ca/ergast/f1/${season}.json`);
        if (!res.ok) throw new Error(`HTTP status: ${res.status}`);
        const data = await res.json();
        const races = data.MRData.RaceTable.Races || [];
        const mapped = races.map(r => ({
          round: r.round,
          name: r.raceName,
          circuit: r.Circuit.circuitName,
          date: r.date
        }));
        setRacesList(mapped);
        if (mapped.length > 0) {
          setSelectedRound(mapped[0].round);
        } else {
          setSelectedRound("");
        }
      } catch (err) {
        console.error("Races schedule fetch failure:", err);
        setRacesList([]);
        setSelectedRound("");
      }
    };

    fetchRaces();
  }, [season]);

  // Pull individual session/results (Qualy/Race)
  useEffect(() => {
    if (!selectedRound || dbTab !== "races") {
      return;
    }

    const fetchSessionResults = async () => {
      setLoadingSession(true);
      setErrorSession("");
      
      const isRace = sessionTab === "race";
      const isQualy = sessionTab === "qualifying";
      const isPractice = sessionTab === "fp1" || sessionTab === "fp2" || sessionTab === "fp3";
      const isModern = parseInt(season) >= 2023;

      // Modern Practice Sessions (FP1/2/3) -> Pull actual timing classifications from OpenF1
      if (isPractice && isModern) {
        try {
          const sessionNameMap = { fp1: "Practice 1", fp2: "Practice 2", fp3: "Practice 3" };
          const sessionName = sessionNameMap[sessionTab];
          
          const currentRace = racesList.find(r => r.round === selectedRound);
          if (!currentRace) throw new Error("GP round details not found.");
          const locality = currentRace.name.replace(" Grand Prix", "").replace("GP", "").trim();

          const sessionUrl = `https://api.openf1.org/v1/sessions?year=${season}&session_name=${encodeURIComponent(sessionName)}`;
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

          // Fetch driver list and lap times concurrently
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
            // Filter out pit outlaps or bugged timing sheets (must be > 45s)
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
            
            // Reconstruct full driver names from local database mapping if matching initials
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
          const finalMapped = mappedList.map((d, index) => {
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

          setSessionResults(finalMapped);
          setLoadingSession(false);
          return;
        } catch (err) {
          console.warn("OpenF1 live fetch failed, falling back to simulated data:", err);
          // Fall through to standard simulation
        }
      }

      // Default Jolpica/Ergast API queries (Race / Qualy / Simulated Practice fallback)
      const endpoint = isRace ? "results" : "qualifying";
      const url = `https://api.jolpi.ca/ergast/f1/${season}/${selectedRound}/${endpoint}.json`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP status: ${res.status}`);
        const data = await res.json();
        
        const raceData = data.MRData.RaceTable.Races[0];
        if (!raceData) {
          throw new Error(`No data found for Round ${selectedRound}.`);
        }

        let mapped = [];
        if (isRace) {
          const results = raceData.Results || [];
          mapped = results.map(item => ({
            rank: parseInt(item.position),
            number: item.number,
            name: `${item.Driver.givenName} ${item.Driver.familyName}`,
            team: item.Constructor.name,
            grid: item.grid,
            laps: item.laps,
            status: item.status,
            time: item.Time ? item.Time.time : "-",
            fastestLap: item.FastestLap && item.FastestLap.Time ? item.FastestLap.Time.time : "-"
          }));
        } else if (isQualy) {
          const results = raceData.QualifyingResults || [];
          mapped = results.map(item => ({
            rank: parseInt(item.position),
            number: item.number,
            name: `${item.Driver.givenName} ${item.Driver.familyName}`,
            team: item.Constructor.name,
            q1: item.Q1 || "-",
            q2: item.Q2 || "-",
            q3: item.Q3 || "-"
          }));
        } else {
          // FP1, FP2, FP3 - Generate practice rankings using qualifying list
          const results = raceData.QualifyingResults || [];
          
          const fpIndexMultiplier = sessionTab === "fp1" ? 3 : sessionTab === "fp2" ? 7 : 11;
          const sorted = [...results].sort((a, b) => {
            const valA = parseInt(a.position) + (parseInt(a.number) % fpIndexMultiplier);
            const valB = parseInt(b.position) + (parseInt(b.number) % fpIndexMultiplier);
            return valA - valB;
          });

          // Differentiate baseline speed by session (FP1 slowest, FP3 fastest practice)
          let sessionOffset = 1.8;
          if (sessionTab === "fp2") sessionOffset = 1.1;
          else if (sessionTab === "fp3") sessionOffset = 0.6;

          let baseSec = 80.0;
          const firstQ1 = results[0]?.Q1;
          if (firstQ1 && firstQ1.includes(":")) {
            const [m, s] = firstQ1.split(":");
            baseSec = parseInt(m) * 60 + parseFloat(s) + sessionOffset;
          }

          mapped = sorted.map((item, index) => {
            const driverSeed = parseInt(item.number) || index;
            // Generate minor session variance per driver so leader times and orders aren't identical across sessions
            const sessionVar = (((driverSeed + fpIndexMultiplier) % 9) - 4.5) * 0.06;
            
            const gap = index === 0 ? 0.0 : index * 0.12 + (driverSeed % 5) * 0.07 + sessionVar;
            const lapTimeSec = baseSec + gap + (index === 0 ? sessionVar : 0);
            
            const min = Math.floor(lapTimeSec / 60);
            const sec = (Math.abs(lapTimeSec) % 60).toFixed(3);
            const timeStr = `${min}:${sec.padStart(6, "0")}`;

            return {
              rank: index + 1,
              number: item.number,
              name: `${item.Driver.givenName} ${item.Driver.familyName}`,
              team: item.Constructor.name,
              bestLap: timeStr,
              gap: index === 0 ? "LEADER" : `+${gap.toFixed(3)}s`,
              laps: 14 + (driverSeed % 15) // 14 to 28 laps
            };
          });
        }
        setSessionResults(mapped);
      } catch (err) {
        console.error("Session results fetch failure:", err);
        setErrorSession(`Failed to fetch session results: ${err.message}`);
        setSessionResults([]);
      } finally {
        setLoadingSession(false);
      }
    };

    fetchSessionResults();
  }, [season, selectedRound, sessionTab, dbTab, racesList]);

  // Run a real dynamic API fetch to OpenF1 (no auth required!)
  const handleFetchOpenF1Data = async () => {
    setApiLoading(true);
    setApiResponse(null);
    try {
      let url = "";
      if (apiEndpoint === "drivers") {
        // Fetch details of driver #1 (Verstappen) in the latest session
        url = "https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158";
      } else if (apiEndpoint === "sessions") {
        // Fetch sessions in 2024
        url = "https://api.openf1.org/v1/sessions?year=2024&country_name=Monaco";
      } else {
        // Fetch telemetry samples (limited to 5 records for performance)
        url = "https://api.openf1.org/v1/car_data?driver_number=1&session_key=9158&limit=5";
      }

      const res = await fetch(url);
      const data = await res.json();
      setApiResponse(data);
    } catch (err) {
      setApiResponse({ error: "Failed to fetch from OpenF1 API. Environment connection error.", details: err.message });
    } finally {
      setApiLoading(false);
    }
  };

  const getComparisonResult = (stat) => {
    if (!driverA || !driverB) return "";
    const valA = driverA[stat];
    const valB = driverB[stat];
    if (valA > valB) return "left";
    if (valB > valA) return "right";
    return "draw";
  };

  const filteredStandings = getFilteredStandings();

  return (
    <div className="main-content">
      {/* Header */}
      <header className="view-header">
        <div className="header-title-section">
          <h1>Database & H2H</h1>
          <span className="header-subtitle">Historical records, head-to-head metrics, and OpenF1 API connectors</span>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Left Side: Historical Standings Database */}
        <div className="col-7">
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* Filter controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Database size={20} style={{ color: "var(--f1-red)" }} />
                Championship Archives
              </h2>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select 
                  className="form-control" 
                  style={{ width: "120px", padding: "0.3rem 0.5rem" }}
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                >
                  {Array.from({ length: 27 }, (_, i) => (2026 - i).toString()).map(y => (
                    <option key={y} value={y}>{y} Season</option>
                  ))}
                </select>

                <div style={{ display: "flex", gap: "0.25rem", border: "1px solid var(--border-color)", borderRadius: "0.375rem", padding: "0.15rem" }}>
                  <button 
                    className="btn" 
                    style={{ padding: "0.2rem 0.5rem", fontSize: "0.7rem", backgroundColor: dbTab === "drivers" ? "var(--f1-red)" : "transparent", color: dbTab === "drivers" ? "white" : "var(--text-secondary)" }}
                    onClick={() => { setDbTab("drivers"); setSessionResults(null); }}
                  >
                    Drivers
                  </button>
                  <button 
                    className="btn" 
                    style={{ padding: "0.2rem 0.5rem", fontSize: "0.7rem", backgroundColor: dbTab === "constructors" ? "var(--f1-red)" : "transparent", color: dbTab === "constructors" ? "white" : "var(--text-secondary)" }}
                    onClick={() => { setDbTab("constructors"); setSessionResults(null); }}
                  >
                    Teams
                  </button>
                  <button 
                    className="btn" 
                    style={{ padding: "0.2rem 0.5rem", fontSize: "0.7rem", backgroundColor: dbTab === "races" ? "var(--f1-red)" : "transparent", color: dbTab === "races" ? "white" : "var(--text-secondary)" }}
                    onClick={() => { setDbTab("races"); setSessionResults(null); }}
                  >
                    GP Results
                  </button>
                </div>
              </div>
            </div>

            {/* GP selector if tab is races */}
            {dbTab === "races" && racesList.length > 0 && (
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
                <div style={{ flex: 1, minWidth: "180px" }}>
                  <span className="form-label" style={{ fontSize: "0.7rem", marginBottom: "0.25rem" }}>Select Grand Prix</span>
                  <select 
                    className="form-control"
                    value={selectedRound}
                    onChange={(e) => setSelectedRound(e.target.value)}
                  >
                    {racesList.map(r => (
                      <option key={r.round} value={r.round}>Round {r.round}: {r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="form-label" style={{ fontSize: "0.7rem", marginBottom: "0.25rem" }}>Select Session</span>
                  <div style={{ display: "flex", gap: "0.25rem", border: "1px solid var(--border-color)", borderRadius: "0.375rem", padding: "0.15rem", height: "38px", alignItems: "center" }}>
                    <button 
                      className="btn" 
                      style={{ padding: "0.2rem 0.5rem", height: "100%", fontSize: "0.7rem", backgroundColor: sessionTab === "race" ? "var(--f1-red)" : "transparent", color: sessionTab === "race" ? "white" : "var(--text-secondary)" }}
                      onClick={() => setSessionTab("race")}
                    >
                      決勝 (Race)
                    </button>
                    <button 
                      className="btn" 
                      style={{ padding: "0.2rem 0.5rem", height: "100%", fontSize: "0.7rem", backgroundColor: sessionTab === "qualifying" ? "var(--f1-red)" : "transparent", color: sessionTab === "qualifying" ? "white" : "var(--text-secondary)" }}
                      onClick={() => setSessionTab("qualifying")}
                    >
                      予選 (Qualy)
                    </button>
                    <button 
                      className="btn" 
                      style={{ padding: "0.2rem 0.5rem", height: "100%", fontSize: "0.7rem", backgroundColor: sessionTab === "fp1" ? "var(--f1-red)" : "transparent", color: sessionTab === "fp1" ? "white" : "var(--text-secondary)" }}
                      onClick={() => setSessionTab("fp1")}
                    >
                      FP1
                    </button>
                    <button 
                      className="btn" 
                      style={{ padding: "0.2rem 0.5rem", height: "100%", fontSize: "0.7rem", backgroundColor: sessionTab === "fp2" ? "var(--f1-red)" : "transparent", color: sessionTab === "fp2" ? "white" : "var(--text-secondary)" }}
                      onClick={() => setSessionTab("fp2")}
                    >
                      FP2
                    </button>
                    <button 
                      className="btn" 
                      style={{ padding: "0.2rem 0.5rem", height: "100%", fontSize: "0.7rem", backgroundColor: sessionTab === "fp3" ? "var(--f1-red)" : "transparent", color: sessionTab === "fp3" ? "white" : "var(--text-secondary)" }}
                      onClick={() => setSessionTab("fp3")}
                    >
                      FP3
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Weather & Track Condition Panel */}
            {dbTab === "races" && selectedRace && (() => {
              const weatherInfo = getWeatherDetails(season, selectedRound, selectedRace.name, sessionTab);
              const pitInfo = getPitDetails(1, 1, "Finished", selectedRace.name, season, selectedRound, weatherInfo.weather);
              const getEmoji = (w) => {
                if (w === "Rainy") return "🌧️";
                if (w === "Overcast") return "☁️";
                if (w === "Partly Cloudy") return "⛅";
                return "☀️";
              };
              return (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                  gap: "0.75rem",
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "0.375rem",
                  padding: "0.75rem 1rem",
                  marginTop: "0.25rem"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>天候 (Weather)</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)" }}>
                      {getEmoji(weatherInfo.weather)} {weatherInfo.weather}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>気温 (Air Temp)</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)" }}>
                      🌡️ {weatherInfo.airTemp} °C
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>路面温度 (Track Temp)</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--safety-yellow)" }}>
                      🏎️ {weatherInfo.trackTemp} °C
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>湿度 (Humidity)</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--drs-cyan)" }}>
                      💧 {weatherInfo.humidity}%
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>ピットロス目安 (Pit Delta)</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--f1-red)" }}>
                      ⏱️ {pitInfo.pitLaneDelta.toFixed(1)}s
                    </span>
                  </div>
                </div>
              );
            })()}


            {/* F1 Data & External Resources Links */}
            {dbTab === "races" && selectedRace && (
              <div className="external-links-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "0.75rem",
                marginTop: "0.25rem"
              }}>
                {/* FIA Official Documents */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "0.375rem",
                  padding: "0.75rem 1rem",
                  gap: "0.75rem"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-primary)" }}>
                      📂 FIA Timing Archives
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                      Access official stewards' PDFs and session timing sheets for {season}.
                    </span>
                  </div>
                  <a 
                    href={`https://www.fia.com/championship/events/fia-formula-one-world-championship/season-${season}/${selectedRace.name.toLowerCase().replace(" grand prix", "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")}-grand-prix`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-cyan" 
                    style={{ padding: "0.35rem 0.65rem", fontSize: "0.7rem", textDecoration: "none", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}
                  >
                    FIA Docs ↗
                  </a>
                </div>

                {/* GP-Tempo Pace Analyzer */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "0.375rem",
                  padding: "0.75rem 1rem",
                  gap: "0.75rem"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-primary)" }}>
                      📊 GP-Tempo Pace Analyzer
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                      View interactive lap-by-lap telemetry and race pace charts.
                    </span>
                  </div>
                  <a 
                    href="https://www.gp-tempo.com"
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn" 
                    style={{ padding: "0.35rem 0.65rem", fontSize: "0.7rem", textDecoration: "none", backgroundColor: "var(--f1-red)", color: "white", display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}
                  >
                    GP-Tempo ↗
                  </a>
                </div>
              </div>
            )}

            {/* Search Input for standings tabs only */}
            {dbTab !== "races" && (
              <div style={{ position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: "10px", top: "11px", color: "var(--text-muted)" }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: "2.25rem" }} 
                  placeholder={`Search ${dbTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {/* Standings Table */}
            {/* Session / Standings Table */}
            {dbTab === "races" ? (
              <div className="table-container">
                <table className="f1-table">
                  <thead>
                    {sessionTab === "race" ? (
                      <tr>
                        <th style={{ width: "50px" }}>Pos</th>
                        <th>Driver</th>
                        <th>Constructor</th>
                        <th>Grid</th>
                        <th>Laps</th>
                        <th>Status</th>
                        <th style={{ textAlign: "center" }}>Pit Stops</th>
                        <th style={{ textAlign: "right" }}>Pit Loss</th>
                        <th style={{ textAlign: "right" }}>Total Time</th>
                        <th style={{ textAlign: "right" }}>Fastest Lap</th>
                      </tr>
                    ) : sessionTab === "qualifying" ? (
                      <tr>
                        <th style={{ width: "50px" }}>Pos</th>
                        <th>Driver</th>
                        <th>Constructor</th>
                        <th>Q1</th>
                        <th>Q2</th>
                        <th style={{ textAlign: "right" }}>Q3</th>
                      </tr>
                    ) : (
                      <tr>
                        <th style={{ width: "50px" }}>Pos</th>
                        <th>Driver</th>
                        <th>Constructor</th>
                        <th>Laps Completed</th>
                        <th>Gap to Leader</th>
                        <th style={{ textAlign: "right" }}>Best Lap Time</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {loadingSession ? (
                      <tr>
                        <td colSpan={sessionTab === "race" ? 10 : (sessionTab === "qualifying" ? 6 : 6)} style={{ textAlign: "center", color: "var(--drs-cyan)", padding: "2.5rem", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                          📡 Querying race session metrics for round {selectedRound}...
                        </td>
                      </tr>
                    ) : errorSession ? (
                      <tr>
                        <td colSpan={sessionTab === "race" ? 10 : (sessionTab === "qualifying" ? 6 : 6)} style={{ textAlign: "center", color: "var(--f1-red)", padding: "2.5rem" }}>
                          ⚠️ {errorSession}
                        </td>
                      </tr>
                    ) : sessionResults && sessionResults.length > 0 ? (() => {
                      const weatherInfo = getWeatherDetails(season, selectedRound, selectedRace?.name || "", sessionTab);
                      return sessionResults.map((row) => {
                        const pitInfo = getPitDetails(row.number, row.rank, row.status, selectedRace?.name || "", season, selectedRound, weatherInfo.weather);
                        return (
                          <tr key={row.rank}>
                            <td style={{ fontWeight: "bold", fontFamily: "var(--font-heading)" }}>P{row.rank}</td>
                            <td>
                              <div style={{ fontWeight: "600" }}>{row.name}</div>
                              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>#{row.number}</div>
                            </td>
                            <td>{row.team}</td>
                            {sessionTab === "race" ? (
                              <>
                                <td>{row.grid}</td>
                                <td>{row.laps}</td>
                                <td>
                                  <span className={`badge ${row.status === "Finished" ? "badge-green" : (row.status.includes("Accident") || row.status.includes("Collision") || row.status.includes("Spun") ? "badge-red" : "badge-yellow")}`} style={{ fontSize: "0.65rem" }}>
                                    {row.status}
                                  </span>
                                </td>
                                <td style={{ textAlign: "center", fontSize: "0.8rem" }}>{pitInfo.stops}</td>
                                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--f1-red)" }}>{pitInfo.stops > 0 ? pitInfo.loss : "-"}</td>
                                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{row.time}</td>
                                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--drs-cyan)" }}>{row.fastestLap}</td>
                              </>
                            ) : sessionTab === "qualifying" ? (
                              <>
                                <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{row.q1}</td>
                                <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{row.q2}</td>
                                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--drs-cyan)", fontWeight: "600" }}>{row.q3}</td>
                              </>
                            ) : (
                              <>
                                <td>{row.laps} laps</td>
                                <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{row.gap}</td>
                                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--drs-cyan)", fontWeight: "600" }}>{row.bestLap}</td>
                              </>
                            )}
                          </tr>
                        );
                      });
                    })() : (
                      <tr>
                        <td colSpan={sessionTab === "race" ? 10 : (sessionTab === "qualifying" ? 6 : 6)} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                          No session records retrieved.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-container">
                <table className="f1-table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>Position</th>
                      <th>Name</th>
                      {dbTab === "drivers" && <th>Team / Engine</th>}
                      <th style={{ textAlign: "right" }}>Wins</th>
                      <th style={{ textAlign: "right" }}>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingStandings ? (
                      <tr>
                        <td colSpan={dbTab === "drivers" ? 5 : 4} style={{ textAlign: "center", color: "var(--drs-cyan)", padding: "2.5rem", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                          📡 Querying Jolpica historical database for {season} standings...
                        </td>
                      </tr>
                    ) : errorStandings ? (
                      <tr>
                        <td colSpan={dbTab === "drivers" ? 5 : 4} style={{ textAlign: "center", color: "var(--f1-red)", padding: "2.5rem" }}>
                          ⚠️ {errorStandings}
                        </td>
                      </tr>
                    ) : filteredStandings.length > 0 ? (
                      filteredStandings.map((row) => {
                        const handleRowClick = () => {
                          const driverId = getErgastDriverId(row.name);
                          fetchDriverProfile(driverId);
                        };
                        return (
                          <tr key={row.rank} className="clickable-row" onClick={handleRowClick}>
                            <td style={{ fontWeight: "bold", fontFamily: "var(--font-heading)" }}>P{row.rank}</td>
                            <td style={{ fontWeight: "600" }}>{row.name}</td>
                            {dbTab === "drivers" && <td>{row.team}</td>}
                            <td style={{ textAlign: "right" }}>{row.wins}</td>
                            <td style={{ textAlign: "right", fontWeight: "700", color: "var(--drs-cyan)" }}>{row.points}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={dbTab === "drivers" ? 5 : 4} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                          No championship records matched your search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>

          {/* API Query Connector Panel */}
          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Globe size={20} style={{ color: "var(--drs-cyan)" }} />
              リアルタイム API 接続ツール
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              ApexGPはオープンソースのF1テレメトリフィードと通信します。以下のテストクエリを実行して、OpenF1エンドポイントからリアルタイムにデータを取得してみましょう。
            </p>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <select 
                className="form-control"
                style={{ flex: 1, minWidth: 0 }}
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              >
                <option value="drivers">ドライバー詳細 / Driver Details (M. Verstappen #1)</option>
                <option value="sessions">2024年 モナコGP セッション情報 / Sessions</option>
                <option value="telemetry">リアルタイムテレメトリ ログサンプル / Telemetry Log Samples</option>
              </select>
              
              <button 
                className="btn btn-cyan" 
                style={{ whiteSpace: "nowrap" }}
                onClick={handleFetchOpenF1Data}
                disabled={apiLoading}
              >
                {apiLoading ? "接続中..." : "APIに接続"}
              </button>
            </div>

            {/* Display JSON Output */}
            <div style={{ 
              backgroundColor: "#0b0c10", 
              borderRadius: "0.5rem", 
              border: "1px solid var(--border-color)", 
              padding: "1rem", 
              overflow: "auto", 
              maxHeight: "200px",
              display: "block"
            }}>
              {apiLoading ? (
                <div style={{ color: "var(--drs-cyan)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", textAlign: "center", padding: "1.5rem" }}>
                  📡 api.openf1.org への接続を確立しています...
                </div>
              ) : apiResponse ? (
                <div style={{ 
                  margin: 0, 
                  fontFamily: "var(--font-mono)", 
                  fontSize: "0.75rem", 
                  color: "#5cf59b", 
                  whiteSpace: "pre", 
                  textAlign: "left" 
                }}>
                  {JSON.stringify(apiResponse, null, 2)}
                </div>
              ) : (
                <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", height: "80px", gap: "0.5rem" }}>
                  <Code size={14} /> APIリクエストを送信して、構造化されたJSONテレメトリレコードを表示します。
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Head-to-Head Comparison */}
        <div className="col-5">
          <div className="card red-indicator" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <UserCheck size={20} style={{ color: "var(--f1-red)" }} />
              Driver H2H Compare
            </h2>

            {/* Dropdowns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <span className="form-label">Driver A (Left)</span>
                <select 
                  className="form-control"
                  value={driverAId}
                  onChange={(e) => setDriverAId(e.target.value)}
                >
                  {DRIVERS.map(d => (
                    <option key={d.id} value={d.id} disabled={d.id === driverBId}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <span className="form-label">Driver B (Right)</span>
                <select 
                  className="form-control"
                  value={driverBId}
                  onChange={(e) => setDriverBId(e.target.value)}
                >
                  {DRIVERS.map(d => (
                    <option key={d.id} value={d.id} disabled={d.id === driverAId}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profile summary headers */}
            {driverA && driverB && (
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.5fr", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid var(--border-color)", textAlign: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: "bold", fontFamily: "var(--font-heading)" }}>{driverA.name}</div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>#{driverA.number} • {TEAMS[driverA.teamId].name}</span>
                  <button onClick={() => fetchDriverProfile(driverA.id)} style={{ fontSize: "0.65rem", color: "var(--drs-cyan)", border: "none", background: "none", padding: 0, marginTop: "0.25rem", cursor: "pointer", textDecoration: "underline" }}>
                    プロフィール詳細 ↗
                  </button>
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: "900", fontStyle: "italic", color: "var(--text-muted)", fontSize: "1.5rem" }}>VS</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: "bold", fontFamily: "var(--font-heading)" }}>{driverB.name}</div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>#{driverB.number} • {TEAMS[driverB.teamId].name}</span>
                  <button onClick={() => fetchDriverProfile(driverB.id)} style={{ fontSize: "0.65rem", color: "var(--drs-cyan)", border: "none", background: "none", padding: 0, marginTop: "0.25rem", cursor: "pointer", textDecoration: "underline" }}>
                    プロフィール詳細 ↗
                  </button>
                </div>
              </div>
            )}

            {/* Driver Attribute comparison grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
              
              {/* Skill attribute */}
              <div>
                <div className="h2h-comparison-grid" style={{ padding: "0.5rem 0", borderBottom: "none" }}>
                  <div className="h2h-driver-side left">
                    <span className={`h2h-stat-value ${getComparisonResult("skill") === "left" ? "highlight-left" : ""}`}>{driverA.skill}</span>
                  </div>
                  <div className="h2h-stat-label">Overall skill</div>
                  <div className="h2h-driver-side right">
                    <span className={`h2h-stat-value ${getComparisonResult("skill") === "right" ? "highlight-right" : ""}`}>{driverB.skill}</span>
                  </div>
                </div>
                <div style={{ display: "flex", height: "4px", backgroundColor: "var(--bg-secondary)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${driverA.skill}%`, backgroundColor: "var(--f1-red)", display: "flex", justifyContent: "flex-end" }}></div>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ width: `${driverB.skill}%`, backgroundColor: "var(--drs-cyan)" }}></div>
                </div>
              </div>

              {/* Qualy Speed */}
              <div>
                <div className="h2h-comparison-grid" style={{ padding: "0.5rem 0", borderBottom: "none" }}>
                  <div className="h2h-driver-side left">
                    <span className={`h2h-stat-value ${getComparisonResult("qualySpeed") === "left" ? "highlight-left" : ""}`}>{driverA.qualySpeed}</span>
                  </div>
                  <div className="h2h-stat-label">Qualy speed</div>
                  <div className="h2h-driver-side right">
                    <span className={`h2h-stat-value ${getComparisonResult("qualySpeed") === "right" ? "highlight-right" : ""}`}>{driverB.qualySpeed}</span>
                  </div>
                </div>
                <div style={{ display: "flex", height: "4px", backgroundColor: "var(--bg-secondary)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${driverA.qualySpeed}%`, backgroundColor: "var(--f1-red)" }}></div>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ width: `${driverB.qualySpeed}%`, backgroundColor: "var(--drs-cyan)" }}></div>
                </div>
              </div>

              {/* Tire management */}
              <div>
                <div className="h2h-comparison-grid" style={{ padding: "0.5rem 0", borderBottom: "none" }}>
                  <div className="h2h-driver-side left">
                    <span className={`h2h-stat-value ${getComparisonResult("tireMgmt") === "left" ? "highlight-left" : ""}`}>{driverA.tireMgmt}</span>
                  </div>
                  <div className="h2h-stat-label">Tire management</div>
                  <div className="h2h-driver-side right">
                    <span className={`h2h-stat-value ${getComparisonResult("tireMgmt") === "right" ? "highlight-right" : ""}`}>{driverB.tireMgmt}</span>
                  </div>
                </div>
                <div style={{ display: "flex", height: "4px", backgroundColor: "var(--bg-secondary)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${driverA.tireMgmt}%`, backgroundColor: "var(--f1-red)" }}></div>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ width: `${driverB.tireMgmt}%`, backgroundColor: "var(--drs-cyan)" }}></div>
                </div>
              </div>

              {/* Overtaking skill */}
              <div>
                <div className="h2h-comparison-grid" style={{ padding: "0.5rem 0", borderBottom: "none" }}>
                  <div className="h2h-driver-side left">
                    <span className={`h2h-stat-value ${getComparisonResult("overtaking") === "left" ? "highlight-left" : ""}`}>{driverA.overtaking}</span>
                  </div>
                  <div className="h2h-stat-label">Overtaking</div>
                  <div className="h2h-driver-side right">
                    <span className={`h2h-stat-value ${getComparisonResult("overtaking") === "right" ? "highlight-right" : ""}`}>{driverB.overtaking}</span>
                  </div>
                </div>
                <div style={{ display: "flex", height: "4px", backgroundColor: "var(--bg-secondary)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${driverA.overtaking}%`, backgroundColor: "var(--f1-red)" }}></div>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ width: `${driverB.overtaking}%`, backgroundColor: "var(--drs-cyan)" }}></div>
                </div>
              </div>

              {/* Defensive skill */}
              <div>
                <div className="h2h-comparison-grid" style={{ padding: "0.5rem 0", borderBottom: "none" }}>
                  <div className="h2h-driver-side left">
                    <span className={`h2h-stat-value ${getComparisonResult("defense") === "left" ? "highlight-left" : ""}`}>{driverA.defense}</span>
                  </div>
                  <div className="h2h-stat-label">Defense rating</div>
                  <div className="h2h-driver-side right">
                    <span className={`h2h-stat-value ${getComparisonResult("defense") === "right" ? "highlight-right" : ""}`}>{driverB.defense}</span>
                  </div>
                </div>
                <div style={{ display: "flex", height: "4px", backgroundColor: "var(--bg-secondary)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${driverA.defense}%`, backgroundColor: "var(--f1-red)" }}></div>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ width: `${driverB.defense}%`, backgroundColor: "var(--drs-cyan)" }}></div>
                </div>
              </div>

              {/* Rain Performance */}
              <div>
                <div className="h2h-comparison-grid" style={{ padding: "0.5rem 0", borderBottom: "none" }}>
                  <div className="h2h-driver-side left">
                    <span className={`h2h-stat-value ${getComparisonResult("rainSkill") === "left" ? "highlight-left" : ""}`}>{driverA.rainSkill}</span>
                  </div>
                  <div className="h2h-stat-label">Rain adaptation</div>
                  <div className="h2h-driver-side right">
                    <span className={`h2h-stat-value ${getComparisonResult("rainSkill") === "right" ? "highlight-right" : ""}`}>{driverB.rainSkill}</span>
                  </div>
                </div>
                <div style={{ display: "flex", height: "4px", backgroundColor: "var(--bg-secondary)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${driverA.rainSkill}%`, backgroundColor: "var(--f1-red)" }}></div>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ width: `${driverB.rainSkill}%`, backgroundColor: "var(--drs-cyan)" }}></div>
                </div>
              </div>

            </div>

            {/* AI analysis breakdown */}
            <div style={{ backgroundColor: "var(--bg-secondary)", borderRadius: "0.5rem", padding: "1rem", border: "1px solid var(--border-color)", fontSize: "0.8rem", lineHeight: "1.5", marginTop: "1rem" }}>
              <span className="form-label" style={{ fontSize: "0.7rem", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Cpu size={12} style={{ color: "var(--f1-red)" }} />
                ApexAI 比較分析 / Compare Analysis
              </span>
              {driverA.skill > driverB.skill ? (
                <span>
                  全体のデータ上、<strong>{driverA.name}</strong>が優位に立っており、優れた一貫性を示しています。しかし、<strong>{driverB.name}</strong>も{driverB.qualySpeed >= driverA.qualySpeed ? "同等以上の予選パフォーマンス" : "優れたマイクロセクターデータ"}を維持しており、ショートラン（予選など）のスピードにおいては強力な脅威となります。
                </span>
              ) : (
                <span>
                  この対戦では、テレメトリスコア全体で<strong>{driverB.name}</strong>がリードしています。<strong>{driverA.name}</strong>が<strong>{driverB.name}</strong>の圧倒的なスピードに対抗するには、最適化されたタイヤ保存や、セーフティカー導入時のピット戦略などを最大限に活用する必要があります。
                </span>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Driver Profile Modal */}
      {isProfileModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsProfileModalOpen(false)}>
              &times;
            </button>
            
            {loadingProfile ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--drs-cyan)", fontFamily: "var(--font-mono)" }}>
                <div className="spinner" style={{ marginBottom: "1rem" }}></div>
                <div>📡 Jolpi.ca F1 データベースから最新の統計を取得中...</div>
              </div>
            ) : errorProfile ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <span style={{ fontSize: "2rem" }}>⚠️</span>
                <p style={{ color: "var(--f1-red)", marginTop: "1rem" }}>{errorProfile}</p>
                <button className="btn" style={{ marginTop: "1rem", backgroundColor: "var(--border-color)", padding: "0.5rem 1rem" }} onClick={() => setIsProfileModalOpen(false)}>閉じる</button>
              </div>
            ) : driverProfileData ? (
              <div>
                {/* Header */}
                <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>
                      {DRIVERS.find(d => d.code === driverProfileData.code)?.flag || "🏳️"}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {driverProfileData.nationality}
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: "1.25rem", fontWeight: "bold", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      #{driverProfileData.permanentNumber}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                    {driverProfileData.fullName}
                  </h2>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {driverProfileData.currentTeam}
                  </div>
                </div>

                {/* Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  {/* Bio */}
                  <div>
                    <h3 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.25rem" }}>基本情報</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>生年月日</span>
                        <span style={{ fontWeight: "600", fontSize: "0.8rem" }}>{driverProfileData.dateOfBirth}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>年齢</span>
                        <span style={{ fontWeight: "600", fontSize: "0.8rem" }}>{driverProfileData.age} 歳</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>略称 (Code)</span>
                        <span style={{ fontWeight: "600", fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--f1-red)" }}>{driverProfileData.code}</span>
                      </div>
                      
                      {/* Past Teams History */}
                      {driverProfileData.teams && driverProfileData.teams.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>過去の所属チーム</span>
                          <span style={{ fontWeight: "600", fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                            {driverProfileData.teams.join(" → ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Career Stats */}
                  <div>
                    <h3 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.25rem" }}>通算スタッツ (最新)</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {/* Championship Titles (Highlighted if > 0) */}
                      {driverProfileData.totalTitles > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "rgba(255, 214, 0, 0.08)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", border: "1px solid rgba(255, 214, 0, 0.2)" }}>
                          <span style={{ color: "var(--safety-yellow)", fontSize: "0.8rem", fontWeight: "700" }}>🏆 ワールドチャンピオン</span>
                          <span style={{ fontWeight: "800", fontSize: "0.8rem", color: "var(--safety-yellow)" }}>{driverProfileData.totalTitles}</span>
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>出走数 (Starts)</span>
                        <span style={{ fontWeight: "700", fontSize: "0.8rem" }}>{driverProfileData.totalRaces}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>優勝数 (Wins)</span>
                        <span style={{ fontWeight: "700", fontSize: "0.8rem", color: "var(--safety-yellow)" }}>{driverProfileData.totalWins}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>表彰台 (Podiums)</span>
                        <span style={{ fontWeight: "700", fontSize: "0.8rem", color: "var(--drs-cyan)" }}>{driverProfileData.totalPodiums}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>ポールポジション (Poles)</span>
                        <span style={{ fontWeight: "700", fontSize: "0.8rem", color: "var(--text-primary)" }}>{driverProfileData.totalPoles}</span>
                      </div>
                      
                      {/* Fastest Laps */}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>ファステストラップ</span>
                        <span style={{ fontWeight: "700", fontSize: "0.8rem", color: "var(--telemetry-green)" }}>{driverProfileData.totalFastestLaps}</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>累計ポイント (Points)</span>
                        <span style={{ fontWeight: "700", fontSize: "0.85rem", color: "var(--f1-red)", fontFamily: "var(--font-mono)" }}>{driverProfileData.totalPoints} pts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wiki Link */}
                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                  <a href={driverProfileData.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="btn btn-cyan" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", padding: "0.4rem 0.8rem", textDecoration: "none" }}>
                    Wikipediaで開く ↗
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
