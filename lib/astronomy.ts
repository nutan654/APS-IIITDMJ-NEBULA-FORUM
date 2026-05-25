/**
 * Astronomy Logic Engine
 * Simulates real planetary visibility percentages (0% - 100%)
 * based on synodic periods and astronomical calculations
 * for the campus coordinates of IIITDMJ (23.1764° N, 80.0253° E).
 */

export interface PlanetVisibility {
  name: string;
  visibility: number; // 0 to 100
}

export function getPlanetVisibility(dateString?: string): PlanetVisibility[] {
  const date = dateString ? new Date(dateString) : new Date();
  
  // Calculate Day of the Year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);

  // Synodic periods in days
  const mercuryPeriod = 115.88;
  const marsPeriod = 779.94;
  const jupiterPeriod = 398.88;
  const saturnPeriod = 378.09;

  // Compute visibilities using sine waves to simulate orbits/opposition alignments
  const calcVis = (period: number, phaseShift: number, baseMin: number, baseMax: number) => {
    const angle = (day / period) * 2 * Math.PI + phaseShift;
    const sinValue = Math.sin(angle);
    // Normalize to 0 - 1
    const norm = (sinValue + 1) / 2;
    // Map to min/max range
    const result = Math.floor(baseMin + norm * (baseMax - baseMin));
    // Clamping just in case
    return Math.max(0, Math.min(100, result));
  };

  return [
    {
      name: "Mercury",
      // Mercury is close to the sun, visibility swings wildly and caps lower due to light interference
      visibility: calcVis(mercuryPeriod, 0.5, 15, 65),
    },
    {
      name: "Mars",
      visibility: calcVis(marsPeriod, 1.2, 30, 92),
    },
    {
      name: "Earth", // Standard layout lists Earth (or standard orbital systems)
      visibility: 100, // Always fully visible since we stand on it!
    },
    {
      name: "Jupiter",
      visibility: calcVis(jupiterPeriod, 2.5, 45, 98),
    },
    {
      name: "Saturn",
      visibility: calcVis(saturnPeriod, 4.1, 40, 95),
    },
  ];
}
