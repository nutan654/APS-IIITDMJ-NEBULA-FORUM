import { NextRequest, NextResponse } from "next/server";

const SIMULATOR_TARGETS = {
  saturn: {
    name: "Saturn",
    coordinates: "RA 22h 34m 12s | Dec -11° 43' 08\"",
    distance: "1.4 billion km (9.58 AU)",
    description: "The ringed jewel of the solar system. Excellent tilt allows clear sight of the Cassini Division.",
    eyepieceView: {
      magnification: "133x (9mm eyepiece)",
      objectSize: "35% FOV",
      visualRepresentation: "🪐",
      colorGlow: "rgba(240, 208, 96, 0.7)",
      detailNotes: "Golden sphere with razor-thin ring gaps and Shadow cast on rings.",
    }
  },
  jupiter: {
    name: "Jupiter",
    coordinates: "RA 04h 12m 54s | Dec +21° 08' 42\"",
    distance: "650 million km (4.34 AU)",
    description: "The planetary giant. Great Red Spot transiting the central meridian with moons Io and Europa aligned.",
    eyepieceView: {
      magnification: "120x (10mm eyepiece)",
      objectSize: "45% FOV",
      visualRepresentation: "🔴",
      colorGlow: "rgba(201, 162, 39, 0.8)",
      detailNotes: "Dual equatorial dark bands resolved with Io and Europa as bright beads.",
    }
  },
  orion: {
    name: "Orion Nebula (M42)",
    coordinates: "RA 05h 35m 17s | Dec -05° 23' 28\"",
    distance: "1,344 light-years",
    description: "A stellar nursery of rising dust and active star birth. Trapezium Cluster resolved at the core.",
    eyepieceView: {
      magnification: "60x (20mm eyepiece)",
      objectSize: "80% FOV",
      visualRepresentation: "🔮",
      colorGlow: "rgba(42, 14, 74, 0.95)",
      detailNotes: "Eerie green-gray nebulosity gas clouds wrapped around 4 bright hot baby stars.",
    }
  },
  andromeda: {
    name: "Andromeda Galaxy (M31)",
    coordinates: "RA 00h 42m 44s | Dec +41° 16' 09\"",
    distance: "2.53 million light-years",
    description: "Our neighboring spiral galaxy. Vast halo of billions of stars sweeping across the eyepiece canopy.",
    eyepieceView: {
      magnification: "30x (40mm wide-field eyepiece)",
      objectSize: "95% FOV",
      visualRepresentation: "🌀",
      colorGlow: "rgba(74, 144, 217, 0.4)",
      detailNotes: "Bright concentrated stellar core fading out into smooth elliptical dust lanes.",
    }
  },
  mars: {
    name: "Mars",
    coordinates: "RA 14h 56m 22s | Dec -16° 12' 40\"",
    distance: "220 million km (1.47 AU)",
    description: "The red sentinel. Syrtis Major planum dark detail and the southern polar ice cap visible under steady skies.",
    eyepieceView: {
      magnification: "180x (9mm eyepiece + 2x Barlow)",
      objectSize: "25% FOV",
      visualRepresentation: "☄️",
      colorGlow: "rgba(139, 0, 0, 0.75)",
      detailNotes: "Orange-red disk with faint dark geometric details and a stark white polar dot.",
    }
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("target") || "saturn";

  const data = (SIMULATOR_TARGETS as any)[target.toLowerCase()];
  if (!data) {
    return NextResponse.json({ error: "Target celestial object not found in the simulator catalog." }, { status: 404 });
  }

  return NextResponse.json(data);
}
