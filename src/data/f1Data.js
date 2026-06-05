// F1 ApexGP High-Fidelity Dataset

export const DRIVERS = [
  { id: "verstappen", name: "Max Verstappen", code: "VER", number: 1, teamId: "redbull", flag: "🇳🇱", skill: 98, tireMgmt: 96, overtaking: 97, defense: 96, rainSkill: 98, qualySpeed: 99 },
  { id: "hamilton", name: "Lewis Hamilton", code: "HAM", number: 44, teamId: "ferrari", flag: "🇬🇧", skill: 95, tireMgmt: 97, overtaking: 94, defense: 93, rainSkill: 97, qualySpeed: 93 },
  { id: "leclerc", name: "Charles Leclerc", code: "LEC", number: 16, teamId: "ferrari", flag: "🇲🇨", skill: 96, tireMgmt: 92, overtaking: 95, defense: 94, rainSkill: 90, qualySpeed: 99 },
  { id: "norris", name: "Lando Norris", code: "NOR", number: 4, teamId: "mclaren", flag: "🇬🇧", skill: 95, tireMgmt: 93, overtaking: 94, defense: 92, rainSkill: 92, qualySpeed: 96 },
  { id: "piastri", name: "Oscar Piastri", code: "PIA", number: 81, teamId: "mclaren", flag: "🇦🇺", skill: 93, tireMgmt: 90, overtaking: 93, defense: 93, rainSkill: 89, qualySpeed: 94 },
  { id: "sainz", name: "Carlos Sainz", code: "SAI", number: 55, teamId: "williams", flag: "🇪🇸", skill: 93, tireMgmt: 94, overtaking: 91, defense: 92, rainSkill: 91, qualySpeed: 92 },
  { id: "russell", name: "George Russell", code: "RUS", number: 63, teamId: "mercedes", flag: "🇬🇧", skill: 93, tireMgmt: 91, overtaking: 92, defense: 91, rainSkill: 93, qualySpeed: 95 },
  { id: "antonelli", name: "Kimi Antonelli", code: "ANT", number: 12, teamId: "mercedes", flag: "🇮🇹", skill: 89, tireMgmt: 87, overtaking: 91, defense: 88, rainSkill: 88, qualySpeed: 93 },
  { id: "perez", name: "Sergio Perez", code: "PER", number: 11, teamId: "redbull", flag: "🇲🇽", skill: 87, tireMgmt: 93, overtaking: 90, defense: 88, rainSkill: 86, qualySpeed: 85 },
  { id: "alonso", name: "Fernando Alonso", code: "ALO", number: 14, teamId: "astonmartin", flag: "🇪🇸", skill: 92, tireMgmt: 95, overtaking: 93, defense: 96, rainSkill: 94, qualySpeed: 90 },
  { id: "stroll", name: "Lance Stroll", code: "STR", number: 18, teamId: "astonmartin", flag: "🇨🇦", skill: 83, tireMgmt: 82, overtaking: 83, defense: 81, rainSkill: 88, qualySpeed: 82 },
  { id: "albon", name: "Alex Albon", code: "ALB", number: 23, teamId: "williams", flag: "🇹🇭", skill: 88, tireMgmt: 89, overtaking: 87, defense: 88, rainSkill: 86, qualySpeed: 89 },
  { id: "tsunoda", name: "Yuki Tsunoda", code: "TSU", number: 22, teamId: "rb", flag: "🇯🇵", skill: 88, tireMgmt: 86, overtaking: 89, defense: 87, rainSkill: 87, qualySpeed: 90 },
  { id: "hadjar", name: "Isack Hadjar", code: "HAD", number: 6, teamId: "rb", flag: "🇫🇷", skill: 83, tireMgmt: 82, overtaking: 84, defense: 81, rainSkill: 82, qualySpeed: 84 },
  { id: "gasly", name: "Pierre Gasly", code: "GAS", number: 10, teamId: "alpine", flag: "🇫🇷", skill: 87, tireMgmt: 87, overtaking: 86, defense: 86, rainSkill: 88, qualySpeed: 86 },
  { id: "doohan", name: "Jack Doohan", code: "DOO", number: 7, teamId: "alpine", flag: "🇦🇺", skill: 82, tireMgmt: 81, overtaking: 82, defense: 82, rainSkill: 80, qualySpeed: 83 },
  { id: "hulkenberg", name: "Nico Hulkenberg", code: "HUL", number: 27, teamId: "sauber", flag: "🇩🇪", skill: 87, tireMgmt: 85, overtaking: 85, defense: 86, rainSkill: 87, qualySpeed: 91 },
  { id: "bortoleto", name: "Gabriel Bortoleto", code: "BOR", number: 5, teamId: "sauber", flag: "🇧🇷", skill: 84, tireMgmt: 84, overtaking: 83, defense: 83, rainSkill: 82, qualySpeed: 84 },
  { id: "ocon", name: "Esteban Ocon", code: "OCO", number: 31, teamId: "haas", flag: "🇫🇷", skill: 87, tireMgmt: 88, overtaking: 85, defense: 89, rainSkill: 89, qualySpeed: 86 },
  { id: "bearman", name: "Oliver Bearman", code: "BEA", number: 87, teamId: "haas", flag: "🇬🇧", skill: 86, tireMgmt: 85, overtaking: 87, defense: 85, rainSkill: 85, qualySpeed: 87 }
];

export const TEAMS = {
  redbull: { id: "redbull", name: "Red Bull Racing", car: "RB21", engine: "Honda RBPT", color: "#3671c6", enginePower: 98, aeroEfficiency: 97, downforce: 96, pitstopSpeed: 98 },
  ferrari: { id: "ferrari", name: "Ferrari", car: "SF-25", engine: "Ferrari", color: "#f91536", enginePower: 97, aeroEfficiency: 95, downforce: 98, pitstopSpeed: 93 },
  mclaren: { id: "mclaren", name: "McLaren", car: "MCL39", engine: "Mercedes", color: "#f58020", enginePower: 96, aeroEfficiency: 98, downforce: 98, pitstopSpeed: 95 },
  mercedes: { id: "mercedes", name: "Mercedes AMG", car: "W16", engine: "Mercedes", color: "#27f4d2", enginePower: 96, aeroEfficiency: 94, downforce: 95, pitstopSpeed: 92 },
  astonmartin: { id: "astonmartin", name: "Aston Martin", car: "AMR25", engine: "Honda", color: "#229971", enginePower: 92, aeroEfficiency: 92, downforce: 93, pitstopSpeed: 91 },
  williams: { id: "williams", name: "Williams Racing", car: "FW47", engine: "Mercedes", color: "#37bedd", enginePower: 93, aeroEfficiency: 92, downforce: 89, pitstopSpeed: 90 },
  rb: { id: "rb", name: "Visa Cash App RB", car: "VCARB02", engine: "Honda RBPT", color: "#6692ff", enginePower: 92, aeroEfficiency: 90, downforce: 90, pitstopSpeed: 94 },
  alpine: { id: "alpine", name: "Alpine", car: "A525", engine: "Mercedes", color: "#ff87bc", enginePower: 91, aeroEfficiency: 91, downforce: 88, pitstopSpeed: 91 },
  haas: { id: "haas", name: "Haas F1 Team", car: "VF-25", engine: "Ferrari", color: "#b6babd", enginePower: 93, aeroEfficiency: 89, downforce: 88, pitstopSpeed: 89 },
  sauber: { id: "sauber", name: "Kick Sauber", car: "C45", engine: "Ferrari", color: "#52e252", enginePower: 91, aeroEfficiency: 88, downforce: 87, pitstopSpeed: 87 }
};

export const CIRCUITS = [
  {
    id: "monza",
    name: "Monza (Temple of Speed)",
    location: "🇮🇹 Italy",
    laps: 53,
    lengthKm: 5.793,
    characteristics: "Low Downforce / High Top Speed",
    downforceReq: 20, // Low
    powerReq: 98,      // Extremely high
    tireWearRate: 40,  // Low-Medium
    overtakeDifficulty: 35, // Easy
    baseLapTimeSec: 81.0, // 1:21.0
    corners: [
      { id: 1, name: "Prima Variante", type: "Chicane", speed: 80 },
      { id: 3, name: "Curva Grande", type: "High-speed sweep", speed: 290 },
      { id: 4, name: "Variante della Roggia", type: "Chicane", speed: 110 },
      { id: 7, name: "Lesmo 1", type: "Medium right", speed: 180 },
      { id: 8, name: "Lesmo 2", type: "Medium right", speed: 160 },
      { id: 10, name: "Ascari Chicane", type: "Fast complex", speed: 210 },
      { id: 11, name: "Parabolica (Curva Alboreto)", type: "Long high-speed exit", speed: 250 }
    ],
    telemetryData: {
      cornerId: 11,
      cornerName: "Parabolica (Curva Alboreto)",
      lengthMeters: 800,
      channels: {
        distance: Array.from({ length: 40 }, (_, i) => i * 20), // 0 to 800m
        driverA: {
          name: "Max Verstappen (Red Bull)",
          color: "#3671c6",
          speed: [330, 315, 290, 240, 195, 175, 172, 175, 184, 198, 215, 230, 248, 260, 275, 285, 292, 301, 308, 312, 316, 320, 323, 326, 328, 330, 331, 332, 333, 334, 334, 335, 335, 335, 336, 336, 336, 337, 337, 337],
          throttle: [100, 100, 45, 0, 0, 10, 25, 45, 60, 80, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
          brake: [0, 0, 20, 85, 95, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          rpm: [11800, 11500, 10200, 8500, 7200, 6800, 6800, 7100, 7500, 8100, 8900, 9400, 10100, 10500, 11000, 11200, 11400, 11600, 11800, 11900, 11950, 12000, 12050, 12100, 12100, 12100, 12100, 12150, 12150, 12150, 12150, 12150, 12150, 12150, 12150, 12150, 12150, 12150, 12150, 12150],
          gear: [8, 8, 7, 6, 5, 4, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
        },
        driverB: {
          name: "Charles Leclerc (Ferrari)",
          color: "#f91536",
          speed: [328, 310, 280, 230, 185, 168, 170, 176, 188, 204, 222, 238, 252, 266, 278, 288, 296, 303, 309, 314, 318, 321, 323, 325, 327, 328, 329, 330, 331, 331, 332, 332, 333, 333, 333, 334, 334, 334, 334, 334],
          throttle: [100, 100, 30, 0, 0, 15, 35, 55, 75, 95, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
          brake: [0, 0, 30, 90, 80, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          rpm: [11600, 11200, 9900, 8100, 7000, 6700, 6750, 7150, 7700, 8300, 9150, 9700, 10200, 10700, 11100, 11300, 11500, 11700, 11800, 11900, 11950, 12000, 12000, 12000, 12050, 12050, 12050, 12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100, 12100],
          gear: [8, 8, 7, 6, 5, 4, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
        }
      }
    }
  },
  {
    id: "monaco",
    name: "Monaco",
    location: "🇲🇨 Monaco",
    laps: 78,
    lengthKm: 3.337,
    characteristics: "Maximum Downforce / Street Circuit / No Overtaking",
    downforceReq: 98,
    powerReq: 40,
    tireWearRate: 30,  // Very low
    overtakeDifficulty: 98, // Impossible
    baseLapTimeSec: 72.0, // 1:12.0
    corners: [
      { id: 1, name: "Sainte Devote", type: "Right corner", speed: 110 },
      { id: 4, name: "Casino Square", type: "Right sweep", speed: 160 },
      { id: 6, name: "Grand Hotel Hairpin", type: "Tightest hairpin", speed: 45 },
      { id: 8, name: "Portier", type: "Right corner to tunnel", speed: 85 },
      { id: 9, name: "Tunnel", type: "Full throttle sweep", speed: 285 },
      { id: 10, name: "Nouvelle Chicane", type: "Slow chicane", speed: 80 },
      { id: 12, name: "Tabac", type: "High-speed left", speed: 160 },
      { id: 15, name: "Swimming Pool (Piscine)", type: "Very fast chicane", speed: 210 },
      { id: 19, name: "Anthony Noghes", type: "Right onto straight", speed: 90 }
    ],
    telemetryData: {
      cornerId: 6,
      cornerName: "Grand Hotel Hairpin",
      lengthMeters: 300,
      channels: {
        distance: Array.from({ length: 30 }, (_, i) => i * 10), // 0 to 300m
        driverA: {
          name: "Charles Leclerc (Ferrari)",
          color: "#f91536",
          speed: [150, 130, 95, 60, 48, 44, 45, 48, 55, 68, 80, 92, 105, 118, 130, 142, 150, 158, 164, 168, 172, 175, 178, 180, 181, 182, 183, 184, 184, 185],
          throttle: [100, 40, 0, 0, 0, 10, 20, 35, 55, 75, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
          brake: [0, 40, 85, 95, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          rpm: [11000, 9500, 7500, 5200, 4500, 4100, 4300, 4800, 5600, 6800, 8100, 9300, 10400, 11100, 11300, 11400, 11500, 11600, 11700, 11750, 11800, 11850, 11900, 11900, 11950, 11950, 11950, 11950, 11950, 11950],
          gear: [4, 3, 2, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
        },
        driverB: {
          name: "Max Verstappen (Red Bull)",
          color: "#3671c6",
          speed: [148, 125, 90, 58, 47, 45, 46, 49, 57, 70, 81, 91, 103, 115, 126, 137, 145, 152, 158, 163, 166, 169, 171, 173, 174, 175, 176, 177, 177, 178],
          throttle: [100, 30, 0, 0, 0, 8, 18, 32, 50, 70, 95, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
          brake: [0, 50, 90, 90, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          rpm: [10800, 9200, 7100, 5000, 4400, 4200, 4400, 4900, 5800, 7000, 8200, 9100, 10200, 10800, 11000, 11200, 11300, 11400, 11500, 11550, 11600, 11650, 11700, 11700, 11750, 11750, 11750, 11750, 11750, 11750],
          gear: [4, 3, 2, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
        }
      }
    }
  },
  {
    id: "silverstone",
    name: "Silverstone",
    location: "🇬🇧 United Kingdom",
    laps: 52,
    lengthKm: 5.891,
    characteristics: "High Downforce / Ultra High Speed Corners",
    downforceReq: 85,
    powerReq: 80,
    tireWearRate: 80,  // Very high lateral load
    overtakeDifficulty: 50, // Medium
    baseLapTimeSec: 87.0, // 1:27.0
    corners: [
      { id: 1, name: "Abbey", type: "Fast right sweep", speed: 260 },
      { id: 3, name: "Village", type: "Slow right", speed: 100 },
      { id: 4, name: "Loop", type: "Tight left hairpin", speed: 80 },
      { id: 6, name: "Brooklands", type: "Long left entry", speed: 155 },
      { id: 9, name: "Copse", type: "Blind fast right", speed: 265 },
      { id: 11, name: "Maggots", type: "Slick fast left", speed: 280 },
      { id: 12, name: "Becketts", type: "Challenging right-left", speed: 200 },
      { id: 14, name: "Chapel", type: "Exit sweep to Hangar Straight", speed: 230 },
      { id: 15, name: "Stowe", type: "Fast down-hill right", speed: 185 },
      { id: 16, name: "Club", type: "Final slow complex", speed: 90 }
    ],
    telemetryData: {
      cornerId: 9,
      cornerName: "Copse",
      lengthMeters: 500,
      channels: {
        distance: Array.from({ length: 25 }, (_, i) => i * 20), // 0 to 500m
        driverA: {
          name: "Lando Norris (McLaren)",
          color: "#f58020",
          speed: [315, 308, 290, 272, 264, 262, 265, 268, 273, 278, 283, 289, 294, 299, 303, 307, 310, 312, 314, 316, 317, 318, 319, 320, 320],
          throttle: [100, 80, 35, 10, 15, 35, 55, 75, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
          brake: [0, 0, 10, 25, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          rpm: [11800, 11400, 10500, 9800, 9500, 9400, 9600, 9800, 10200, 10600, 10900, 11200, 11400, 11600, 11700, 11800, 11900, 11950, 12000, 12000, 12000, 12050, 12050, 12050, 12050],
          gear: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
        },
        driverB: {
          name: "Max Verstappen (Red Bull)",
          color: "#3671c6",
          speed: [312, 305, 288, 270, 265, 265, 268, 271, 276, 281, 287, 292, 297, 301, 305, 308, 311, 313, 314, 315, 316, 317, 318, 319, 319],
          throttle: [100, 75, 40, 20, 25, 45, 65, 85, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
          brake: [0, 0, 5, 15, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          rpm: [11600, 11200, 10300, 9600, 9400, 9400, 9600, 9800, 10100, 10500, 10800, 11100, 11300, 11500, 11600, 11700, 11800, 11850, 11900, 11900, 11900, 11950, 11950, 11950, 11950],
          gear: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
        }
      }
    }
  }
];

export const STANDINGS_2024 = {
  drivers: [
    { rank: 1, name: "Max Verstappen", team: "Red Bull Racing", points: 437, wins: 15 },
    { rank: 2, name: "Lando Norris", team: "McLaren", points: 374, wins: 3 },
    { rank: 3, name: "Charles Leclerc", team: "Ferrari", points: 356, wins: 3 },
    { rank: 4, name: "Oscar Piastri", team: "McLaren", points: 292, wins: 2 },
    { rank: 5, name: "Carlos Sainz", team: "Ferrari", points: 272, wins: 2 },
    { rank: 6, name: "Lewis Hamilton", team: "Mercedes AMG", points: 223, wins: 2 },
    { rank: 7, name: "George Russell", team: "Mercedes AMG", points: 192, wins: 1 },
    { rank: 8, name: "Sergio Perez", team: "Red Bull Racing", points: 152, wins: 0 },
    { rank: 9, name: "Fernando Alonso", team: "Aston Martin", points: 62, wins: 0 },
    { rank: 10, name: "Nico Hulkenberg", team: "Haas F1 Team", points: 41, wins: 0 }
  ],
  constructors: [
    { rank: 1, name: "McLaren", points: 666, wins: 5 },
    { rank: 2, name: "Ferrari", points: 628, wins: 5 },
    { rank: 3, name: "Red Bull Racing", points: 589, wins: 15 },
    { rank: 4, name: "Mercedes AMG", points: 415, wins: 3 },
    { rank: 5, name: "Aston Martin", points: 86, wins: 0 },
    { rank: 6, name: "Haas F1 Team", points: 46, wins: 0 },
    { rank: 7, name: "Visa Cash App RB", points: 44, wins: 0 },
    { rank: 8, name: "Williams Racing", points: 17, wins: 0 },
    { rank: 9, name: "Alpine", points: 13, wins: 0 },
    { rank: 10, name: "Kick Sauber", points: 0, wins: 0 }
  ]
};

export const STANDINGS_2025 = {
  drivers: [
    { rank: 1, name: "Max Verstappen", team: "Red Bull Racing", points: 145, wins: 4 },
    { rank: 2, name: "Charles Leclerc", team: "Ferrari", points: 122, wins: 2 },
    { rank: 3, name: "Lando Norris", team: "McLaren", points: 118, wins: 1 },
    { rank: 4, name: "Oscar Piastri", team: "McLaren", points: 95, wins: 0 },
    { rank: 5, name: "Lewis Hamilton", team: "Ferrari", points: 88, wins: 1 },
    { rank: 6, name: "George Russell", team: "Mercedes AMG", points: 76, wins: 0 },
    { rank: 7, name: "Carlos Sainz", team: "Williams Racing", points: 58, wins: 0 },
    { rank: 8, name: "Kimi Antonelli", team: "Mercedes AMG", points: 34, wins: 0 },
    { rank: 9, name: "Fernando Alonso", team: "Aston Martin", points: 28, wins: 0 },
    { rank: 10, name: "Yuki Tsunoda", team: "Visa Cash App RB", points: 16, wins: 0 }
  ],
  constructors: [
    { rank: 1, name: "McLaren", points: 213, wins: 1 },
    { rank: 2, name: "Ferrari", points: 210, wins: 3 },
    { rank: 3, name: "Red Bull Racing", points: 175, wins: 4 },
    { rank: 4, name: "Mercedes AMG", points: 110, wins: 0 },
    { rank: 5, name: "Williams Racing", points: 62, wins: 0 },
    { rank: 6, name: "Aston Martin", points: 32, wins: 0 },
    { rank: 7, name: "Visa Cash App RB", points: 20, wins: 0 },
    { rank: 8, name: "Haas F1 Team", points: 14, wins: 0 },
    { rank: 9, name: "Alpine", points: 6, wins: 0 },
    { rank: 10, name: "Kick Sauber", points: 2, wins: 0 }
  ]
};

export const RECENT_NEWS = [
  {
    id: 1,
    title: "Ferrari's Monaco Upgrade: Data Reveals 0.15s Downforce Improvement",
    summary: "ApexGP telemetry charts reveal Leclerc's SF-25 carried 4km/h higher speed through Portier and Swimming Pool chicanes compared to Verstappen.",
    category: "Telemetry Analysis",
    date: "2025-05-28",
    readTime: "4 min read",
    author: "Karun Chandhok (ApexGP Lead Analyst)"
  },
  {
    id: 2,
    title: "How Red Bull Restored Engine Efficiency for Montreal Speed Straights",
    summary: "Simulations suggest that Red Bull's engine power coefficient increased back to 98% following MGU-K swaps, providing a 0.22s drag benefit on long straightways.",
    category: "Power Analysis",
    date: "2025-06-02",
    readTime: "6 min read",
    author: "Albert Fabrega"
  },
  {
    id: 3,
    title: "Tire Wear Breakdown: Silverstone High-Speed Corners Challenge Medium Tyres",
    summary: "Lateral load simulations for Silverstone show that the C3 medium compounds degrade by 8% per lap in the Maggots-Becketts complex. A two-stop strategy is highly probable.",
    category: "Strategy Guide",
    date: "2025-06-03",
    readTime: "5 min read",
    author: "ApexAI Strategy Engine"
  }
];

export const getWeatherDetails = (season, round, raceName, session) => {
  // Deterministic seed generation based on input arguments
  const nameSum = (raceName || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = (parseInt(season || 2025) * 17 + parseInt(round || 1) * 31 + nameSum + (session === "race" ? 1 : session === "qualifying" ? 2 : session === "fp1" ? 3 : session === "fp2" ? 4 : 5)) % 100;

  let baseTemp = 22; // default temp
  let rainProb = 15; // rainfall probability percentage
  let isNightRace = false;

  const nameLower = (raceName || "").toLowerCase();
  if (nameLower.includes("bahrain") || nameLower.includes("abu dhabi") || nameLower.includes("qatar") || nameLower.includes("saudi") || nameLower.includes("vegas")) {
    baseTemp = 28;
    rainProb = 1;
    isNightRace = true;
  } else if (nameLower.includes("singapore")) {
    baseTemp = 30;
    rainProb = 25; // tropical storm chance
    isNightRace = true;
  } else if (nameLower.includes("belgian") || nameLower.includes("spa") || nameLower.includes("british") || nameLower.includes("silverstone") || nameLower.includes("canadian") || nameLower.includes("dutch") || nameLower.includes("zandvoort")) {
    baseTemp = 18;
    rainProb = 30;
  } else if (nameLower.includes("italian") || nameLower.includes("monza") || nameLower.includes("spanish") || nameLower.includes("barcelona") || nameLower.includes("hungarian")) {
    baseTemp = 27;
    rainProb = 10;
  } else if (nameLower.includes("brazilian") || nameLower.includes("sao paulo")) {
    baseTemp = 21;
    rainProb = 40; // Interlagos often sees downpours
  } else if (nameLower.includes("japanese") || nameLower.includes("suzuka")) {
    baseTemp = 20;
    rainProb = 20;
  } else if (nameLower.includes("monaco")) {
    baseTemp = 22;
    rainProb = 12;
  }

  // Determine weather type deterministically based on seed
  let weather = "Sunny";
  const rainRoll = seed % 100;
  if (rainRoll < rainProb) {
    weather = "Rainy";
  } else if (rainRoll < rainProb * 2.2) {
    weather = "Overcast";
  } else if (rainRoll < rainProb * 3.8) {
    weather = "Partly Cloudy";
  }

  // Adjust air temperature by session time of day
  let airTemp = baseTemp + ((seed % 7) - 3) * 0.5; // +/- 1.5C variance
  if (session === "fp1" || session === "fp3") {
    airTemp -= isNightRace ? 1.0 : 2.0; // practice sessions in morning/evening
  } else if (session === "qualifying" || session === "fp2") {
    airTemp += isNightRace ? 0.0 : 2.0; // qualifiers in peak afternoon heat
  }

  // Track temperature is airTemp + track solar radiation coefficient
  let trackTemp = airTemp;
  if (weather === "Rainy") {
    trackTemp += 2.0 + (seed % 3) * 0.5; // wet track is cold
  } else if (weather === "Overcast") {
    trackTemp += 6.0 + (seed % 4) * 0.5;
  } else if (isNightRace) {
    trackTemp += 3.0 + (seed % 3) * 0.5; // track radiates heat slowly at night
  } else {
    // Peak heat in sun
    const heatMultiplier = (session === "qualifying" || session === "fp2") ? 18.0 : 12.0;
    trackTemp += heatMultiplier + (seed % 7) * 0.8;
  }

  return {
    weather: weather,
    airTemp: parseFloat(airTemp.toFixed(1)),
    trackTemp: parseFloat(trackTemp.toFixed(1)),
    humidity: Math.min(99, Math.max(10, 45 + (seed % 30) + (weather === "Rainy" ? 45 : weather === "Overcast" ? 20 : 0)))
  };
};
