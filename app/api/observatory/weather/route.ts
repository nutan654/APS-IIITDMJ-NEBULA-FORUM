import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date") || new Date().toISOString();
    const date = new Date(dateParam);

    // Calculate deterministic values based on day of month for dynamic simulation
    const day = date.getDate();
    
    // Simulating astronomical seeing quality (1-5 arcseconds, lower is better)
    const seeingIndex = ((day * 7) % 5) + 1.2;
    let seeingGrade = "Excellent";
    if (seeingIndex > 4) seeingGrade = "Poor (Hazy)";
    else if (seeingIndex > 3) seeingGrade = "Moderate";
    else if (seeingIndex > 2) seeingGrade = "Good";

    // Simulating cloud coverage %
    const cloudCover = (day * 13) % 100;
    let skyCondition = "Prismatic Clear Skies";
    if (cloudCover > 75) skyCondition = "Overcast Heavens";
    else if (cloudCover > 40) skyCondition = "Scattered Stratus Clouds";
    else if (cloudCover > 15) skyCondition = "Subtle Cirrus Trails";

    // Simulating lunar illumination % and phase
    const phaseDay = day % 30;
    let lunarIllumination = 0;
    let lunarPhase = "New Moon";

    if (phaseDay === 0 || phaseDay === 30) {
      lunarIllumination = 0;
      lunarPhase = "New Moon";
    } else if (phaseDay < 7) {
      lunarIllumination = Math.round((phaseDay / 7.5) * 50);
      lunarPhase = "Waxing Crescent";
    } else if (phaseDay === 7 || phaseDay === 8) {
      lunarIllumination = 50;
      lunarPhase = "First Quarter";
    } else if (phaseDay < 15) {
      lunarIllumination = Math.round(50 + ((phaseDay - 7.5) / 7.5) * 50);
      lunarPhase = "Waxing Gibbous";
    } else if (phaseDay === 15) {
      lunarIllumination = 100;
      lunarPhase = "Full Blood Moon";
    } else if (phaseDay < 22) {
      lunarIllumination = Math.round(100 - ((phaseDay - 15) / 7.5) * 50);
      lunarPhase = "Waning Gibbous";
    } else if (phaseDay === 22 || phaseDay === 23) {
      lunarIllumination = 50;
      lunarPhase = "Third Quarter";
    } else {
      lunarIllumination = Math.round(50 - ((phaseDay - 22.5) / 7.5) * 50);
      lunarPhase = "Waning Crescent";
    }

    // Determine stargazing recommendation index (0-100)
    const skyRating = Math.max(0, Math.min(100, Math.round(
      (100 - cloudCover) * 0.6 + ( seeingIndex < 2.5 ? 40 : 20 ) - (lunarIllumination * 0.2)
    )));

    return NextResponse.json({
      location: "IIITDM Jabalpur Rooftop Observatory",
      coordinates: "23.1764° N, 80.0253° E",
      weather: {
        skyRating,
        skyCondition,
        cloudCover: `${cloudCover}%`,
        lunarPhase,
        lunarIllumination: `${lunarIllumination}%`,
        atmosphericSeeing: `${seeingIndex.toFixed(1)}" arcsec (${seeingGrade})`,
        humidity: `${((day * 3) % 40) + 40}%`,
        temperature: `${((day * 2) % 15) + 18}°C`,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
