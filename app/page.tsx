"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Interface Definitions
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  title: string;
}

interface CelestialEvent {
  id: number;
  title: string;
  type: string;
  month: string;
  day: string;
  description: string;
  capacity: number;
  rsvpCount: number;
  isRegistered: boolean;
}

interface ForumPost {
  id: number;
  title: string;
  content: string;
  tag: string;
  likes: number;
  responsesCount: number;
  createdAt: string;
  authorName: string;
  authorTitle: string;
}

interface TelescopeBooking {
  id: number;
  userId: number;
  userName: string;
  instrument: string;
  date: string;
  timeSlot: string;
  purpose: string;
  status: string;
}

interface PlanetVisibility {
  name: string;
  visibility: number;
}

interface Astrophoto {
  id: number;
  title: string;
  url: string;
  authorName: string;
  instrument: string;
  exposure: string;
  iso: number;
  createdAt: string;
}

interface LogbookEntry {
  id: number;
  date: string;
  object: string;
  skyConditions: string;
  notes: string;
  eyepiece: string;
}

interface ChatMessage {
  sender: "bot" | "user";
  text: string;
}

interface WeatherData {
  skyRating: number;
  skyCondition: string;
  cloudCover: string;
  lunarPhase: string;
  lunarIllumination: string;
  atmosphericSeeing: string;
  humidity: string;
  temperature: string;
}

interface SimulatorView {
  name: string;
  coordinates: string;
  distance: string;
  description: string;
  eyepieceView: {
    magnification: string;
    objectSize: string;
    visualRepresentation: string;
    colorGlow: string;
    detailNotes: string;
  };
}

export default function Home() {
  const router = useRouter();

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Core Data States
  const [events, setEvents] = useState<CelestialEvent[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [bookings, setBookings] = useState<TelescopeBooking[]>([]);
  const [planets, setPlanets] = useState<PlanetVisibility[]>([]);

  // 1. Astrophotography States
  const [galleryPhotos, setGalleryPhotos] = useState<Astrophoto[]>([]);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoInstrument, setPhotoInstrument] = useState("8\" Dobsonian Reflector");
  const [photoExposure, setPhotoExposure] = useState("30s");
  const [photoIso, setPhotoIso] = useState(1600);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [photoSuccess, setPhotoSuccess] = useState("");
  const [photoError, setPhotoError] = useState("");

  // 2. Logbook States
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>([]);
  const [logDate, setLogDate] = useState("");
  const [logObject, setLogObject] = useState("");
  const [logConditions, setLogConditions] = useState("Perfect");
  const [logEyepiece, setLogEyepiece] = useState("9mm Plössl");
  const [logNotes, setLogNotes] = useState("");
  const [logSuccess, setLogSuccess] = useState("");
  const [logError, setLogError] = useState("");

  // 3. Astro-Weather States
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherDate, setWeatherDate] = useState(new Date().toISOString().split("T")[0]);

  // 4. Eyepiece Simulator States
  const [simulatorTarget, setSimulatorTarget] = useState("Saturn");
  const [simulatorView, setSimulatorView] = useState<SimulatorView | null>(null);
  const [simulatorLoading, setSimulatorLoading] = useState(false);

  // 5. Council Challenge Quiz States
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });
  const [quizFeedback, setQuizFeedback] = useState("");
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Form States for Forum & Telescope
  const [newWhisperTitle, setNewWhisperTitle] = useState("");
  const [newWhisperContent, setNewWhisperContent] = useState("");
  const [newWhisperTag, setNewWhisperTag] = useState("Astrophotography");
  const [showWhisperForm, setShowWhisperForm] = useState(false);

  const [bookInstrument, setBookInstrument] = useState("8\" Dobsonian Reflector, f/6");
  const [bookDate, setBookDate] = useState("");
  const [bookSlot, setBookSlot] = useState("20:00 - 22:00");
  const [bookPurpose, setBookPurpose] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // Galileo Chat States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hark, stargazer! I am Galileo. Ask me of the clockwork of the cosmos, the curvature of space-time, or where our telescopes align tonight!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  // Refs for Canvases
  const starfieldRef = useRef<HTMLCanvasElement>(null);
  const constellationRef = useRef<HTMLCanvasElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  // Mount Fetchers
  useEffect(() => {
    fetchSession();
    fetchEvents();
    fetchForum();
    fetchBookings();
    fetchVisibility();
    fetchGallery();
    fetchWeather();
    fetchSimulator();
  }, []);

  // Sync logbook once user is confirmed
  useEffect(() => {
    if (user) {
      fetchLogbook();
    } else {
      setLogbookEntries([]);
    }
  }, [user]);

  // Sync simulator whenever target updates
  useEffect(() => {
    fetchSimulator();
  }, [simulatorTarget]);

  // Sync weather whenever date updates
  useEffect(() => {
    fetchWeather();
  }, [weatherDate]);

  // Core API Fetchers
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchForum = async () => {
    try {
      const res = await fetch("/api/forum");
      const data = await res.json();
      if (Array.isArray(data)) setForumPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/observatory");
      const data = await res.json();
      if (data && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVisibility = async () => {
    setPlanets([
      { name: "Jupiter", visibility: 92 },
      { name: "Saturn", visibility: 87 },
      { name: "Mars", visibility: 74 },
      { name: "Venus", visibility: 65 },
      { name: "Mercury", visibility: 41 },
    ]);
  };

  // Upgraded Feature Fetchers
  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (Array.isArray(data)) setGalleryPhotos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogbook = async () => {
    try {
      const res = await fetch("/api/logbook");
      const data = await res.json();
      if (Array.isArray(data)) setLogbookEntries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeather = async () => {
    try {
      const res = await fetch(`/api/observatory/weather?date=${weatherDate}`);
      const data = await res.json();
      if (data && data.weather) {
        setWeather(data.weather);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSimulator = async () => {
    setSimulatorLoading(true);
    try {
      const res = await fetch(`/api/observatory/simulator?target=${simulatorTarget}`);
      const data = await res.json();
      if (data && !data.error) {
        setSimulatorView(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatorLoading(false);
    }
  };

  // Auth & General Action Handlers
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    fetchEvents();
    router.refresh();
  };

  const handleRsvp = async (eventId: number) => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchEvents();
      alert(data.message);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLikePost = async (postId: number) => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`/api/forum/${postId}/like`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setForumPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: data.likes } : post
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateWhisper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newWhisperTitle,
          content: newWhisperContent,
          tag: newWhisperTag,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewWhisperTitle("");
      setNewWhisperContent("");
      setShowWhisperForm(false);
      fetchForum();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");
    if (!user) {
      router.push("/login");
      return;
    }
    if (!bookDate) {
      setBookingError("Please coordinate a specific observation date.");
      return;
    }
    try {
      const res = await fetch("/api/observatory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instrument: bookInstrument,
          date: bookDate,
          timeSlot: bookSlot,
          purpose: bookPurpose,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setBookingSuccess(data.message);
      setBookPurpose("");
      fetchBookings();
    } catch (err: any) {
      setBookingError(err.message);
    }
  };

  // Upgraded Feature Handlers
  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhotoError("");
    setPhotoSuccess("");
    if (!user) {
      router.push("/login");
      return;
    }
    if (!photoTitle || !photoUrl) {
      setPhotoError("Masterpiece title and cosmic image preview link are required.");
      return;
    }
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: photoTitle,
          url: photoUrl,
          instrument: photoInstrument,
          exposure: photoExposure,
          iso: photoIso,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPhotoSuccess(data.message);
      setPhotoTitle("");
      setPhotoUrl("");
      setShowPhotoForm(false);
      fetchGallery();
    } catch (err: any) {
      setPhotoError(err.message);
    }
  };

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogError("");
    setLogSuccess("");
    if (!user) {
      router.push("/login");
      return;
    }
    if (!logDate || !logObject) {
      setLogError("Observational date and target object coordinates are required.");
      return;
    }
    try {
      const res = await fetch("/api/logbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: logDate,
          object: logObject,
          skyConditions: logConditions,
          eyepiece: logEyepiece,
          notes: logNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setLogSuccess(data.message);
      setLogObject("");
      setLogNotes("");
      fetchLogbook();
    } catch (err: any) {
      setLogError(err.message);
    }
  };

  const handleDeleteLog = async (id: number) => {
    if (!confirm("Are you sure you want to dissolve this log from the ledger?")) return;
    try {
      const res = await fetch(`/api/logbook?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchLogbook();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuizFeedback("");
    setQuizSubmitted(true);
    try {
      const res = await fetch("/api/auth/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: quizAnswers }),
      });
      const data = await res.json();

      if (data.passed) {
        setQuizPassed(true);
        setUser(data.user); // Dynamically update active layout session info
      } else {
        setQuizPassed(false);
      }
      setQuizFeedback(data.message);
    } catch (err: any) {
      setQuizFeedback("Cosmic interference blocked the petition. Try again.");
    }
  };

  // Galileo Chat Handlers
  const handleSendChat = async (text: string) => {
    if (!text.trim()) return;
    setChatMessages((prev) => [...prev, { sender: "user", text }]);
    setChatInput("");
    setBotTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Forgive me, my observations are clouded by cosmic interference.",
        },
      ]);
    } finally {
      setBotTyping(false);
    }
  };

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));
  }, []);

  // Starfield Background
  useEffect(() => {
    const starfield = starfieldRef.current;
    if (starfield) {
      const ctx = starfield.getContext("2d");
      if (ctx) {
        let stars: { x: number; y: number; r: number; alpha: number; d: number }[] = [];
        const numStars = 180;
        const resizeStarfield = () => {
          starfield.width = window.innerWidth;
          starfield.height = window.innerHeight;
          stars = [];
          for (let i = 0; i < numStars; i++) {
            stars.push({
              x: Math.random() * starfield.width,
              y: Math.random() * starfield.height,
              r: Math.random() * 1.5,
              alpha: Math.random(),
              d: Math.random() * 0.02,
            });
          }
        };
        resizeStarfield();
        window.addEventListener("resize", resizeStarfield);

        let animFrameId: number;
        const animate = () => {
          ctx.clearRect(0, 0, starfield.width, starfield.height);
          stars.forEach((star) => {
            star.alpha += star.d;
            if (star.alpha <= 0 || star.alpha >= 1) star.d = -star.d;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 162, 39, ${star.alpha * 0.7})`;
            ctx.fill();
          });
          animFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
          window.removeEventListener("resize", resizeStarfield);
          cancelAnimationFrame(animFrameId);
        };
      }
    }
  }, []);

  // Cursor and Constellation Effects
  useEffect(() => {
    const canvas = constellationRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let stars: { x: number; y: number; r: number; vx: number; vy: number }[] = [];
        const count = 45;
        let mouse = { x: -1000, y: -1000 };

        const resize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          stars = [];
          for (let i = 0; i < count; i++) {
            stars.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              r: Math.random() * 2 + 0.5,
              vx: (Math.random() - 0.5) * 0.15,
              vy: (Math.random() - 0.5) * 0.15,
            });
          }
        };
        resize();
        window.addEventListener("resize", resize);

        const handleMouseMove = (e: MouseEvent) => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
        };
        const handleMouseLeave = () => {
          mouse.x = -1000;
          mouse.y = -1000;
        };
        window.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        let animId: number;
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          stars.forEach((star) => {
            star.x += star.vx;
            star.y += star.vy;
            if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
            if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(201, 162, 39, 0.4)";
            ctx.fill();
          });

          for (let i = 0; i < stars.length; i++) {
            const s1 = stars[i];
            const distMouse = Math.hypot(s1.x - mouse.x, s1.y - mouse.y);
            if (distMouse < 140) {
              ctx.beginPath();
              ctx.moveTo(s1.x, s1.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(201, 162, 39, ${0.35 * (1 - distMouse / 140)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
            for (let j = i + 1; j < stars.length; j++) {
              const s2 = stars[j];
              const distStars = Math.hypot(s1.x - s2.x, s1.y - s2.y);
              if (distStars < 100) {
                ctx.beginPath();
                ctx.moveTo(s1.x, s1.y);
                ctx.lineTo(s2.x, s2.y);
                ctx.strokeStyle = `rgba(201, 162, 39, ${0.18 * (1 - distStars / 100)})`;
                ctx.lineWidth = 0.4;
                ctx.stroke();
              }
            }
          }
          animId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
          window.removeEventListener("resize", resize);
          window.removeEventListener("mousemove", handleMouseMove);
          document.body.removeEventListener("mouseleave", handleMouseLeave);
          cancelAnimationFrame(animId);
        };
      }
    }
  }, []);

  useEffect(() => {
    const ring = cursorRingRef.current;
    if (ring) {
      let mX = -100, mY = -100, rX = -100, rY = -100;
      const handleMouseMove = (e: MouseEvent) => {
        mX = e.clientX;
        mY = e.clientY;
      };
      window.addEventListener("mousemove", handleMouseMove);
      let frameId: number;
      const update = () => {
        rX += (mX - rX) * 0.15;
        rY += (mY - rY) * 0.15;
        ring.style.left = `${rX}px`;
        ring.style.top = `${rY}px`;
        frameId = requestAnimationFrame(update);
      };
      update();
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(frameId);
      };
    }
  }, []);

  return (
    <>
      {/* Background Canvases */}
      <canvas id="starfield" ref={starfieldRef}></canvas>
      <canvas className="constellation-canvas" ref={constellationRef}></canvas>
      <div id="cursor-ring" ref={cursorRingRef}></div>

      {/* NAV */}
      <nav>
        <a className="nav-sigil" href="#">✦ NEBULA</a>
        
        <div className="nav-center-auth">
          {!authLoading && (
            user ? (
              <span className="auth-welcome">
                Welcome, <strong>{user.name}</strong> ✦ <span className="title-tag">{user.title} ({user.role})</span>
              </span>
            ) : (
              <span className="auth-guest">Fellowship Unverified</span>
            )
          )}
        </div>

        <ul className="nav-links">
          <li><a href="#about">The Society</a></li>
          <li><a href="#events">Events</a></li>
          <li><a href="#gallery">Astrophotography</a></li>
          <li><a href="#forum">Whispers</a></li>
          <li><a href="#telescope">Observatory</a></li>
          <li><a href="#order">The Council</a></li>
          <li>
            {!authLoading && (
              user ? (
                <button onClick={handleLogout} className="nav-auth-btn logout-glow">Leave Fellowship ✦</button>
              ) : (
                <a href="/login" className="nav-auth-btn login-glow">Commune (Login)</a>
              )
            )}
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <header id="hero">
        <div className="hero-ring">
          <div className="hero-dot" style={{ top: "10%", left: "50%" }}></div>
        </div>
        <div className="hero-ring">
          <div className="hero-dot" style={{ top: "80%", left: "20%" }}></div>
        </div>
        <div className="hero-ring"></div>

        <div className="hero-emblem">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#c9a227" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#c9a227" strokeWidth="0.5" strokeDasharray="4 3" />
            <polygon points="50,15 54,42 81,38 58,54 68,81 50,62 32,81 42,54 19,38 46,42" fill="none" stroke="#c9a227" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="8" fill="#c9a227" />
          </svg>
        </div>

        <h1 className="hero-title">NEBULA</h1>
        <div className="hero-subtitle">Astronomy & Physics Society</div>
        <div className="hero-society">IIITDM Jabalpur</div>
        <div className="hero-rule"></div>

        <blockquote className="hero-quote reveal">
          "The cosmos is a sacred library, and the stars are books written in the elegant language of mathematics and general relativity."
        </blockquote>
        <div className="hero-scroll-hint">Scroll to Gaze Downward</div>
      </header>

      {/* ABOUT */}
      <section id="about">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-glyph">✦</span>
            <h2 className="section-title">The Fellowship</h2>
            <div className="section-divider">
              <div className="divider-line"></div><span className="divider-symbol">✦</span><div className="divider-line right"></div>
            </div>
            <p className="section-lede">Gathered beneath the eternal dome of heaven, we cultivate observational rigor and theoretical depth.</p>
          </div>

          <div className="about-grid reveal">
            <div className="about-text">
              <p className="drop-cap">
                Established as the primary sanctuary for stargazers and physicists at IIITDMJ, <strong>NEBULA</strong> bridges the ancient poetry of the night skies with modern quantum mechanics and general relativity. Our students trace the orbits of planets, capture deep sky nebulae, and probe the fabric of spacetime.
              </p>
              <p>
                From friday night rooftop observatories to theoretical debates on Hawking radiation, the fellowship offers a home for all minds obsessed with the ultimate clockwork of the cosmos.
              </p>
            </div>

            <div className="orrery-diagram">
              <div className="orrery-sun"></div>
              <div className="orrery-orbit orbit-1"><div className="planet"><span className="planet-label">Mercury</span></div></div>
              <div className="orrery-orbit orbit-2"><div className="planet"><span className="planet-label">Venus</span></div></div>
              <div className="orrery-orbit orbit-3"><div className="planet"><span className="planet-label">Earth</span></div></div>
              <div className="orrery-orbit orbit-4"><div className="planet"><span className="planet-label">Mars</span></div></div>
            </div>
          </div>

          <div className="pillars">
            <div className="pillar reveal">
              <span className="pillar-glyph">🔭</span>
              <h3>Observation</h3>
              <p>Commanding our optical reflectors and refractors to catalog planetary coordinates, lunar phases, and variable deep-space objects.</p>
            </div>
            <div className="pillar reveal">
              <span className="pillar-glyph">🧠</span>
              <h3>Theory</h3>
              <p>Exploring the mathematical boundaries of physics — from black hole thermodynamics and quantum gravity to spacetime singularities.</p>
            </div>
            <div className="pillar reveal">
              <span className="pillar-glyph">📷</span>
              <h3>Imaging</h3>
              <p>Stretching the bounds of astrophotography to resolve distant nebulae, spiral arms of galaxies, and lunar transits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-glyph">✦</span>
            <h2 className="section-title">Celestial Calendar</h2>
            <div className="section-divider">
              <div className="divider-line"></div><span className="divider-symbol">✦</span><div className="divider-line right"></div>
            </div>
            <p className="section-lede">Join our active gatherings and observatory sessions aligned with the clockwork of the heavens.</p>
          </div>

          <div className="events-grid reveal">
            {events.map((event) => (
              <div key={event.id} className="event-card" onClick={() => handleRsvp(event.id)}>
                <div className="event-date">
                  <span className="event-month">{event.month}</span>
                  <span className="event-day">{event.day}</span>
                </div>
                <div className="event-body">
                  <span className="event-type">{event.type}</span>
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                  <div className="event-capacity-info">
                    Capacity: <strong>{event.rsvpCount} / {event.capacity}</strong> stargazers joined
                  </div>
                  {event.isRegistered ? (
                    <span className="rsvp-prompt" style={{ color: "var(--glow-teal)" }}>✓ Spot Reserved (Click to Withdraw)</span>
                  ) : (
                    <span className="rsvp-prompt">✦ Reserve Stargazing Spot (Click)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE 2: ASTROPHOTOGRAPHY GALLERY */}
      <section id="gallery">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-glyph">🌌</span>
            <h2 className="section-title">Astrophotography Gallery</h2>
            <div className="section-divider">
              <div className="divider-line"></div><span className="divider-symbol">✦</span><div className="divider-line right"></div>
            </div>
            <p className="section-lede">Gaze upon deep sky nebulae, solar sentinels, and crescent moons captured by members of the society.</p>
          </div>

          <div className="gallery-actions reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
            <button 
              onClick={() => {
                if (!user) router.push("/login");
                else setShowPhotoForm(!showPhotoForm);
              }} 
              className="cta-btn-ghost"
            >
              {showPhotoForm ? "Hide Lens Controls" : "Exhibit Your Masterpiece ✦"}
            </button>

            {showPhotoForm && user && (
              <form onSubmit={handleUploadPhoto} className="whisper-form ornate-card" style={{ marginTop: "2rem" }}>
                <div className="corner-tl"></div><div className="corner-tr"></div><div className="corner-bl"></div><div className="corner-br"></div>
                <h3>✦ Exhibit Astrophotograph</h3>
                
                <div className="form-group">
                  <label>Masterpiece Title</label>
                  <input type="text" placeholder="e.g. Orion Nebula in M42" value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)} required />
                </div>
                
                <div className="form-group">
                  <label>Image Preview Link (Unsplash/Direct URL)</label>
                  <input type="url" placeholder="https://images.unsplash.com/..." value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Instrument Setup</label>
                  <input type="text" placeholder="e.g. 8-inch Dobsonian Reflector" value={photoInstrument} onChange={(e) => setPhotoInstrument(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Exposure Time</label>
                  <input type="text" placeholder="e.g. 60 subs x 30s stacked" value={photoExposure} onChange={(e) => setPhotoExposure(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Camera ISO</label>
                  <input type="number" placeholder="1600" value={photoIso} onChange={(e) => setPhotoIso(parseInt(e.target.value))} />
                </div>

                {photoError && <div className="error-message">⚠️ {photoError}</div>}
                {photoSuccess && <div className="success-message">✦ {photoSuccess}</div>}

                <button type="submit" className="cta-btn" style={{ width: "100%" }}>Expose onto Celestial Ledger ✦</button>
              </form>
            )}
          </div>

          {/* Masonry-style Astrophotography Grid */}
          <div className="gallery-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
            {galleryPhotos.map((photo) => (
              <div key={photo.id} className="ornate-card" style={{ padding: "1rem", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div className="corner-tl"></div><div className="corner-tr"></div><div className="corner-bl"></div><div className="corner-br"></div>
                <div style={{ height: "200px", width: "100%", position: "relative", overflow: "hidden", borderRadius: "8px", marginBottom: "1rem" }}>
                  <img src={photo.url} alt={photo.title} style={{ height: "100%", width: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} />
                </div>
                <h4 style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", fontSize: "1.05rem", marginBottom: "0.2rem" }}>✦ {photo.title}</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--fade)", marginBottom: "0.5rem" }}>by <strong>{photo.authorName}</strong></p>
                <div style={{ background: "rgba(3,2,10,0.5)", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "6px", padding: "0.6rem", fontSize: "0.78rem", color: "var(--parchment)", fontFamily: "Spectral, serif" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Setup:</span> <span style={{ color: "var(--gold)" }}>{photo.instrument}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Exposure:</span> <span style={{ color: "var(--gold)" }}>{photo.exposure}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>ISO:</span> <span style={{ color: "var(--gold)" }}>{photo.iso}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHISPERS FORUM */}
      <section id="forum">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-glyph">✦</span>
            <h2 className="section-title">The Whispering Archive</h2>
            <div className="section-divider">
              <div className="divider-line"></div><span className="divider-symbol">✦</span><div className="divider-line right"></div>
            </div>
            <p className="section-lede">Read, debate, and resonate astronomical notes published on our local boards.</p>
          </div>

          <div className="forum-actions-header reveal">
            <button 
              onClick={() => {
                if (!user) router.push("/login");
                else setShowWhisperForm(!showWhisperForm);
              }}
              className="cta-btn"
            >
              {showWhisperForm ? "Seal Archive Drawer" : "Inscribe a Whisper (Add Post) ✦"}
            </button>

            {showWhisperForm && user && (
              <form onSubmit={handleCreateWhisper} className="whisper-form ornate-card" style={{ marginTop: "2rem" }}>
                <div className="corner-tl"></div><div className="corner-tr"></div><div className="corner-bl"></div><div className="corner-br"></div>
                <h3>✦ Inscribe Into Archive</h3>
                <div className="form-group">
                  <label>Whisper Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Observations of Jupiter's Great Red Spot..."
                    value={newWhisperTitle}
                    onChange={(e) => setNewWhisperTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category Tag</label>
                  <select 
                    value={newWhisperTag}
                    onChange={(e) => setNewWhisperTag(e.target.value)}
                  >
                    <option value="Astrophotography">Astrophotography</option>
                    <option value="Theory">Theory</option>
                    <option value="Question">Question</option>
                    <option value="Discovery">Discovery</option>
                    <option value="Observation">Observation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Astronomical Records (Content)</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your formulas, tracking setups, or deep sky findings..."
                    value={newWhisperContent}
                    onChange={(e) => setNewWhisperContent(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="cta-btn" style={{ width: "100%" }}>Seal Whisper into Star Charts ✦</button>
              </form>
            )}
          </div>

          <div className="forum-posts reveal">
            {forumPosts.map((post) => (
              <div key={post.id} className="forum-post" onClick={() => handleLikePost(post.id)}>
                <div className="forum-avatar">✨</div>
                <div className="forum-post-meta">
                  <div className="forum-post-title">{post.title}</div>
                  <div className="forum-post-info">
                    by <strong>{post.authorName}</strong> ({post.authorTitle}) ·{" "}
                    {new Date(post.createdAt).toLocaleDateString()} · {post.likes} resonances (Click to Resonate)
                  </div>
                  <p className="forum-post-body-text">{post.content}</p>
                </div>
                <span className={`forum-tag tag-${post.tag.toLowerCase().slice(0, 5)}`}>
                  {post.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TELESCOPE & OBSERVATORY SECTION */}
      <section id="telescope">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-glyph">🔭</span>
            <h2 className="section-title">The Observatory</h2>
            <div className="section-divider">
              <div className="divider-line"></div><span className="divider-symbol">✦</span><div className="divider-line right"></div>
            </div>
            <p className="section-lede">Reserve your communion with the cosmos, check simulated skies, or review eyepiece projections.</p>
          </div>

          {/* FEATURE 3: ASTRO-WEATHER WIDGET & SIMULATOR TAB */}
          <div className="observatory-features reveal" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
            
            {/* Live Weather Forecast widget */}
            <div className="ornate-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="corner-tl"></div><div className="corner-tr"></div><div className="corner-bl"></div><div className="corner-br"></div>
              <h3 style={{ fontFamily: "Cinzel, serif", color: "var(--gold)", fontSize: "0.85rem", letterSpacing: "0.2em", borderBottom: "1px solid rgba(201,162,39,0.15)", paddingBottom: "0.6rem" }}>✦ ASTRO-WEATHER FORECAST</h3>
              
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--fade)" }}>Forecast Date:</label>
                <input 
                  type="date" 
                  value={weatherDate} 
                  onChange={(e) => setWeatherDate(e.target.value)} 
                  style={{ background: "rgba(3,2,10,0.9)", border: "1px solid rgba(201,162,39,0.2)", color: "var(--parchment)", fontSize: "0.85rem", padding: "0.3rem 0.5rem", borderRadius: "4px" }} 
                />
              </div>

              {weather ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontFamily: "Spectral, serif" }}>
                  <div style={{ background: "rgba(42, 14, 74, 0.4)", borderRadius: "8px", padding: "1rem", textAlign: "center" }}>
                    <div style={{ fontSize: "0.78rem", color: "var(--fade)", textTransform: "uppercase" }}>Stargazing Index</div>
                    <div style={{ fontSize: "2.2rem", fontWeight: "700", color: "var(--gold-bright)", textShadow: "0 0 10px rgba(240,208,96,0.6)" }}>{weather.skyRating}/100</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--glow-teal)", fontWeight: "600", marginTop: "0.2rem" }}>{weather.skyCondition}</div>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    <div>☁️ Cloud Coverage: <strong style={{ color: "var(--gold)" }}>{weather.cloudCover}</strong></div>
                    <div>🌕 Moon Phase: <strong style={{ color: "var(--gold)" }}>{weather.lunarPhase}</strong></div>
                    <div>🌟 Lunar Glow: <strong style={{ color: "var(--gold)" }}>{weather.lunarIllumination}</strong></div>
                    <div>🌀 Seeing Quality: <strong style={{ color: "var(--gold)" }}>{weather.atmosphericSeeing}</strong></div>
                    <div>💧 Sky Humidity: <strong style={{ color: "var(--gold)" }}>{weather.humidity}</strong></div>
                    <div>🌡️ Temperature: <strong style={{ color: "var(--gold)" }}>{weather.temperature}</strong></div>
                  </div>
                </div>
              ) : (
                <p style={{ textAlign: "center" }}>Aligning forecast coordinates...</p>
              )}
            </div>

            {/* FEATURE 5: EYEPIECE SIMULATOR WIDGET */}
            <div className="ornate-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="corner-tl"></div><div className="corner-tr"></div><div className="corner-bl"></div><div className="corner-br"></div>
              <h3 style={{ fontFamily: "Cinzel, serif", color: "var(--gold)", fontSize: "0.85rem", letterSpacing: "0.2em", borderBottom: "1px solid rgba(201,162,39,0.15)", paddingBottom: "0.6rem" }}>✦ OPTICAL EYEPIECE SIMULATOR</h3>
              
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {["Saturn", "Jupiter", "Orion", "Andromeda", "Mars"].map((tgt) => (
                  <button 
                    key={tgt} 
                    onClick={() => setSimulatorTarget(tgt)} 
                    style={{ 
                      fontFamily: "Cinzel, serif", 
                      fontSize: "0.65rem", 
                      padding: "0.4rem 0.8rem", 
                      borderRadius: "99px", 
                      cursor: "pointer", 
                      background: simulatorTarget === tgt ? "var(--gold)" : "rgba(201,162,39,0.1)", 
                      color: simulatorTarget === tgt ? "var(--deep-space)" : "var(--gold)",
                      border: "1px solid rgba(201,162,39,0.3)",
                      transition: "all 0.3s"
                    }}
                  >
                    {tgt}
                  </button>
                ))}
              </div>

              {simulatorView && !simulatorLoading ? (
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
                  {/* Eyepiece Visual circle */}
                  <div style={{ 
                    width: "120px", 
                    height: "120px", 
                    borderRadius: "50%", 
                    border: "3px solid var(--gold)", 
                    background: "rgba(3,2,10,0.95)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: "3.5rem", 
                    boxShadow: `0 0 20px ${simulatorView.eyepieceView.colorGlow}`, 
                    position: "relative",
                    flexShrink: 0
                  }}>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textShadow: `0 0 15px ${simulatorView.eyepieceView.colorGlow}` }}>
                      {simulatorView.eyepieceView.visualRepresentation}
                    </div>
                  </div>

                  <div style={{ fontFamily: "Spectral, serif", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <h4 style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", fontSize: "0.95rem" }}>{simulatorView.name}</h4>
                    <p style={{ fontSize: "0.78rem", color: "var(--fade)" }}>Coords: {simulatorView.coordinates}</p>
                    <p style={{ fontSize: "0.78rem", color: "var(--fade)" }}>Distance: {simulatorView.distance}</p>
                    <p style={{ color: "var(--parchment)", fontSize: "0.82rem", lineHeight: "1.4" }}><em>"{simulatorView.description}"</em></p>
                    <div style={{ background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.1)", padding: "0.4rem", borderRadius: "4px", fontSize: "0.78rem", marginTop: "0.4rem" }}>
                      <strong>Setup:</strong> {simulatorView.eyepieceView.magnification} · {simulatorView.eyepieceView.detailNotes}
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ textAlign: "center" }}>Rotating simulated lenses...</p>
              )}
            </div>
          </div>

          <div className="booking-grid reveal">
            {/* Left: Equipment specs & Booking Form */}
            <div className="telescope-left">
              <div className="ornate-card">
                <div className="corner-tl"></div><div className="corner-tr"></div><div className="corner-bl"></div><div className="corner-br"></div>
                <h3>✦ Equipment Register</h3>
                <ul className="telescope-specs">
                  <li><span>Primary Instrument</span><span>8" Dobsonian Reflector, f/6</span></li>
                  <li><span>Secondary</span><span>4" Refractor, Celestron NexStar</span></li>
                  <li><span>Binoculars</span><span>15×70 Astronomical Binoculars</span></li>
                  <li><span>Camera</span><span>Modified Canon 600D + T-Ring</span></li>
                  <li><span>Mount</span><span>EQ-5 Equatorial with GoTo</span></li>
                  <li><span>Location</span><span>College Rooftop, Block C</span></li>
                </ul>
              </div>

              <div className="ornate-card booking-form-card">
                <div className="corner-tl"></div><div className="corner-tr"></div><div className="corner-bl"></div><div className="corner-br"></div>
                <h3>✦ Reserve Telescope Time</h3>
                {user ? (
                  <form onSubmit={handleCreateBooking} className="telescope-booking-form">
                    <div className="form-group">
                      <label>Instrument</label>
                      <select 
                        value={bookInstrument} 
                        onChange={(e) => setBookInstrument(e.target.value)}
                      >
                        <option value="8-inch Dobsonian Reflector">8" Dobsonian Reflector</option>
                        <option value="Celestron NexStar 4SE">4" Refractor (Celestron)</option>
                        <option value="Solar Observatory Refractor">Solar Observatory Refractor</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Observation Date</label>
                      <input 
                        type="date" 
                        value={bookDate} 
                        onChange={(e) => setBookDate(e.target.value)} 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Time Slot (IST)</label>
                      <select 
                        value={bookSlot} 
                        onChange={(e) => setBookSlot(e.target.value)}
                      >
                        <option value="18:00–19:30">18:00–19:30 (Early Dusk)</option>
                        <option value="19:30–21:00">19:30–21:00 (Early Night)</option>
                        <option value="21:00–22:30">21:00–22:30 (Mid Night)</option>
                        <option value="22:30–00:00">22:30–00:00 (Midnight Zenith)</option>
                        <option value="00:00–01:30">00:00–01:30 (Late Night)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Observation Purpose</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Astrophotography of Andromeda Galaxy (M31)..." 
                        value={bookPurpose} 
                        onChange={(e) => setBookPurpose(e.target.value)} 
                        required 
                      />
                    </div>

                    {bookingError && <div className="error-message">⚠️ {bookingError}</div>}
                    {bookingSuccess && <div className="success-message">✦ {bookingSuccess}</div>}

                    <button type="submit" className="cta-btn">Lock Astronomical Coordinates ✦</button>
                  </form>
                ) : (
                  <p style={{ color: "var(--fade)", textAlign: "center" }}>
                    * You must <a href="/login" style={{ color: "var(--gold)" }}>login</a> to reserve equipment. *
                  </p>
                )}
              </div>
            </div>

            {/* Right: Personal Observation Logbook & Ledger */}
            <div className="telescope-right">
              
              {/* FEATURE 4: PERSONAL OBSERVATION LOGBOOK WIDGET */}
              <div className="ornate-card" style={{ marginBottom: "1.5rem" }}>
                <div className="corner-tl"></div><div className="corner-tr"></div><div className="corner-bl"></div><div className="corner-br"></div>
                <h3>✦ Personal Observation Logbook</h3>
                {user ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <form onSubmit={handleCreateLog} className="telescope-booking-form">
                      <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                        <div>
                          <label>Object Target</label>
                          <input type="text" placeholder="e.g. M31 Galaxy" value={logObject} onChange={(e) => setLogObject(e.target.value)} required style={{ padding: "0.5rem", fontSize: "0.85rem" }} />
                        </div>
                        <div>
                          <label>Observation Date</label>
                          <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} required style={{ padding: "0.5rem", fontSize: "0.85rem" }} />
                        </div>
                      </div>
                      
                      <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                        <div>
                          <label>Seeing Conditions</label>
                          <select value={logConditions} onChange={(e) => setLogConditions(e.target.value)} style={{ padding: "0.5rem", fontSize: "0.85rem" }}>
                            <option value="Perfect">Perfect Clear</option>
                            <option value="Good">Good Seeing</option>
                            <option value="Hazy">Hazy Skies</option>
                            <option value="Cloudy">Partly Cloudy</option>
                          </select>
                        </div>
                        <div>
                          <label>Eyepiece Setup</label>
                          <input type="text" placeholder="e.g. 9mm Plössl" value={logEyepiece} onChange={(e) => setLogEyepiece(e.target.value)} style={{ padding: "0.5rem", fontSize: "0.85rem" }} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Observational Notes</label>
                        <textarea rows={2} placeholder="Detail core features resolved, colors, or celestial elevations..." value={logNotes} onChange={(e) => setLogNotes(e.target.value)} style={{ padding: "0.5rem", fontSize: "0.85rem" }} />
                      </div>

                      {logError && <div className="error-message">⚠️ {logError}</div>}
                      {logSuccess && <div className="success-message">✦ {logSuccess}</div>}

                      <button type="submit" className="cta-btn" style={{ padding: "0.5rem 1rem", fontSize: "0.78rem" }}>Catalog Observation Log ✦</button>
                    </form>

                    <div className="observatory-ledger" style={{ padding: "1rem", marginTop: "1rem", background: "rgba(3,2,10,0.5)" }}>
                      <h4 style={{ fontFamily: "Cinzel, serif", fontSize: "0.72rem", color: "var(--gold)", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>✦ Recorded Observation Logs</h4>
                      <div className="ledger-bookings" style={{ maxHeight: "180px" }}>
                        {logbookEntries.length > 0 ? (
                          logbookEntries.map((log) => (
                            <div key={log.id} className="ledger-card" style={{ padding: "0.6rem", fontSize: "0.8rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Cinzel, serif", color: "var(--gold-pale)" }}>
                                <span>{log.object}</span>
                                <span>{log.date}</span>
                              </div>
                              <p style={{ fontSize: "0.78rem", color: "var(--fade)", margin: "0.2rem 0" }}>
                                <strong>Seeing:</strong> {log.skyConditions} · <strong>Setup:</strong> {log.eyepiece}
                              </p>
                              <p style={{ fontStyle: "italic", fontSize: "0.78rem" }}>"{log.notes}"</p>
                              <button onClick={() => handleDeleteLog(log.id)} style={{ alignSelf: "flex-end", background: "none", border: "none", color: "var(--blood-red)", fontSize: "0.65rem", textTransform: "uppercase", cursor: "pointer", fontFamily: "Cinzel, serif", marginTop: "0.3rem" }}>[ Dissolve Entry ]</button>
                            </div>
                          ))
                        ) : (
                          <p style={{ textAlign: "center", color: "var(--fade)", fontSize: "0.78rem" }}>No cataloged observation logs found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "var(--fade)", textAlign: "center", fontSize: "0.85rem" }}>
                    * Log in to record your telescope observations. *
                  </p>
                )}
              </div>

              {/* Dynamic Ledger Bookings */}
              <div className="observatory-ledger">
                <h3>✦ Active Equipment Ledger</h3>
                <div className="ledger-bookings">
                  {bookings.length > 0 ? (
                    bookings.map((b) => (
                      <div key={b.id} className="ledger-card">
                        <div className="ledger-top">
                          <span>{b.userName}</span>
                          <span>{b.date} ({b.timeSlot})</span>
                        </div>
                        <div className="ledger-bottom">
                          <span>{b.instrument}</span>
                          <span>Purpose: "{b.purpose}"</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: "center", color: "var(--fade)" }}>Observatory ledger is currently empty.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE COUNCIL OF STARS */}
      <section id="order">
        <div className="section-inner">
          <div className="section-header reveal">
            <span className="section-glyph">✦</span>
            <h2 className="section-title">The Council of Stars</h2>
            <div className="section-divider">
              <div className="divider-line"></div><span className="divider-symbol">✦</span><div className="divider-line right"></div>
            </div>
            <p className="section-lede">The scholars who guide the society, cataloging discoveries, maintaining coordinates, and preserving our instruments.</p>
          </div>

          {/* FEATURE 1: Council Challenge Quiz entry card */}
          <div className="council-challenge-area reveal" style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
            <div className="ornate-card" style={{ width: "100%", maxWidth: "680px", textAlign: "center" }}>
              <div className="corner-tl"></div><div className="corner-tr"></div><div className="corner-bl"></div><div className="corner-br"></div>
              <h3 style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", letterSpacing: "0.2em", fontSize: "1.1rem" }}>✦ THE COUNCIL CHALLENGE ✦</h3>
              <p style={{ fontFamily: "Spectral, serif", margin: "1rem 0", fontSize: "0.95rem", lineSize: "1.8", color: "var(--parchment)" }}>
                Apprentices and novices are challenged to verify their cosmological calculations before the Council of Stars. Answer 5 strict coordinates correctly to dynamically elevate your fellowship rank to <strong>SCHOLAR</strong> on the spot!
              </p>
              
              {user ? (
                user.role === "NOVICE" ? (
                  <button onClick={() => setShowQuizModal(true)} className="cta-btn">Commune with the Council (Take Quiz)</button>
                ) : (
                  <div style={{ color: "var(--glow-teal)", fontFamily: "Cinzel, serif", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                    ✓ RANK ELEVATED: You sit as a distinguished <strong>{user.role} ({user.title})</strong> on the Council.
                  </div>
                )
              ) : (
                <p style={{ color: "var(--fade)", fontSize: "0.85rem" }}>* You must be logged in to commune with the Council. *</p>
              )}
            </div>
          </div>

          <div className="order-grid reveal">
            <div className="member-card">
              <div className="member-avatar">🔭</div>
              <h4>Arjun Verma</h4>
              <span className="member-role">Astrophotography Lead</span>
            </div>
            <div className="member-card">
              <div className="member-avatar">🌌</div>
              <h4>Priya Sharma</h4>
              <span className="member-role">Quantum Theorist</span>
            </div>
            <div className="member-card">
              <div className="member-avatar">⚗️</div>
              <h4>Shreya Agarwal</h4>
              <span className="member-role">Deep Sky Officer</span>
            </div>
            <div className="member-card">
              <div className="member-avatar">☀️</div>
              <h4>Dev Pandey</h4>
              <span className="member-role">Solar Observer</span>
            </div>
            <div className="member-card">
              <div className="member-avatar">🪐</div>
              <h4>Galileo Galilei</h4>
              <span className="member-role">High Celestial Priest</span>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC INTERACTIVE COUNCIL CHALLENGE MODAL */}
      {showQuizModal && user && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(3,2,10,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div className="ornate-card" style={{ width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto", position: "relative", padding: "2.5rem" }}>
            <div className="corner-tl"></div><div className="corner-tr"></div><div className="corner-bl"></div><div className="corner-br"></div>
            
            <button 
              onClick={() => {
                setShowQuizModal(false);
                setQuizSubmitted(false);
                setQuizFeedback("");
              }} 
              style={{ position: "absolute", top: "1rem", right: "1.5rem", background: "none", border: "none", color: "var(--fade)", fontSize: "1.8rem", cursor: "pointer" }}
            >
              ×
            </button>

            <h3 style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", fontSize: "1.05rem", letterSpacing: "0.15em", textAlign: "center", marginBottom: "1.5rem" }}>✦ CHALLENGE OF THE STAR COUNCIL</h3>
            
            {!quizSubmitted ? (
              <form onSubmit={handleQuizSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem", fontFamily: "Spectral, serif", fontSize: "0.95rem" }}>
                
                <div className="form-group">
                  <label>1. General Relativity defines gravity as what physical phenomenon?</label>
                  <select value={quizAnswers.q1} onChange={(e) => setQuizAnswers({ ...quizAnswers, q1: e.target.value })} required style={{ padding: "0.5rem" }}>
                    <option value="">Select an answer...</option>
                    <option value="magnetic-attraction">Electromagnetic magnetic attraction</option>
                    <option value="general-relativity">Spacetime curvature caused by mass and energy</option>
                    <option value="quantum-gravitons">Instantaneous particle collisions (gravitons)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>2. What did Einstein refer to as "spooky action at a distance"?</label>
                  <select value={quizAnswers.q2} onChange={(e) => setQuizAnswers({ ...quizAnswers, q2: e.target.value })} required style={{ padding: "0.5rem" }}>
                    <option value="">Select an answer...</option>
                    <option value="blackhole-singularities">Spacetime black hole singularities</option>
                    <option value="quantum-entanglement">Quantum entanglement between twin particles</option>
                    <option value="time-dilation">Relativistic time dilation at light speeds</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>3. How do black holes slowly evaporate over billions of years?</label>
                  <select value={quizAnswers.q3} onChange={(e) => setQuizAnswers({ ...quizAnswers, q3: e.target.value })} required style={{ padding: "0.5rem" }}>
                    <option value="">Select an answer...</option>
                    <option value="hawking-radiation">Evaporating through quantum Hawking Radiation</option>
                    <option value="matter-spewing">Expelling central core matter through jets</option>
                    <option value="gravitational-decay">Decaying under extreme gravitational friction</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>4. What is the most critical technical parameter determining a telescope's power?</label>
                  <select value={quizAnswers.q4} onChange={(e) => setQuizAnswers({ ...quizAnswers, q4: e.target.value })} required style={{ padding: "0.5rem" }}>
                    <option value="">Select an answer...</option>
                    <option value="eyepiece-length">The focal length of the secondary eyepiece</option>
                    <option value="magnification">The absolute digital magnification power (1000x+)</option>
                    <option value="aperture">The primary aperture diameter for gathering starlight</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>5. Which historic ISRO mission accomplished the first soft landing near the lunar south pole?</label>
                  <select value={quizAnswers.q5} onChange={(e) => setQuizAnswers({ ...quizAnswers, q5: e.target.value })} required style={{ padding: "0.5rem" }}>
                    <option value="">Select an answer...</option>
                    <option value="mangalyaan">Mangalyaan (Mars Orbiter Mission)</option>
                    <option value="chandrayaan-3">Chandrayaan-3 (Lunar Lander Mission, 2023)</option>
                    <option value="gaganyaan-1">Gaganyaan-1 (Human Spaceflight Test)</option>
                  </select>
                </div>

                <button type="submit" className="cta-btn" style={{ width: "100%" }}>Petition the Council ✦</button>
              </form>
            ) : (
              <div style={{ textAlign: "center", fontFamily: "Spectral, serif" }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{quizPassed ? "🏆" : "🔭"}</div>
                <h4 style={{ fontFamily: "Cinzel, serif", color: quizPassed ? "var(--glow-teal)" : "var(--blood-red)", fontSize: "1.1rem", marginBottom: "1rem" }}>
                  {quizPassed ? "RANK ELEVATED!" : "PETITION REJECTED"}
                </h4>
                <p style={{ fontSize: "1rem", lineHeight: "1.8", color: "var(--parchment)", marginBottom: "1.5rem" }}>{quizFeedback}</p>
                
                {quizPassed ? (
                  <button 
                    onClick={() => {
                      setShowQuizModal(false);
                      setQuizSubmitted(false);
                      setQuizFeedback("");
                      router.refresh();
                    }} 
                    className="cta-btn"
                  >
                    Take Your Seat on the Council ✦
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizFeedback("");
                    }} 
                    className="cta-btn-ghost"
                  >
                    Gaze Deeper and Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer>
        <span className="footer-sigil">Nebula</span>
        <div className="footer-motto">"Per aspera ad astra" — Through hardship to the stars</div>

        <ul className="footer-links">
          <li><a href="#">The Society</a></li>
          <li><a href="#">Events</a></li>
          <li><a href="#">Codex</a></li>
          <li><a href="#">Observatory</a></li>
          <li><a href="#">The Order</a></li>
          <li><a href="#">Join Us</a></li>
        </ul>

        <div className="footer-rule"></div>

        {/* NUTAN section */}
        <div className="reveal">
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.4em", color: "var(--fade)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            ✦ &nbsp; Visioned & Crafted By &nbsp; ✦
          </div>

          <div style={{ border: "1px solid rgba(201, 162, 39, 0.25)", display: "inline-block", padding: "2.5rem 4rem", background: "rgba(42, 14, 74, 0.3)", position: "relative" }}>
            {/* corner decorations */}
            <div style={{ position: "absolute", top: "-1px", left: "-1px", width: "20px", height: "20px", borderTop: "2px solid var(--gold)", borderLeft: "2px solid var(--gold)" }}></div>
            <div style={{ position: "absolute", top: "-1px", right: "-1px", width: "20px", height: "20px", borderTop: "2px solid var(--gold)", borderRight: "2px solid var(--gold)" }}></div>
            <div style={{ position: "absolute", bottom: "-1px", left: "-1px", width: "20px", height: "20px", borderBottom: "2px solid var(--gold)", borderLeft: "2px solid var(--gold)" }}></div>
            <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "20px", height: "20px", borderBottom: "2px solid var(--gold)", borderRight: "2px solid var(--gold)" }}></div>

            <p className="founder-note">
              Like the nebula that births new stars from ancient dust,<br />
              every new idea carries within it the seeds of a thousand futures.
            </p>
            <span className="founder-name">✦ Nutan ✦</span>
            <p className="founder-meaning">नूतन — <em>She who embodies all that is New, Fresh, and Unprecedented</em></p>
            <div style={{ marginTop: "1.2rem", fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.25em", color: "var(--fade)", textTransform: "uppercase" }}>
              A.P.S. Member · Astronomy & Physics Society · Bhopal
            </div>
          </div>
        </div>

        <div className="footer-rule" style={{ marginTop: "3rem" }}></div>

        <p className="footer-copy">
          NEBULA · Astronomy & Physics Society · Est. 2024<br />
          "The cosmos is not a collection of facts — it is a way of thinking."
        </p>
      </footer>

      {/* BABY GALILEO CHATBOT */}
      <div className="galileo-container">
        {!chatOpen && (
          <div className="galileo-bubble" onClick={() => setChatOpen(true)}>
            Hark, stargazer! Commune with Galileo Bot ✦
          </div>
        )}

        <div className="galileo-mascot" onClick={() => setChatOpen(!chatOpen)}>
          <svg viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="35" r="28" fill="rgba(42, 14, 74, 0.85)" stroke="#c9a227" strokeWidth="1.5" />
            <circle cx="40" cy="35" r="20" fill="none" stroke="#c9a227" strokeWidth="0.8" strokeDasharray="3 2" />
            <circle cx="28" cy="32" r="3" fill="#3dcdc4" className="eye-glow" />
            <circle cx="52" cy="32" r="3" fill="#3dcdc4" className="eye-glow" />
            <path d="M25 45 Q40 65 55 45 Q40 55 25 45 Z" fill="#e8dfc0" opacity="0.8" />
            <line x1="28" y1="48" x2="33" y2="58" stroke="#e8dfc0" strokeWidth="1.5" />
            <line x1="52" y1="48" x2="47" y2="58" stroke="#e8dfc0" strokeWidth="1.5" />
            <line x1="40" y1="46" x2="40" y2="62" stroke="#e8dfc0" strokeWidth="2" />
            <polygon points="40,3 44,12 36,12" fill="#c9a227" />
            <polygon points="12,23 22,23 18,15" fill="#c9a227" />
            <polygon points="68,23 58,23 62,15" fill="#c9a227" />
            <rect x="25" y="65" width="30" height="25" rx="5" fill="rgba(8,7,26,0.9)" stroke="#c9a227" strokeWidth="1" />
            <circle cx="40" cy="77" r="6" fill="#c9a227" opacity="0.8" />
          </svg>
        </div>

        <div className={`galileo-chat ${chatOpen ? "" : "hidden"}`}>
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-avatar">🔭</div>
              <div>
                <h4>Galileo Bot</h4>
                <p>High Priest Assistant</p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setChatOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={msg.sender === "bot" ? "bot-msg" : "user-msg"}
                style={{ whiteSpace: "pre-line" }}
              >
                {msg.text}
              </div>
            ))}
            
            {botTyping && (
              <div className="bot-msg">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-suggestions">
            <button onClick={() => handleSendChat("What is Relativity?")}>Relativity</button>
            <button onClick={() => handleSendChat("How to resolve Cassini Division on Saturn?")}>Saturn Gap</button>
            <button onClick={() => handleSendChat("Where is Block C rooftop?")}>Observatory Location</button>
          </div>

          <div className="chat-input-wrap">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Ask Galileo of space and physics..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendChat(chatInput);
              }}
            />
            <button 
              className="chat-send" 
              onClick={() => handleSendChat(chatInput)}
            >
              COMMUNE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
