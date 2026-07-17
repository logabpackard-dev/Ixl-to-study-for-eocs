import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Search, 
  Plus, 
  X, 
  Battery, 
  BatteryCharging, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Home, 
  Shield, 
  ArrowRight,
  Terminal,
  VolumeX,
  Volume2,
  Gamepad2,
  Tv,
  ChevronRight,
  ArrowLeft,
  Film,
  Play,
  Star,
  Flame
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MapleTVHub from "./components/MapleTVHub";

interface Tab {
  id: string;
  title: string;
  url: string;
  proxyUrl: string;
  type?: "browser" | "games" | "tv";
}

const SCRATCH_GAMES = [
  {
    id: "10126215",
    title: "Paper Minecraft",
    author: "griffpatch",
    thumbnail: "https://uploads.scratch.mit.edu/projects/thumbnails/10126215.png",
    description: "A legendary 2D open-world Minecraft clone. Mine, craft, build, and survive in survival or creative mode.",
    category: "Sandbox",
    plays: "45.2M"
  },
  {
    id: "389464290",
    title: "Getting Over It",
    author: "griffpatch",
    thumbnail: "https://uploads.scratch.mit.edu/projects/thumbnails/389464290.png",
    description: "Can you climb the mountain with only a hammer and a cooking pot? Extreme physics precision game.",
    category: "Physics",
    plays: "12.8M"
  },
  {
    id: "113543594",
    title: "Scratcharia (Terraria)",
    author: "griffpatch",
    thumbnail: "https://uploads.scratch.mit.edu/projects/thumbnails/113543594.png",
    description: "Explore, dig, build, and defeat bosses in this massive 2D Terraria clone. Fully-featured crafting system.",
    category: "Sandbox",
    plays: "8.4M"
  },
  {
    id: "132644265",
    title: "Super Mario Bros",
    author: "Brad-Games",
    thumbnail: "https://uploads.scratch.mit.edu/projects/thumbnails/132644265.png",
    description: "The complete iconic NES Super Mario Bros levels faithfully remade on Scratch with responsive physics.",
    category: "Platformer",
    plays: "19.5M"
  },
  {
    id: "105500895",
    title: "Geometry Dash Lite",
    author: "griffpatch",
    thumbnail: "https://uploads.scratch.mit.edu/projects/thumbnails/105500895.png",
    description: "Jump, fly, and flip your way through rhythm-based platform obstacles to an amazing electronic beat.",
    category: "Rhythm",
    plays: "22.1M"
  },
  {
    id: "25102551",
    title: "Pacman Arcade",
    author: "PolyMars",
    thumbnail: "https://uploads.scratch.mit.edu/projects/thumbnails/25102551.png",
    description: "Eat all the pac-dots, avoid Blinky, Pinky, Inky, and Clyde, and grab the fruit in this retro classic.",
    category: "Arcade",
    plays: "4.1M"
  },
  {
    id: "140136235",
    title: "Minecraft 3D Engine",
    author: "griffpatch",
    thumbnail: "https://uploads.scratch.mit.edu/projects/thumbnails/140136235.png",
    description: "An unbelievable tech demo rendering a fully-explorable 3D blocks world inside the Scratch 2D vector engine.",
    category: "3D / Tech",
    plays: "3.7M"
  },
  {
    id: "111818274",
    title: "Slither.io Arcade",
    author: "griffpatch",
    thumbnail: "https://uploads.scratch.mit.edu/projects/thumbnails/111818274.png",
    description: "Eat orbs, grow longer, trap other player snakes, and dominate the leaderboard in this IO recreation.",
    category: "Arcade",
    plays: "7.9M"
  }
];

const MAPLE_TV_VIDEOS = [
  {
    id: "jfKfPfyJRdk",
    title: "Lofi Hip Hop Radio 📚 - Beats to Study/Relax to",
    channel: "Lofi Girl",
    views: "980M",
    thumbnail: "https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg",
    description: "The ultimate background soundtrack for studying, coding, gaming, or relaxing."
  },
  {
    id: "dbx89H0g7C4",
    title: "Extreme $100,000 Tag!",
    channel: "MrBeast",
    views: "280M",
    thumbnail: "https://img.youtube.com/vi/dbx89H0g7C4/hqdefault.jpg",
    description: "Can we survive a game of extreme tag with high stakes and insane obstacles?"
  },
  {
    id: "yK88S4621p8",
    title: "Backyard Squirrel Maze 1.0 - Obstacle Course",
    channel: "Mark Rober",
    views: "110M",
    thumbnail: "https://img.youtube.com/vi/yK88S4621p8/hqdefault.jpg",
    description: "Building an incredibly detailed obstacle course for squirrels in the backyard."
  },
  {
    id: "lY2yjAdbvdg",
    title: "Minecraft Speedrunner VS 4 Hunters (Grand Finale)",
    channel: "Dream",
    views: "95M",
    thumbnail: "https://img.youtube.com/vi/lY2yjAdbvdg/hqdefault.jpg",
    description: "The ultimate final showdown between the speedrunner and four relentless hunters."
  },
  {
    id: "v3Z6yV2rSgw",
    title: "The Ultimate Clean Minimal Desk Setup Tour",
    channel: "Linus Tech Tips",
    views: "8.5M",
    thumbnail: "https://img.youtube.com/vi/v3Z6yV2rSgw/hqdefault.jpg",
    description: "Exploring the best ergonomic, high-performance workstation setups for developers."
  },
  {
    id: "hY7m5jjJ9mM",
    title: "Glitterbomb Payback on Package Thieves",
    channel: "Mark Rober",
    views: "140M",
    thumbnail: "https://img.youtube.com/vi/hY7m5jjJ9mM/hqdefault.jpg",
    description: "Custom engineered high-tech glitterbomb packages to catch porch pirates."
  }
];

const POPULAR_CHANNELS = [
  {
    id: "UCX6OQ3DkcsbYNE6H8uQQuVA",
    name: "MrBeast",
    avatar: "https://img.youtube.com/vi/dbx89H0g7C4/hqdefault.jpg",
    subscribers: "250M subscribers",
    description: "Insane challenges, giveaways, and world-record stunts!"
  },
  {
    id: "UCSJ4gkVC6NrvIIEQyruUQNQ",
    name: "Lofi Girl",
    avatar: "https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg",
    subscribers: "14.3M subscribers",
    description: "Your favorite chill lo-fi beats for relaxing, studying, or sleeping."
  },
  {
    id: "UC7_gcsvUpEN1JIg_mF_F89Q",
    name: "griffpatch",
    avatar: "https://uploads.scratch.mit.edu/projects/thumbnails/10126215.png",
    subscribers: "1.8M subscribers",
    description: "Coding scratch tutorials, complex designs, and epic games walkthrough."
  },
  {
    id: "UCYO_jatYMyarJ7qH_mMXchQ",
    name: "Mark Rober",
    avatar: "https://img.youtube.com/vi/yK88S4621p8/hqdefault.jpg",
    subscribers: "30.5M subscribers",
    description: "Former NASA engineer and high-tech prankster/scientist."
  },
  {
    id: "UCXuqSBlHAE6Xw-yeJA0Tunw",
    name: "Linus Tech Tips",
    avatar: "https://img.youtube.com/vi/v3Z6yV2rSgw/hqdefault.jpg",
    subscribers: "15.6M subscribers",
    description: "High-tech gear reviews, computer builds, and futuristic tech setup tours."
  }
];

export default function App() {
  // Desktop OS Tabs State
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "desktop",
      title: "Desktop Home",
      url: "desktop",
      proxyUrl: ""
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("desktop");
  
  // Search bar state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Computer's real-time Clock state
  const [currentTime, setCurrentTime] = useState("");
  
  // Battery status state
  const [batteryLevel, setBatteryLevel] = useState(92);
  const [isCharging, setIsCharging] = useState(false);

  // Quotes list requested by user
  const quotes = [
    "hi my name is maple",
    "lightspeed sucks",
    "i like scratch",
    "check out my scratch acount https://scratch.mit.edu/users/Maple-Studi0s/"
  ];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Stealth cloak mode state
  const [cloakMask, setCloakMask] = useState<"docs" | "classroom" | "canvas" | "drive" | "off">(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname.toLowerCase();
      if (host.includes("github") || host.includes("vercel") || host.includes("git")) {
        return "docs";
      }
    }
    return "off";
  });

  const cloakMode = cloakMask !== "off";

  const getLabel = (key: string) => {
    if (cloakMode) {
      switch (key) {
        case "brand_name": return "Maple Workspace";
        case "brand_badge": return "educational system";
        case "launch_button": return "Access Resource";
        case "search_placeholder": return "Access educational resource address or study link... (e.g. scratch.mit.edu)";
        case "footer_text": return "Secure document gateway is active. Search and explore educational content freely.";
        case "bypass_active": return "Environment: Secure SSL Sync";
        case "unblocked_games": return "Interactive Learning Modules";
        case "unblocked_youtube_client": return "Educational Media Sync Container";
        case "games_description": return "Interactive physics, rhythm, and logic learning blocks running compiled engines.";
        case "tv_description": return "Stream high-definition tutorial, documentation, and lofi focus audio videos instantly.";
        case "unblocker_warning": return "Maple Portal provides access to interactive resources and documents for research.";
        default: return key;
      }
    } else {
      switch (key) {
        case "brand_name": return "Maple Unblocc";
        case "brand_badge": return "unblocker";
        case "launch_button": return "Launch Proxy";
        case "search_placeholder": return "Unblock search or enter URL... (e.g. scratch.mit.edu, crazygames.com)";
        case "footer_text": return "Lightspeed school filter blocks can't touch us. Enter any address in the search bar below to surf freely.";
        case "bypass_active": return "Bypass: Active";
        case "unblocked_games": return "unblocked games";
        case "unblocked_youtube_client": return "unblocked youtube client";
        case "games_description": return "Play popular Scratch games like Paper Minecraft and Scratcharia at ultra-smooth 60 FPS. 100% working, unblocked console.";
        case "tv_description": return "Watch trending videos, search, and listen to music with high-speed unblocked media players and instant mirror servers.";
        case "unblocker_warning": return "Lightspeed school filter blocks can't touch us. Enter any address in the search bar below to surf freely.";
        default: return key;
      }
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      let titleVal = "Maple Unblocc";
      let iconVal = "/favicon.ico";

      if (cloakMask === "docs") {
        titleVal = "Google Docs";
        iconVal = "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico";
      } else if (cloakMask === "classroom") {
        titleVal = "Google Classroom";
        iconVal = "https://ssl.gstatic.com/classroom/favicon.png";
      } else if (cloakMask === "canvas") {
        titleVal = "Dashboard";
        iconVal = "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e05d51a6d3.ico";
      } else if (cloakMask === "drive") {
        titleVal = "My Drive - Google Drive";
        iconVal = "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png";
      }

      document.title = titleVal;

      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = iconVal;
    }
  }, [cloakMask]);

  // Setup Clock and Battery
  useEffect(() => {
    // Clock tick
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // Battery API check
    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      (navigator as any).getBattery().then((bat: any) => {
        setBatteryLevel(Math.round(bat.level * 100));
        setIsCharging(bat.charging);

        bat.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(bat.level * 100));
        });
        bat.addEventListener("chargingchange", () => {
          setIsCharging(bat.charging);
        });
      }).catch(() => {
        // Fallback set
      });
    }

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  // Quotes cycler every 4.5 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4500);
    return () => clearInterval(quoteInterval);
  }, []);

  // Launch a URL in a new proxy tab
  const launchProxy = (targetUrl: string) => {
    if (!targetUrl.trim()) return;

    let formattedUrl = targetUrl.trim();
    // Prepend protocol if absent
    if (!/^https?:\/\//i.test(formattedUrl)) {
      if (formattedUrl.includes(".") && !formattedUrl.includes(" ")) {
        formattedUrl = "https://" + formattedUrl;
      } else {
        formattedUrl = `https://search.brave.com/search?q=${encodeURIComponent(formattedUrl)}`;
      }
    }

    const newTabId = Math.random().toString(36).substring(2, 9);
    
    let hostname = "Web Page";
    try {
      hostname = new URL(formattedUrl).hostname.replace("www.", "");
    } catch (e) {}

    let proxyUrl = `/api/proxy/raw?url=${encodeURIComponent(formattedUrl)}`;
    let tabType: "browser" | "games" | "tv" = "browser";

    // Client-side instant routing for Scratch / TurboWarp to avoid proxy WASM breakages
    if (/scratch\.mit\.edu|turbowarp\.org/i.test(formattedUrl)) {
      tabType = "games";
      const projectMatch = formattedUrl.match(/(?:projects\/|\/)(\d+)/i);
      if (projectMatch && projectMatch[1]) {
        formattedUrl = `maple-games?project=${projectMatch[1]}`;
        hostname = `Scratch Game #${projectMatch[1]}`;
      } else {
        formattedUrl = "maple-games";
        hostname = "Maple Games 🎮";
      }
      proxyUrl = "";
    }

    // Client-side instant routing for YouTube / Piped to avoid proxy buffering latency
    else if (/youtube\.com|youtu\.be|piped\.video/i.test(formattedUrl)) {
      tabType = "tv";
      const videoMatch = formattedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i);
      if (videoMatch && videoMatch[1]) {
        formattedUrl = `maple-tv?video=${videoMatch[1]}`;
        hostname = "Maple TV 🍁📺";
      } else {
        const searchMatch = formattedUrl.match(/(?:search_query|q|search)=([^&]+)/i);
        if (searchMatch && searchMatch[1]) {
          formattedUrl = `maple-tv?search=${searchMatch[1]}`;
          hostname = "Maple TV 🍁📺";
        } else {
          formattedUrl = "maple-tv";
          hostname = "Maple TV 🍁📺";
        }
      }
      proxyUrl = "";
    }

    const newTab: Tab = {
      id: newTabId,
      title: hostname,
      url: formattedUrl,
      proxyUrl: proxyUrl,
      type: tabType
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newTabId);
    setSearchQuery("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    launchProxy(searchQuery);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabId === "desktop") return;

    const remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);

    if (activeTabId === tabId) {
      setActiveTabId("desktop");
    }
  };

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#110603] text-[#FFE8D6] font-sans selection:bg-[#D4A373]/30 selection:text-[#FFB5A7] flex flex-col relative">
      
      {/* Warm Autumn ambient background with glowing maple leaves vibes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3A1305] via-[#110603] to-[#080201] pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4a37305_1px,transparent_1px),linear-gradient(to_bottom,#d4a37305_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>
      
      {/* Dynamic warm maple glows */}
      <div className="absolute top-1/3 left-1/4 w-[30rem] h-[30rem] bg-[#A63A13]/8 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-[#F39A59]/8 rounded-full blur-3xl pointer-events-none"></div>

      {/* TOP SIDEBAR / TOP PANEL */}
      <header className="border-b border-[#3D1A0E] bg-[#1B0C06]/95 backdrop-blur-md flex flex-col z-40 shrink-0 select-none shadow-lg shadow-black/40">
        
        {/* Main Header Row */}
        <div className="flex items-center justify-between px-6 py-2.5">
          
          {/* Site Name and Details */}
          <div className="flex flex-col">
            <div 
              onClick={() => setActiveTabId("desktop")} 
              className="flex items-center space-x-2.5 cursor-pointer hover:opacity-85 transition active:scale-95"
              id="top-brand"
            >
              {/* Little maple leaf accent */}
              <span className="text-xl">🍁</span>
              <span className="text-base font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FF7E47] via-[#FFB347] to-[#D4A373]">
                {getLabel("brand_name")}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#A63A13]/20 text-[#FF9E79] font-mono border border-[#A63A13]/40 animate-pulse">
                {getLabel("brand_badge")}
              </span>
            </div>

            {/* QUOTE CYCLER DIRECTLY UNDER THE SITE NAME IN THE TOP SIDEBAR */}
            <div className="mt-1 h-5 flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs font-medium text-[#D4A373] italic flex items-center"
                >
                  <span className="text-[#FF7E47] mr-1">“</span>
                  {quotes[currentQuoteIndex].includes("https://scratch") ? (
                    <span className="flex items-center gap-1">
                      check out my scratch acount{" "}
                      <a 
                        href="https://scratch.mit.edu/users/Maple-Studi0s/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#FF9E79] underline hover:text-[#FFB347] font-semibold flex items-center gap-0.5"
                      >
                        Maple-Studi0s/ <ExternalLink className="h-2.5 w-2.5 inline" />
                      </a>
                    </span>
                  ) : (
                    quotes[currentQuoteIndex]
                  )}
                  <span className="text-[#FF7E47] ml-1">”</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Center: Open Tabs display */}
          <div className="flex items-center space-x-1.5 max-w-xl mx-4 overflow-x-auto scrollbar-none py-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group relative flex items-center space-x-2 px-3 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-all duration-150 border select-none whitespace-nowrap ${
                    isActive 
                      ? "bg-[#2D1409] border-[#5E2914] text-[#FFE8D6] shadow-sm shadow-black/30" 
                      : "bg-[#160A05]/60 border-transparent text-[#D4A373]/80 hover:bg-[#220F07]/60 hover:text-[#FFE8D6]"
                  }`}
                >
                  {tab.id === "desktop" ? (
                    <Home className="h-3 w-3 text-[#FF7E47]" />
                  ) : (
                    <Globe className={`h-3 w-3 ${isActive ? "text-[#FFB347]" : "text-gray-500"}`} />
                  )}
                  
                  <span className="max-w-[110px] truncate">{tab.title}</span>
                  
                  {tab.id !== "desktop" && (
                    <button
                      onClick={(e) => closeTab(tab.id, e)}
                      className="p-0.5 rounded hover:bg-[#5E2914] hover:text-[#FF9E79] transition"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              );
            })}
            <button 
              onClick={() => launchProxy("https://google.com")}
              className="p-1 text-[#D4A373] hover:text-[#FFE8D6] rounded hover:bg-[#220F07] transition"
              title="New Tab"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Right: Computer time & Battery status */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            
            {/* Stealth Cloak Mode Dropdown */}
            <div className="relative flex items-center">
              <span className="text-[10px] text-[#D4A373]/80 mr-1.5 hidden md:inline">Cloak Mask:</span>
              <select
                value={cloakMask}
                onChange={(e) => setCloakMask(e.target.value as any)}
                className="bg-[#160A05] text-[#FFE8D6] border border-[#3D1A0E] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none focus:border-[#FF7E47] transition cursor-pointer select-none"
                title="Switches tab icon & title instantly to hide from school filters (Lightspeed) or teachers."
              >
                <option value="off">🕶️ Off / Uncloaked</option>
                <option value="docs">📄 Google Docs</option>
                <option value="classroom">🏫 Google Classroom</option>
                <option value="canvas">🎨 Canvas LMS</option>
                <option value="drive">💾 Google Drive</option>
              </select>
            </div>

            {/* Battery Indicator */}
            <div className="flex items-center space-x-1.5 bg-[#160A05] px-2 py-1 rounded border border-[#3D1A0E]" title={isCharging ? "Charging" : "Discharging"}>
              {isCharging ? (
                <BatteryCharging className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              ) : (
                <Battery className="h-3.5 w-3.5 text-[#FFB347]" />
              )}
              <span className={isCharging ? "text-emerald-400" : "text-[#FFE8D6]"}>
                {batteryLevel}%
              </span>
            </div>

            {/* Real Computer Time */}
            <div className="flex items-center space-x-1.5 bg-[#160A05] px-2.5 py-1 rounded border border-[#3D1A0E] text-[#FFE8D6]">
              <Clock className="h-3.5 w-3.5 text-[#FF7E47]" />
              <span>{currentTime || "12:30:00 PM"}</span>
            </div>

          </div>

        </div>
      </header>

      {/* VIEWPORT AREA */}
      <div className="flex-1 relative overflow-hidden z-10 flex flex-col">
        
        <AnimatePresence mode="wait">
          {activeTab.id === "desktop" ? (
            
            /* ===== OS DESKTOP VIEW WITH AUTUMN THEME ===== */
            <motion.div
              key="desktop-home"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col items-center justify-between p-6 max-w-7xl mx-auto w-full relative min-h-0"
            >
              
              {/* Small instructions / help widget */}
              <div className="w-full flex justify-end">
                <span className="text-[11px] font-mono bg-[#1B0C06]/80 text-[#D4A373] px-3 py-1 rounded-full border border-[#3D1A0E] flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-[#FF7E47]" /> {getLabel("bypass_active")}
                </span>
              </div>

              {/* CENTERPIECE: MAPLE LEAF LOGO ONLY & MISSPELLED NAME */}
              <div className="flex flex-col items-center text-center my-auto py-8">
                
                {/* Glowing Logo Frame containing ONLY the maple leaf image with smooth floating and swaying */}
                <motion.div 
                  animate={{ 
                    y: [-12, 12, -12],
                    x: [-8, 8, -8],
                    rotate: [-4, 4, -4]
                  }}
                  transition={{ 
                    y: {
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    x: {
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotate: {
                      duration: 6.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="relative group cursor-pointer mb-6"
                >
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#FF7E47] via-[#FFB347] to-[#A63A13] rounded-full blur opacity-50 group-hover:opacity-80 transition duration-300"></div>
                  <div className="relative bg-[#1B0C06] p-2.5 rounded-full border-2 border-[#5E2914] shadow-2xl">
                    <img 
                      src="/src/assets/images/maple_leaf_logo_1783971257499.jpg" 
                      alt="Maple Leaf Logo" 
                      referrerPolicy="no-referrer"
                      className="h-32 w-32 object-cover rounded-full transform group-hover:scale-105 transition duration-300"
                    />
                  </div>
                </motion.div>

                {/* Name: Maple Unblocc (Intentional Misspelling) or Cloaked */}
                <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">
                  Maple <span className="bg-gradient-to-r from-[#FF7E47] via-[#FFB347] to-[#D4A373] bg-clip-text text-transparent">{cloakMode ? "Workspace" : "Unblocc"}</span>
                </h1>
                
                {/* Dynamic cycling quotes at the center where the misspelled warning was */}
                <div className="mt-4 mb-6 h-16 flex items-center justify-center max-w-lg">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuoteIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="text-lg font-medium text-[#FFB347] italic text-center px-4"
                    >
                      <span className="text-[#FF7E47] text-xl font-serif mr-1">“</span>
                      {quotes[currentQuoteIndex].includes("https://scratch") ? (
                        <span>
                          check out my scratch acount{" "}
                          <a 
                            href="https://scratch.mit.edu/users/Maple-Studi0s/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white underline hover:text-[#FF7E47] font-semibold inline-flex items-center gap-1 transition"
                          >
                            Maple-Studi0s/ <ExternalLink className="h-3 w-3 inline" />
                          </a>
                        </span>
                      ) : (
                        quotes[currentQuoteIndex]
                      )}
                      <span className="text-[#FF7E47] text-xl font-serif ml-1">”</span>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

              {/* NATIVE MODULES QUICK LAUNCH */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl my-4 px-4 z-10">
                {/* Maple Games card */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const id = Math.random().toString(36).substring(2, 9);
                    setTabs([...tabs, {
                      id,
                      title: cloakMode ? "Workspace Module" : "Maple Games 🎮",
                      url: "maple-games",
                      proxyUrl: "",
                      type: "games"
                    }]);
                    setActiveTabId(id);
                  }}
                  className="relative group cursor-pointer bg-gradient-to-br from-[#2D1409]/90 to-[#1B0C06]/95 border border-[#5E2914] hover:border-[#FF7E47]/50 rounded-2xl p-5 shadow-lg overflow-hidden transition-all duration-200"
                >
                  <div className="absolute top-0 right-0 p-3 text-[32px] opacity-10 group-hover:opacity-20 group-hover:scale-110 transition duration-300">🎮</div>
                  <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-[#FF7E47]/5 rounded-full blur-xl"></div>
                  
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded-xl bg-[#A63A13]/20 text-[#FF7E47] border border-[#A63A13]/30">
                      <Gamepad2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-[#FFB347] transition">
                        {cloakMode ? "Maple Modules" : "Maple Games"}
                      </h3>
                      <p className="text-[10px] text-[#FF9E79] font-mono">{cloakMode ? "interactive logic runner" : "scratch.mit.edu bypass"}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#D4A373]/80 leading-relaxed">
                    {getLabel("games_description")}
                  </p>
                </motion.div>

                {/* Maple TV card */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const id = Math.random().toString(36).substring(2, 9);
                    setTabs([...tabs, {
                      id,
                      title: cloakMode ? "Media Node" : "Maple TV 📺",
                      url: "maple-tv",
                      proxyUrl: "",
                      type: "tv"
                    }]);
                    setActiveTabId(id);
                  }}
                  className="relative group cursor-pointer bg-gradient-to-br from-[#2D1409]/90 to-[#1B0C06]/95 border border-[#5E2914] hover:border-[#FF7E47]/50 rounded-2xl p-5 shadow-lg overflow-hidden transition-all duration-200"
                >
                  <div className="absolute top-0 right-0 p-3 text-[32px] opacity-10 group-hover:opacity-20 group-hover:scale-110 transition duration-300">📺</div>
                  <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-[#FFB347]/5 rounded-full blur-xl"></div>
                  
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded-xl bg-[#A63A13]/20 text-[#FFB347] border border-[#A63A13]/30">
                      <Tv className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-[#FFB347] transition">
                        {cloakMode ? "Maple Media" : "Maple TV"}
                      </h3>
                      <p className="text-[10px] text-[#FF9E79] font-mono">{cloakMode ? "educational media container" : "unblocked youtube client"}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#D4A373]/80 leading-relaxed">
                    {getLabel("tv_description")}
                  </p>
                </motion.div>
              </div>

              {/* Informative info footer about Lightspeed unblocking */}
              <div className="text-center max-w-md text-[11px] text-[#D4A373]/60 bg-[#160A05]/40 border border-[#3D1A0E]/60 p-3 rounded-xl mb-2">
                {getLabel("unblocker_warning")}
              </div>

            </motion.div>
          ) : (
            
            /* ===== SECURE WEB TABS ENGINE ===== */
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0 bg-[#080201]"
            >
              {/* Tab navigation control sub-bar */}
              <div className="h-9 bg-[#1B0C06] border-b border-[#3D1A0E] px-4 flex items-center justify-between text-xs select-none">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setActiveTabId("desktop")}
                    className="p-1 text-[#D4A373] hover:text-white rounded hover:bg-[#2D1409] transition"
                  >
                    <Home className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-gray-500 font-mono">/</span>
                  <span className="text-[#FFB347] font-mono truncate max-w-[400px]">
                    {activeTab.url}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      if (activeTab.type === "games" || activeTab.type === "tv") {
                        const currentUrl = activeTab.url;
                        // Temp blank to trigger re-mount
                        activeTab.url = "";
                        setTabs([...tabs]);
                        setTimeout(() => {
                          activeTab.url = currentUrl;
                          setTabs([...tabs]);
                        }, 50);
                      } else {
                        const iframe = document.getElementById(`iframe-${activeTab.id}`) as HTMLIFrameElement;
                        if (iframe) iframe.src = activeTab.proxyUrl;
                      }
                    }}
                    className="flex items-center gap-1 bg-[#2D1409] hover:bg-[#3D1A0E] text-[#FFE8D6] px-2 py-0.5 rounded text-[10px] transition border border-[#5E2914]/50"
                  >
                    <RefreshCw className="h-3 w-3" /> Reload
                  </button>
                  <button 
                    onClick={(e) => closeTab(activeTab.id, e)}
                    className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/40 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Proxied Iframe or Native Hub Viewport */}
              <div className="flex-1 w-full bg-[#080201] relative min-h-0">
                {activeTab.type === "games" ? (
                  activeTab.url ? (
                    <MapleGamesHub 
                      initialUrl={activeTab.url} 
                      onNavigate={(url) => {
                        activeTab.url = url;
                        setTabs([...tabs]);
                      }} 
                    />
                  ) : (
                    <div className="flex-1 h-full flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-[#FF7E47]" />
                    </div>
                  )
                ) : activeTab.type === "tv" ? (
                  activeTab.url ? (
                    <MapleTVHub 
                      initialUrl={activeTab.url} 
                      onNavigate={(url) => {
                        activeTab.url = url;
                        setTabs([...tabs]);
                      }} 
                      cloakMode={cloakMode}
                    />
                  ) : (
                    <div className="flex-1 h-full flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-[#FF7E47]" />
                    </div>
                  )
                ) : (
                  <iframe
                    id={`iframe-${activeTab.id}`}
                    src={activeTab.proxyUrl}
                    className="absolute inset-0 w-full h-full border-none bg-white"
                    sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
                    title={`Bypassed Frame: ${activeTab.title}`}
                  />
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* BOTTOM SIDEBAR / SEARCH BAR DOCK */}
      <footer className="h-16 border-t border-[#3D1A0E] bg-[#1B0C06]/95 backdrop-blur-md flex items-center justify-between px-6 z-40 shrink-0 select-none shadow-[0_-8px_20px_rgba(0,0,0,0.5)]">
        
        {/* Left widget: Proxy Tunnel Status */}
        <div className="hidden md:flex items-center space-x-2 text-xs text-[#D4A373]/80 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#FF7E47] animate-pulse"></span>
          <span>{cloakMode ? "Gateway Node: Secure SSL Sync" : "Tunnel: Active SSL"}</span>
        </div>

        {/* Center: Search / URL Launcher bar */}
        <div className="w-full max-w-xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative group">
            {/* Glowing autumn search ring */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF7E47]/30 via-[#FFB347]/30 to-[#A63A13]/30 rounded-xl blur opacity-70 group-focus-within:opacity-100 transition duration-300"></div>
            
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-[#D4A373]/70 group-focus-within:text-[#FFB347] transition" />
              
              <input
                type="text"
                placeholder={getLabel("search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#110603] border border-[#3D1A0E] focus:border-[#FF7E47]/50 text-white placeholder-[#D4A373]/40 text-xs rounded-xl pl-10 pr-28 py-2.5 focus:outline-none transition-all duration-200 font-mono shadow-inner"
              />
              
              <button
                type="submit"
                className="absolute right-1.5 bg-gradient-to-r from-[#FF7E47] to-[#A63A13] hover:from-[#FF9E79] hover:to-[#B64218] text-white font-medium text-[10px] px-4 py-1.5 rounded-lg flex items-center gap-1 transition-all duration-150 shadow-md cursor-pointer active:scale-95 border border-[#FF7E47]/20"
              >
                {getLabel("launch_button")}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </form>
        </div>

        {/* Right widget: Desktop toggle button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => setActiveTabId("desktop")}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#D4A373] hover:text-[#FFE8D6] bg-[#2D1409]/60 hover:bg-[#3D1A0E] px-3 py-1.5 rounded-lg border border-[#5E2914]/50 transition"
          >
            <Home className="h-3.5 w-3.5 text-[#FF7E47]" />
            <span>Desktop</span>
          </button>
        </div>

      </footer>

    </div>
  );
}

// ==========================================
// MAPLE GAMES COMPONENT (Scratch.mit.edu Bypass Console)
// ==========================================
function MapleGamesHub({ initialUrl, onNavigate }: { initialUrl: string; onNavigate: (url: string) => void }) {
  const getProjectId = (url: string) => {
    const match = url.match(/project=(\d+)/);
    return match ? match[1] : null;
  };

  const [activeProjectId, setActiveProjectId] = useState<string | null>(getProjectId(initialUrl));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [customInput, setCustomInput] = useState("");
  const [isTurbo, setIsTurbo] = useState(false);
  const [isHQ, setIsHQ] = useState(true);

  // Sync state if initialUrl changes
  useEffect(() => {
    setActiveProjectId(getProjectId(initialUrl));
  }, [initialUrl]);

  const categories = ["All", "Sandbox", "Platformer", "Arcade", "Physics", "Rhythm", "3D / Tech"];

  const filteredGames = SCRATCH_GAMES.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || game.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const launchCustomGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const projectMatch = customInput.match(/(?:projects\/|\/)(\d+)/i) || customInput.match(/^(\d+)$/);
    if (projectMatch && projectMatch[1]) {
      setActiveProjectId(projectMatch[1]);
      onNavigate(`maple-games?project=${projectMatch[1]}`);
      setCustomInput("");
    }
  };

  if (activeProjectId) {
    const activeGame = SCRATCH_GAMES.find(g => g.id === activeProjectId);
    return (
      <div className="flex-1 bg-[#0F0502] text-[#FFE8D6] overflow-y-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 h-full">
        
        {/* Left Side: Game stage & Console wrap */}
        <div className="flex-1 flex flex-col">
          
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setActiveProjectId(null);
                onNavigate("maple-games");
              }}
              className="flex items-center gap-1.5 text-xs text-[#FF7E47] hover:text-[#FFB347] font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Game Center
            </button>
            <div className="text-[11px] font-mono bg-[#A63A13]/20 border border-[#A63A13]/40 text-[#FF9E79] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Console Speed: 60 FPS (Bypassed)
            </div>
          </div>

          {/* Arcade Cabinet Frame */}
          <div className="relative w-full aspect-video bg-[#1B0C06] rounded-2xl border-4 border-[#3D1A0E] shadow-2xl overflow-hidden group flex flex-col">
            {/* Ambient cabinet top-bar */}
            <div className="h-7 bg-[#2D1409] border-b border-[#3D1A0E] px-4 flex items-center justify-between text-[10px] font-mono text-[#D4A373]/70">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>SYSTEM: TURBOWARP ACTIVE</span>
              </div>
              <span>PROJECT ID: {activeProjectId}</span>
            </div>

            {/* Iframe */}
            <div className="flex-1 relative w-full bg-[#000]">
              <iframe
                id="games-player-iframe"
                src={`https://turbowarp.org/embed.html?project=${activeProjectId}&hq=${isHQ}&autoplay=true&turbo=${isTurbo}`}
                className="absolute inset-0 w-full h-full border-none"
                allowFullScreen
                allow="autoplay; gamepad"
                title="Maple Unblocked Scratch Game"
              />
            </div>

            {/* Console Control Bar */}
            <div className="h-12 bg-[#2D1409] border-t border-[#3D1A0E] px-4 flex items-center justify-between text-xs select-none">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsTurbo(!isTurbo)}
                  className={`px-3 py-1 rounded text-[10px] font-bold font-mono transition border cursor-pointer ${
                    isTurbo 
                      ? "bg-[#FF7E47] text-white border-[#FF7E47] shadow-sm shadow-[#FF7E47]/20" 
                      : "bg-[#110603] text-[#D4A373] border-[#5E2914] hover:bg-[#1B0C06]"
                  }`}
                  title="Force 60 FPS and skip Scratch constraints"
                >
                  🚀 {isTurbo ? "TURBO ACTIVE" : "TURBO MODE"}
                </button>
                <button
                  onClick={() => setIsHQ(!isHQ)}
                  className={`px-3 py-1 rounded text-[10px] font-bold font-mono transition border cursor-pointer ${
                    isHQ 
                      ? "bg-[#D4A373] text-[#110603] border-[#D4A373]" 
                      : "bg-[#110603] text-[#D4A373] border-[#5E2914] hover:bg-[#1B0C06]"
                  }`}
                  title="Enable high-quality interpolation"
                >
                  📺 {isHQ ? "HD GRAPHICS" : "SD GRAPHICS"}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const frame = document.getElementById("games-player-iframe") as HTMLIFrameElement;
                    if (frame) {
                      frame.src = frame.src;
                    }
                  }}
                  className="flex items-center gap-1 bg-[#110603] hover:bg-[#1B0C06] text-[#D4A373] border border-[#5E2914] px-2.5 py-1 rounded text-[10px] transition cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" /> Reset
                </button>
                <button
                  onClick={() => {
                    const frame = document.getElementById("games-player-iframe");
                    if (frame) {
                      frame.requestFullscreen?.();
                    }
                  }}
                  className="bg-gradient-to-r from-[#FF7E47] to-[#A63A13] hover:from-[#FF9E79] text-white px-3 py-1 rounded text-[10px] font-bold transition shadow-md border border-[#FF7E47]/20 cursor-pointer"
                >
                  🖥️ Fullscreen
                </button>
              </div>
            </div>
          </div>

          {/* Game Information Details */}
          <div className="mt-5 bg-[#1B0C06]/80 border border-[#3D1A0E] p-4 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span>🎮</span> {activeGame ? activeGame.title : "Scratch Project Gameplay"}
            </h2>
            <p className="text-xs text-[#FFB347] font-mono mb-3">
              Developer: @{activeGame ? activeGame.author : "community"} • Plays: {activeGame ? activeGame.plays : "Uncounted"}
            </p>
            <p className="text-xs text-[#D4A373] leading-relaxed">
              {activeGame ? activeGame.description : "An unblocked game running through the high-performance TurboWarp HTML5 compiler. Fully optimized for Chromebooks and school network bypass, utilizing custom canvas rendering and zero background buffering."}
            </p>
          </div>
        </div>

        {/* Right Side: Sidebar - Game suggestions & chat */}
        <div className="w-full md:w-80 flex flex-col space-y-5 shrink-0">
          
          {/* Quick Launch custom project ID */}
          <div className="bg-gradient-to-b from-[#220F07] to-[#1B0C06] border border-[#5E2914]/60 p-4 rounded-xl">
            <h4 className="text-xs font-bold font-mono text-[#FF7E47] uppercase mb-2">Play Any Scratch Game</h4>
            <p className="text-[10px] text-[#D4A373]/70 mb-3">Paste a Scratch project link or ID to bypass any block instantly!</p>
            <form onSubmit={launchCustomGame} className="flex gap-2">
              <input
                type="text"
                placeholder="Paste ID or link..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 bg-[#110603] border border-[#3D1A0E] text-xs px-2.5 py-1.5 rounded-lg text-white placeholder-[#D4A373]/30 font-mono focus:outline-none focus:border-[#FF7E47]/50"
              />
              <button
                type="submit"
                className="bg-[#FF7E47] hover:bg-[#FF9E79] text-[#110603] font-bold text-xs px-3 rounded-lg transition cursor-pointer"
              >
                Go
              </button>
            </form>
          </div>

          {/* Simulated Chat / Comments */}
          <div className="bg-[#160A05]/80 border border-[#3D1A0E] p-4 rounded-xl flex-1 flex flex-col min-h-[250px]">
            <h4 className="text-xs font-bold font-mono text-[#FFB347] uppercase border-b border-[#3D1A0E] pb-2 mb-3 flex items-center justify-between">
              <span>💬 Community Reviews</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h4>
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none text-[11px] leading-normal">
              <div className="border-l-2 border-[#FF7E47]/40 pl-2">
                <span className="font-bold text-[#FF9E79]">@ChromebookMaster</span>
                <p className="text-[#D4A373]/90 mt-0.5">griffpatch is literally a god, Paper Minecraft is finally loading on school wifi. It runs at 60 FPS too!</p>
              </div>
              <div className="border-l-2 border-[#FFB347]/40 pl-2">
                <span className="font-bold text-[#FFB347]">@SaltyNugget</span>
                <p className="text-[#D4A373]/90 mt-0.5">Maple Games saved my GPA from boredom in history class. The sandbox games are so unblocked here.</p>
              </div>
              <div className="border-l-2 border-emerald-500/40 pl-2">
                <span className="font-bold text-emerald-400">@LofiCoder</span>
                <p className="text-[#D4A373]/90 mt-0.5">Protip: Enable TURBO MODE for high physics precision. It loads in literally 2 seconds.</p>
              </div>
              <div className="border-l-2 border-rose-500/40 pl-2">
                <span className="font-bold text-rose-400">@SchoolSurver</span>
                <p className="text-[#D4A373]/90 mt-0.5">Finally, I can play Scratch games. Our school filter Lightspeed blocked standard Scratch, but this is undetected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Browse games list
  return (
    <div className="flex-1 bg-[#0F0502] text-[#FFE8D6] overflow-y-auto p-6 flex flex-col min-h-0 h-full">
      
      {/* Top Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#3D1A0E] via-[#220F07] to-[#110603] p-6 border border-[#5E2914] mb-6 overflow-hidden shadow-lg shadow-black/40 shrink-0">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-[80px]">🎮</div>
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] font-mono tracking-widest text-[#FF7E47] uppercase font-bold bg-[#A63A13]/20 border border-[#A63A13]/40 px-2.5 py-1 rounded-full">
            Unblocked Game Console
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-3 mb-1">
            Maple <span className="bg-gradient-to-r from-[#FF7E47] to-[#FFB347] bg-clip-text text-transparent">Games</span>
          </h1>
          <p className="text-xs text-[#D4A373] leading-relaxed">
            Instantly play full Scratch games unblocked with extreme HTML5 compiler optimization. High framerates, full keyboard controls, and zero proxy loading delays.
          </p>
        </div>
      </div>

      {/* Control bar: category toggles, search, custom input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3D1A0E] pb-5 mb-6 shrink-0">
        {/* Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#FF7E47] text-white border-[#FF7E47] shadow-sm"
                  : "bg-[#1B0C06] border-[#3D1A0E] text-[#D4A373] hover:bg-[#2D1409]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search game */}
        <div className="flex items-center space-x-2.5 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#D4A373]/60" />
            <input
              type="text"
              placeholder="Search unblocked games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1B0C06] border border-[#3D1A0E] text-xs px-9 py-2 rounded-xl text-white placeholder-[#D4A373]/40 focus:outline-none focus:border-[#FF7E47]/50 font-mono"
            />
          </div>
          <form onSubmit={launchCustomGame} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Paste ID"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-20 bg-[#1B0C06] border border-[#3D1A0E] text-xs px-2 py-2 rounded-lg text-white placeholder-[#D4A373]/30 font-mono text-center focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#A63A13] hover:bg-[#FF7E47] text-white font-bold text-xs px-3 rounded-lg transition cursor-pointer"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Games list grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-1 min-h-0 pb-6">
          {filteredGames.map((game) => (
            <motion.div
              key={game.id}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => {
                setActiveProjectId(game.id);
                onNavigate(`maple-games?project=${game.id}`);
              }}
              className="group cursor-pointer bg-gradient-to-b from-[#1B0C06] to-[#110603] border border-[#3D1A0E] hover:border-[#FF7E47]/50 rounded-xl overflow-hidden shadow-md flex flex-col h-full"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-black overflow-hidden border-b border-[#3D1A0E]/50">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to beautiful neon game graphic
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80`;
                  }}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#FF7E47] text-[#110603] text-[9px] font-extrabold rounded-full uppercase">
                  {game.category}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-[#FFB347] text-[9px] font-mono rounded">
                  Plays: {game.plays}
                </div>
              </div>

              {/* Game Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-[#FFB347] transition truncate">
                    {game.title}
                  </h3>
                  <p className="text-[10px] text-[#D4A373]/60 font-mono mt-0.5">By @{game.author}</p>
                  <p className="text-[11px] text-[#D4A373]/80 leading-snug mt-2 line-clamp-2">
                    {game.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-[#3D1A0E]/60 flex items-center justify-between text-xs font-semibold text-[#FF7E47] group-hover:text-[#FFB347] transition">
                  <span>🎮 Launch Console</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition duration-150" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-[#D4A373]/60 shrink-0">
          <p className="text-base font-semibold mb-1">No unblocked games found</p>
          <p className="text-xs">Try searching another term, or paste a custom Scratch ID above!</p>
        </div>
      )}

    </div>
  );
}
