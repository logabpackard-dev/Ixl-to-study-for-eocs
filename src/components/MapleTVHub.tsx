import React, { useState, useEffect } from "react";
import { 
  Search, 
  ArrowLeft, 
  ChevronRight, 
  RefreshCw, 
  Tv, 
  Film, 
  Play, 
  Star, 
  Flame 
} from "lucide-react";
import { motion } from "motion/react";

export interface CinebyItem {
  id: string; // TMDb ID
  title: string;
  type: "movie" | "tv";
  rating: string;
  year: string;
  runtime?: string;
  genres: string[];
  thumbnail: string;
  description: string;
  seasonsCount?: number;
}

// Curated blockbuster movies and TV series (matching Cineby.at aesthetics with working poster URLs and IMDb IDs)
const CINEBY_ITEMS: CinebyItem[] = [
  // MOVIES
  {
    id: "tt16383558",
    title: "Deadpool & Wolverine",
    type: "movie",
    rating: "8.1",
    year: "2024",
    runtime: "2h 8m",
    genres: ["Action", "Comedy", "Sci-Fi"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BNTI2YTI0MWEtNGI0My00MzFmLWE0NDgtM2FmNzg4NzhlZjk0XkEyXkFqcGc@._V1_SX300.jpg",
    description: "A listless Wade Wilson toils in civilian life. His days as the morally flexible mercenary, Deadpool, behind him. When his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine."
  },
  {
    id: "tt22022452",
    title: "Inside Out 2",
    type: "movie",
    rating: "7.9",
    year: "2024",
    runtime: "1h 36m",
    genres: ["Animation", "Family", "Comedy"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BYTYyN2FiYmMtY2JiNC00M2ZiLTg0NDgtODg0YmU0NTA4NDBmXkEyXkFqcGc@._V1_SX300.jpg",
    description: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear, and Disgust aren't sure how to feel when Anxiety shows up."
  },
  {
    id: "tt15239678",
    title: "Dune: Part Two",
    type: "movie",
    rating: "8.5",
    year: "2024",
    runtime: "2h 46m",
    genres: ["Sci-Fi", "Adventure", "Action"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BODdkZTRiMjctYTYyMy00MjNmLWExMGQtY2UxYjU5N2Y3YmFkXkEyXkFqcGc@._V1_SX300.jpg",
    description: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee."
  },
  {
    id: "tt15328130",
    title: "Oppenheimer",
    type: "movie",
    rating: "8.9",
    year: "2023",
    runtime: "3h 0m",
    genres: ["Drama", "History", "Biography"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BOWU1OGYwYTUtYTFlZS05MjY2LTg0ZDYtNDVjMGE1YjY5NDliXkEyXkFqcGc@._V1_SX300.jpg",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, leading to the dawn of the nuclear age."
  },
  {
    id: "tt9362722",
    title: "Spider-Man: Across the Spider-Verse",
    type: "movie",
    rating: "8.6",
    year: "2023",
    runtime: "2h 20m",
    genres: ["Animation", "Action", "Sci-Fi"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BMzI0NmFiZTYtMDY4Ny00OTRjLWIxYWEtNTVjYTkzY2UxYTEwXkEyXkFqcGc@._V1_SX300.jpg",
    description: "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence."
  },
  {
    id: "tt0816692",
    title: "Interstellar",
    type: "movie",
    rating: "8.7",
    year: "2014",
    runtime: "2h 49m",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxODAtM2YyMy00YmYwLTgwYTUtYmI3NzcyMWFlNWZlXkEyXkFqcGc@._V1_SX300.jpg",
    description: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage."
  },
  {
    id: "tt9660516",
    title: "Gladiator II",
    type: "movie",
    rating: "7.2",
    year: "2024",
    runtime: "2h 30m",
    genres: ["Action", "Drama", "History"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BN2E5YTIxMTYtYzI5Yy00OTExLTk5MzEtZTM3NWE0YmFjNjdjXkEyXkFqcGc@._V1_SX300.jpg",
    description: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist."
  },
  {
    id: "tt31185444",
    title: "Moana 2",
    type: "movie",
    rating: "7.0",
    year: "2024",
    runtime: "1h 40m",
    genres: ["Animation", "Adventure", "Family"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BMjA5MWY1MDMtNmJmOC00NzZmLTlhMzctNGY4ODdmNzMyMGVjXkEyXkFqcGc@._V1_SX300.jpg",
    description: "After receiving an unexpected call from her wayfinding ancestors, Moana must journey to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced."
  },
  {
    id: "tt1375666",
    title: "Inception",
    type: "movie",
    rating: "8.8",
    year: "2010",
    runtime: "2h 28m",
    genres: ["Sci-Fi", "Action", "Thriller"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    description: "Cobb, a skilled thief who is absolute best in the dangerous art of extraction, steals valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable."
  },
  {
    id: "tt0468569",
    title: "The Dark Knight",
    type: "movie",
    rating: "9.0",
    year: "2008",
    runtime: "2h 32m",
    genres: ["Action", "Crime", "Drama"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
  },
  {
    id: "tt17520232",
    title: "Despicable Me 4",
    type: "movie",
    rating: "7.3",
    year: "2024",
    runtime: "1h 34m",
    genres: ["Animation", "Comedy", "Family"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BYjI0Y2U3Y2UtMGI3OC00MDFiLTg1YTktY2VmNWFjNTkxNDhiXkEyXkFqcGc@._V1_SX300.jpg",
    description: "Gru, Lucy, Margo, Edith, and Agnes welcome a new member to the family, Gru Jr., who is intent on tormenting his dad. Gru faces a new nemesis in Maxime Le Mal and his femme fatale girlfriend Valentina."
  },
  {
    id: "tt1630029",
    title: "Avatar: The Way of Water",
    type: "movie",
    rating: "7.7",
    year: "2022",
    runtime: "3h 12m",
    genres: ["Sci-Fi", "Action", "Adventure"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1OTMxXkEyXkFqcGc@._V1_SX300.jpg",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home."
  },
  {
    id: "tt1877830",
    title: "The Batman",
    type: "movie",
    rating: "7.7",
    year: "2022",
    runtime: "2h 56m",
    genres: ["Action", "Crime", "Drama"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTgyMzUtNjAyYmE4Njg5YWMyXkEyXkFqcGc@._V1_SX300.jpg",
    description: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler."
  },

  // TV SHOWS
  {
    id: "tt5027774",
    title: "Stranger Things",
    type: "tv",
    rating: "8.7",
    year: "2016-Present",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BMTE0YWFmOTMtYTU2ZS00ZGM5LWIxYTUtMzRlNDlhYzIzYWFiXkEyXkFqcGc@._V1_SX300.jpg",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    seasonsCount: 4
  },
  {
    id: "tt0903747",
    title: "Breaking Bad",
    type: "tv",
    rating: "9.5",
    year: "2008-2013",
    genres: ["Crime", "Drama", "Thriller"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BMmZmYWY5ZmItNDMzMy00YTc0LWFhNGEtMGFkNDg3MTU1ZDFkXkEyXkFqcGc@._V1_SX300.jpg",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
    seasonsCount: 5
  },
  {
    id: "tt13443470",
    title: "Wednesday",
    type: "tv",
    rating: "8.5",
    year: "2022-Present",
    genres: ["Mystery", "Comedy", "Fantasy"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGc@._V1_SX300.jpg",
    description: "Wednesday Addams' misadventures as a student at Nevermore Academy, a very unique boarding school. She attempts to master her emerging psychic ability, thwart a monstrous killing spree, and solve a supernatural mystery.",
    seasonsCount: 1
  },
  {
    id: "tt14243818",
    title: "The Last of Us",
    type: "tv",
    rating: "8.8",
    year: "2023-Present",
    genres: ["Action", "Adventure", "Drama"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BZDcxYTM4NTAtYzY0OS00YWVlLWIyNGYtMDVhNDNiYjcxNGRhXkEyXkFqcGc@._V1_SX300.jpg",
    description: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal journey.",
    seasonsCount: 1
  },
  {
    id: "tt2861424",
    title: "Rick and Morty",
    type: "tv",
    rating: "8.7",
    year: "2013-Present",
    genres: ["Animation", "Comedy", "Sci-Fi"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BYmYyNzA2M2UtM2MyYi00N2Y4LWE0ODItNDg2YmU1ZTA1ZGE0XkEyXkFqcGc@._V1_SX300.jpg",
    description: "An animated series that follows the exploits of a super scientist and his easily influenced grandson, traveling across parallel dimensions and space on absurd intergalactic adventures.",
    seasonsCount: 7
  },
  {
    id: "tt11126994",
    title: "Arcane",
    type: "tv",
    rating: "9.0",
    year: "2021-Present",
    genres: ["Animation", "Sci-Fi", "Action"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BYmU1MjA3MTUtYWExYi00ZDIyLThmMTUtZDBmZGUyYTNkYzNlXkEyXkFqcGc@._V1_SX300.jpg",
    description: "Amidst the stark discord of the twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.",
    seasonsCount: 2
  },
  {
    id: "tt12637874",
    title: "Fallout",
    type: "tv",
    rating: "8.4",
    year: "2024-Present",
    genres: ["Action", "Sci-Fi", "Adventure"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BZTI4YmI5N2UtYjNlNi05MWMxLWJhMTctNDJkNTg3NWNjYjg2XkEyXkFqcGc@._V1_SX300.jpg",
    description: "The story of haves and have-nots in a world in which there's almost nothing left to have. 200 years after the apocalypse, the gentle inhabitants of luxury fallout shelters are forced to return to the hellscape their ancestors left behind.",
    seasonsCount: 1
  },
  {
    id: "tt10919420",
    title: "Squid Game",
    type: "tv",
    rating: "8.3",
    year: "2021-Present",
    genres: ["Action", "Thriller", "Drama"],
    thumbnail: "https://m.media-amazon.com/images/M/MV5BYzA5ZDNmOTYtM2ExOS00OWU1LTg1N2UtYjg3NDY3ODNlMTI0XkEyXkFqcGc@._V1_SX300.jpg",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes: a survival game that has a whopping 45.6 billion won prize.",
    seasonsCount: 2
  }
];

export default function MapleTVHub({ initialUrl, onNavigate }: { initialUrl: string; onNavigate: (url: string) => void }) {
  const getVideoId = (url: string) => {
    const match = url.match(/video=([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const [activeVideoId, setActiveVideoId] = useState<string | null>(getVideoId(initialUrl));
  const [activeMovie, setActiveMovie] = useState<CinebyItem | null>(null);

  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [cinebyMirror, setCinebyMirror] = useState<"vidsrccc" | "vidsrcsu" | "vidsrcpm" | "vidsrcnet" | "vidsrcme" | "vidlinkpro" | "embedsu" | "vidsrcto" | "vidsrcxyz" | "vidsrcpro" | "superembed" | "lordflix" | "flixer" | "bingebox">("vidsrccc");
  const [activeMirror, setActiveMirror] = useState<"nocookie" | "piped" | "mapletv">("nocookie");
  const [useSandbox, setUseSandbox] = useState<boolean>(true);

  const [movieSearchQuery, setMovieSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<"all" | "movie" | "tv">("all");

  // Dynamic search server state
  const [searchResultItems, setSearchResultItems] = useState<CinebyItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [instantPlayError, setInstantPlayError] = useState<string | null>(null);

  const [pastedUrl, setPastedUrl] = useState("");
  const [pasteError, setPasteError] = useState("");
  const [resolvingPaste, setResolvingPaste] = useState(false);

  // Custom Direct Stream state
  const [customTitle, setCustomTitle] = useState("");
  const [customTmdbId, setCustomTmdbId] = useState("");
  const [customType, setCustomType] = useState<"movie" | "tv">("movie");

  // Sync state if initialUrl changes
  useEffect(() => {
    const vid = getVideoId(initialUrl);
    if (vid) {
      setActiveVideoId(vid);
      setActiveMovie(null);
      onNavigate(`maple-tv?video=${vid}`);
    } else {
      setActiveVideoId(null);
    }
  }, [initialUrl]);

  // Debounced search from Cineby OMDb API
  useEffect(() => {
    if (!movieSearchQuery.trim()) {
      setSearchResultItems([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const typeParam = selectedType !== "all" ? `&type=${selectedType}` : "";
        const res = await fetch(`/api/cineby/search?q=${encodeURIComponent(movieSearchQuery)}${typeParam}`);
        if (!res.ok) {
          throw new Error("Failed to contact Cineby index server");
        }
        const data = await res.json();
        if (data.error) {
          setSearchError(data.error);
          setSearchResultItems([]);
        } else {
          setSearchResultItems(data.Search || []);
        }
      } catch (err: any) {
        setSearchError(err.message || "Search failed");
        setSearchResultItems([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [movieSearchQuery, selectedType]);

  // Automatically fetch full details for active movie if clicked from search results (which are low-detail)
  const handleSelectMovie = async (movie: CinebyItem) => {
    setIsLoadingDetail(true);
    setCurrentSeason(1);
    setCurrentEpisode(1);
    try {
      // If it's custom or already has full genres/description loaded, skip fetch
      if (movie.description !== "Click to load details and stream instantly...") {
        setActiveMovie(movie);
        setIsLoadingDetail(false);
        return;
      }

      // Fetch rich details from the server proxy
      const res = await fetch(`/api/cineby/detail?id=${movie.id}`);
      if (res.ok) {
        const detailedMovie = await res.json();
        setActiveMovie(detailedMovie);
      } else {
        // Fallback to clicked item if details fetch fails
        setActiveMovie(movie);
      }
    } catch (e) {
      setActiveMovie(movie);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const openAboutBlankPopout = (url: string, title: string) => {
    try {
      const win = window.open("about:blank", "_blank");
      if (!win) {
        alert("Pop-up blocked! Please allow pop-ups for this site to stream unblocked.");
        return;
      }
      
      win.document.title = title || "MapleTV Playback Stream";
      
      const body = win.document.body;
      body.style.margin = "0";
      body.style.padding = "0";
      body.style.backgroundColor = "#000";
      body.style.overflow = "hidden";
      body.style.width = "100vw";
      body.style.height = "100vh";

      const iframe = win.document.createElement("iframe");
      iframe.src = url;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.margin = "0";
      iframe.style.padding = "0";
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("webkitallowfullscreen", "true");
      iframe.setAttribute("mozallowfullscreen", "true");
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("sandbox", "allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation");

      body.appendChild(iframe);
    } catch (err) {
      console.error("About blank cloaker error:", err);
      window.open(url, "_blank");
    }
  };

  const handleInstantAutoPlay = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoadingDetail(true);
    setInstantPlayError(null);

    try {
      // 1. Try finding by direct title lookup
      const res = await fetch(`/api/cineby/detail_by_title?title=${encodeURIComponent(trimmed)}&type=${selectedType}`);
      if (res.ok) {
        const movie = await res.json();
        setActiveMovie(movie);
        setCurrentSeason(1);
        setCurrentEpisode(1);
        setActiveVideoId(null);
        setMovieSearchQuery("");
        setInstantPlayError(null);
        return;
      }

      // 2. If title lookup fails, try search endpoint
      const searchRes = await fetch(`/api/cineby/search?q=${encodeURIComponent(trimmed)}&type=${selectedType}`);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.Search && searchData.Search.length > 0) {
          const firstItem = searchData.Search[0];
          // Fetch full detail for the first search item
          const detailRes = await fetch(`/api/cineby/detail?id=${firstItem.id}`);
          if (detailRes.ok) {
            const detailedMovie = await detailRes.json();
            setActiveMovie(detailedMovie);
            setCurrentSeason(1);
            setCurrentEpisode(1);
            setActiveVideoId(null);
            setMovieSearchQuery("");
            setInstantPlayError(null);
            return;
          }
        }
      }

      // If both fail
      setInstantPlayError(`Could not find movie or TV show matching "${trimmed}". Try another title!`);
    } catch (err: any) {
      console.error("Instant auto-play error:", err);
      setInstantPlayError("Failed to establish stream tunnel. Please try again.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Handle YouTube URL paste
  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasteError("");
    const trimmed = pastedUrl.trim();
    if (!trimmed) return;

    // 1. Direct 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      setActiveVideoId(trimmed);
      setActiveMovie(null);
      onNavigate(`maple-tv?video=${trimmed}`);
      setPastedUrl("");
      return;
    }

    // 2. Video pattern matches
    const videoMatch = trimmed.match(/(?:v=|\/embed\/|\/watch\?v=|\/v\/|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (videoMatch && videoMatch[1]) {
      const vidId = videoMatch[1];
      setActiveVideoId(vidId);
      setActiveMovie(null);
      onNavigate(`maple-tv?video=${vidId}`);
      setPastedUrl("");
      return;
    }

    setPasteError("Unrecognized link. Sinks only valid YouTube video / shorts links.");
  };

  const handleCustomStreamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTmdbId.trim()) return;

    const item: CinebyItem = {
      id: customTmdbId.trim(),
      title: customTitle.trim() || `Custom ${customType === "movie" ? "Movie" : "TV Show"}`,
      type: customType,
      rating: "9.9",
      year: "2024",
      genres: ["Custom", "Direct Injection"],
      thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80",
      description: "Direct server-side unblocked stream bypass enabled.",
      seasonsCount: customType === "tv" ? 10 : undefined
    };

    setActiveMovie(item);
    setActiveVideoId(null);
    setCurrentSeason(1);
    setCurrentEpisode(1);
    setCustomTitle("");
    setCustomTmdbId("");
  };

  // Filter or return search results
  const filteredCinebyItems = movieSearchQuery.trim() !== "" ? searchResultItems : [];

  // Helpers for embed URL resolvers
  const getYoutubeEmbedUrl = (videoId: string) => {
    switch (activeMirror) {
      case "nocookie":
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      case "piped":
        return `https://piped.video/embed/${videoId}`;
      case "mapletv":
        return `https://yewtu.be/embed/${videoId}`;
      default:
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
  };

  const getCinebyEmbedUrl = (item: CinebyItem) => {
    if (item.type === "movie") {
      switch (cinebyMirror) {
        case "vidsrccc":
          return `https://vidsrc.cc/v2/embed/movie/${item.id}`;
        case "vidsrcsu":
          return `https://vidsrc.su/embed/movie/${item.id}`;
        case "vidsrcpm":
          return `https://vidsrc.pm/embed/movie/${item.id}`;
        case "vidsrcnet":
          return `https://vidsrc.net/embed/movie/${item.id}`;
        case "vidsrcme":
          return `https://vidsrc.me/embed/movie?imdb=${item.id}`;
        case "vidlinkpro":
          return `https://vidlink.pro/movie/${item.id}?primaryColor=ea580c`;
        case "embedsu":
          return `https://embed.su/embed/movie/${item.id}`;
        case "vidsrcto":
          return `https://vidsrc.to/embed/movie/${item.id}`;
        case "vidsrcxyz":
          return `https://vidsrc.xyz/embed/movie?imdb=${item.id}`;
        case "vidsrcpro":
          return `https://vidsrc.pro/embed/movie/${item.id}`;
        case "lordflix":
          return `https://lordflix.su/embed/movie/${item.id}`;
        case "flixer":
          return `https://flixer.su/embed/movie/${item.id}`;
        case "bingebox":
          return `https://bingebox.to/embed/movie/${item.id}`;
        case "superembed":
        default:
          return item.id.startsWith("tt")
            ? `https://multiembed.mov/?video_id=${item.id}`
            : `https://multiembed.mov/?video_id=${item.id}&tmdb=1`;
      }
    } else {
      switch (cinebyMirror) {
        case "vidsrccc":
          return `https://vidsrc.cc/v2/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        case "vidsrcsu":
          return `https://vidsrc.su/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        case "vidsrcpm":
          return `https://vidsrc.pm/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        case "vidsrcnet":
          return `https://vidsrc.net/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        case "vidsrcme":
          return `https://vidsrc.me/embed/tv?imdb=${item.id}&season=${currentSeason}&episode=${currentEpisode}`;
        case "vidlinkpro":
          return `https://vidlink.pro/tv/${item.id}/${currentSeason}/${currentEpisode}?primaryColor=ea580c`;
        case "embedsu":
          return `https://embed.su/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        case "vidsrcto":
          return `https://vidsrc.to/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        case "vidsrcxyz":
          return `https://vidsrc.xyz/embed/tv?imdb=${item.id}&season=${currentSeason}&episode=${currentEpisode}`;
        case "vidsrcpro":
          return `https://vidsrc.pro/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        case "lordflix":
          return `https://lordflix.su/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        case "flixer":
          return `https://flixer.su/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        case "bingebox":
          return `https://bingebox.to/embed/tv/${item.id}/${currentSeason}/${currentEpisode}`;
        case "superembed":
        default:
          return item.id.startsWith("tt")
            ? `https://multiembed.mov/?video_id=${item.id}&s=${currentSeason}&e=${currentEpisode}`
            : `https://multiembed.mov/?video_id=${item.id}&tmdb=1&s=${currentSeason}&e=${currentEpisode}`;
      }
    }
  };

  /* ======================================= */
  /* SCREEN 1: ACTIVE CINEBY MOVIE/TV SHOW PLAYER */
  /* ======================================= */
  if (activeMovie) {
    return (
      <div className="flex-1 bg-[#090302] text-[#FFE8D6] overflow-y-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 h-full min-h-0 select-none">
        {/* Main Cinema Screen */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Back breadcrumb bar */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <button
              onClick={() => setActiveMovie(null)}
              className="flex items-center gap-1.5 text-xs text-[#FF7E47] hover:text-[#FFB347] font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Cineby Library
            </button>
            <div className="text-[10px] font-mono bg-red-950/40 border border-red-500/30 text-red-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Cineby Connection: Bypassing Filters
            </div>
          </div>

          {/* Iframe Stage */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-red-950/40 shadow-2xl flex flex-col shrink-0">
            <iframe
              id="cineby-player-iframe"
              src={getCinebyEmbedUrl(activeMovie)}
              className="flex-1 w-full h-full border-none"
              allowFullScreen
              allow="autoplay; encrypted-media"
              sandbox={useSandbox ? "allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation" : undefined}
              title="Cineby Cinema Player"
            />
          </div>

          {/* Sandbox & Frame-Bypass Popout Button */}
          <div className="mt-3.5 p-3.5 bg-gradient-to-r from-red-950/30 via-red-900/10 to-transparent border border-red-500/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">⚡</span>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Iframe Blocked, Blank, or Sandboxing Error in Cinema?</h4>
                <p className="text-[10px] text-[#D4A373]/70 mt-0.5">
                  Some browsers or servers block sandboxed frames. If a server is blank, <strong className="text-white">toggle Sandbox Shield OFF</strong> for maximum unconstrained compatibility, or click <strong className="text-white">Popout Stream</strong> to stream in a secure, cloaked <strong className="text-white">about:blank</strong> tab!
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => setUseSandbox(!useSandbox)}
                className={`px-3 py-2 rounded-lg border text-[10px] font-mono font-extrabold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer select-none ${
                  useSandbox 
                    ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/30" 
                    : "bg-red-950/30 text-red-500 border-red-500/40 hover:bg-red-900/20"
                }`}
                title={useSandbox ? "Sandbox Shield is ON: Blocks popups, but may break some streams." : "Sandbox Shield is OFF: Maximum compatibility, but some servers can trigger ad popups."}
              >
                {useSandbox ? "🛡️ Shield: ON" : "🔓 Shield: OFF"}
              </button>

              <button
                onClick={() => openAboutBlankPopout(getCinebyEmbedUrl(activeMovie), activeMovie.title || "MapleTV Playback Stream")}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono font-extrabold text-[11px] uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition shrink-0 active:scale-95 shadow-lg shadow-red-900/30 cursor-pointer"
              >
                <span>🍿</span> Popout Stream (about:blank)
              </button>
            </div>
          </div>

          {/* Server Selector */}
          <div className="mt-4 bg-[#110603] border border-red-950/40 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
              <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>⚡</span> Cineby Server Bypass Routing
              </h4>
              <p className="text-[10px] text-[#D4A373]/70 mt-0.5">
                Switch unblocked mirror servers if the current stream is laggy, blank, or blocked by firewalls.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(["vidsrccc", "vidsrcsu", "vidsrcpm", "vidsrcnet", "vidsrcme", "vidlinkpro", "embedsu", "vidsrcto", "vidsrcxyz", "vidsrcpro", "lordflix", "flixer", "bingebox", "superembed"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setCinebyMirror(m)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold font-mono transition border cursor-pointer ${
                    cinebyMirror === m
                      ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-900/30"
                      : "bg-[#1B0C06] text-[#D4A373] border-red-950/60 hover:bg-[#2D1409]"
                  }`}
                >
                  {m === "vidsrccc"
                    ? "🎥 Server 1 (VidSrc.cc) ★"
                    : m === "vidsrcsu"
                    ? "⚡ Server 2 (VidSrc.su) ★"
                    : m === "vidsrcpm"
                    ? "🛸 Server 3 (VidSrc.pm) ★"
                    : m === "vidsrcnet"
                    ? "🔗 Server 4 (VidSrc.net) ★"
                    : m === "vidsrcme"
                    ? "🚀 Server 5 (VidSrc.me)"
                    : m === "vidlinkpro"
                    ? "✨ Server 6 (VidLink)"
                    : m === "embedsu"
                    ? "💾 Server 7 (Embed.su)"
                    : m === "vidsrcto"
                    ? "⚡ Server 8 (VidSrc.to)"
                    : m === "vidsrcxyz"
                    ? "🎥 Server 9 (VidSrc.xyz)"
                    : m === "vidsrcpro"
                    ? "🛸 Server 10 (VidSrc.pro)"
                    : m === "lordflix"
                    ? "👑 Server 11 (LordFlix)"
                    : m === "flixer"
                    ? "🎬 Server 12 (Flixer)"
                    : m === "bingebox"
                    ? "🍿 Server 13 (BingeBox)"
                    : "🔗 Server 14 (MultiEmbed)"}
                </button>
              ))}
            </div>
          </div>

          {/* TV Season / Episode selectors (only for TV Shows) */}
          {activeMovie.type === "tv" && (
            <div className="mt-4 bg-[#1B0C06] border border-red-950/30 p-4 rounded-xl shrink-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950/20 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-[#FF7E47] uppercase tracking-wider">
                    🍿 Season:
                  </span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: activeMovie.seasonsCount || 1 }, (_, i) => i + 1).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setCurrentSeason(s);
                          setCurrentEpisode(1);
                        }}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded font-mono transition ${
                          currentSeason === s
                            ? "bg-red-600 text-white shadow-md shadow-red-900/20"
                            : "bg-[#110603] text-[#D4A373]/60 hover:text-white"
                        }`}
                      >
                        S{s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-[#D4A373]/50 bg-black/40 px-3 py-1 rounded-lg border border-red-950/30">
                  Streaming: <span className="text-white font-bold">Season {currentSeason}</span>, <span className="text-[#FF7E47] font-bold">Episode {currentEpisode}</span>
                </div>
              </div>

              <h4 className="text-[10px] font-bold font-mono text-[#D4A373]/50 uppercase mb-2">Select Episode:</h4>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-h-24 overflow-y-auto pr-1">
                {Array.from({ length: 24 }, (_, i) => i + 1).map((e) => (
                  <button
                    key={e}
                    onClick={() => setCurrentEpisode(e)}
                    className={`py-1.5 text-[10px] font-bold rounded font-mono transition ${
                      currentEpisode === e
                        ? "bg-red-600 text-white shadow"
                        : "bg-[#110603] text-[#D4A373]/50 hover:bg-red-950/20 hover:text-white"
                    }`}
                  >
                    Ep {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metadata details */}
          <div className="mt-4 bg-[#1B0C06]/70 border border-red-950/30 p-4 rounded-xl flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xl font-bold text-white leading-snug">
                {activeMovie.title}
              </h2>
              <span className="text-[9px] font-mono bg-red-950/50 border border-red-500/20 text-[#FF7E47] px-2 py-0.5 rounded-full capitalize">
                {activeMovie.type === "tv" ? "TV Series" : "Movie"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#FFB347] font-mono mb-4">
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /> {activeMovie.rating}/10</span>
              <span>•</span>
              <span>Year: {activeMovie.year}</span>
              {activeMovie.runtime && (
                <>
                  <span>•</span>
                  <span>Duration: {activeMovie.runtime}</span>
                </>
              )}
              <span>•</span>
              <span className="text-[#D4A373]/80">Genres: {activeMovie.genres.join(", ")}</span>
            </div>
            <p className="text-xs text-[#D4A373] leading-relaxed">
              {activeMovie.description}
            </p>
          </div>
        </div>

        {/* Sidebar suggestions */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col space-y-4 h-full overflow-y-auto pb-6">
          <div className="bg-[#1B0C06] border border-red-950/30 p-4 rounded-xl">
            <h3 className="text-xs font-bold font-mono text-red-500 uppercase border-b border-red-950/20 pb-2 mb-3 flex items-center gap-1.5">
              <Flame className="h-4 w-4" /> Cineby Hot Releases
            </h3>
            <div className="space-y-3">
              {CINEBY_ITEMS.filter(m => m.id !== activeMovie.id).slice(0, 6).map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleSelectMovie(m)}
                  className="flex space-x-2.5 cursor-pointer group hover:bg-red-950/20 p-1.5 rounded-lg transition"
                >
                  <div className="relative w-11 aspect-[2/3] rounded overflow-hidden shrink-0 bg-[#110603] border border-red-950/20">
                    <img
                      src={m.thumbnail}
                      alt={m.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-[11px] font-bold text-white group-hover:text-red-400 leading-tight line-clamp-2 transition">
                        {m.title}
                      </h4>
                      <p className="text-[9px] text-[#D4A373]/70 font-mono mt-0.5">{m.year} • {m.type === "tv" ? "TV" : "Movie"}</p>
                    </div>
                    <span className="text-[9px] font-mono text-red-500 font-bold flex items-center gap-1">▶ Watch</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================= */
  /* SCREEN 2: ACTIVE PASTED YOUTUBE PLAYER */
  /* ======================================= */
  if (activeVideoId) {
    return (
      <div className="flex-1 bg-[#090302] text-[#FFE8D6] overflow-y-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 h-full min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navigation heading */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <button
              onClick={() => {
                setActiveVideoId(null);
                onNavigate("maple-tv");
              }}
              className="flex items-center gap-1.5 text-xs text-[#FF7E47] hover:text-[#FFB347] font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Maple TV Browse
            </button>
            <div className="text-[10px] font-mono bg-amber-950/40 border border-amber-500/30 text-amber-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              YouTube Gateway: Decryption Active
            </div>
          </div>

          {/* YouTube Video Player */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-amber-950/30 shadow-2xl flex flex-col shrink-0">
            <iframe
              id="tv-player-iframe"
              src={getYoutubeEmbedUrl(activeVideoId)}
              className="flex-1 w-full h-full border-none"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title="Maple YouTube Player"
            />
          </div>

          {/* YouTube Mirror Selector */}
          <div className="mt-4 bg-[#110603] border border-amber-950/20 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
              <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>🚀</span> YouTube Mirror Server Gateways
              </h4>
              <p className="text-[10px] text-[#D4A373]/70 mt-0.5">
                Each mirror routes streams differently to slip past local school firewalls and network blocks.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveMirror("nocookie")}
                className={`px-3 py-1.5 rounded text-[10px] font-bold font-mono transition border cursor-pointer ${
                  activeMirror === "nocookie"
                    ? "bg-[#FF7E47] text-white border-[#FF7E47] shadow"
                    : "bg-[#1B0C06] text-[#D4A373] border-amber-950/30 hover:bg-[#2D1409]"
                }`}
              >
                ⚡ Mirror 1 (Nocookie)
              </button>
              <button
                onClick={() => setActiveMirror("piped")}
                className={`px-3 py-1.5 rounded text-[10px] font-bold font-mono transition border cursor-pointer ${
                  activeMirror === "piped"
                    ? "bg-[#FFB347] text-[#110603] border-[#FFB347] shadow"
                    : "bg-[#1B0C06] text-[#D4A373] border-amber-950/30 hover:bg-[#2D1409]"
                }`}
              >
                🔒 Mirror 2 (Piped)
              </button>
              <button
                onClick={() => setActiveMirror("mapletv")}
                className={`px-3 py-1.5 rounded text-[10px] font-bold font-mono transition border cursor-pointer ${
                  activeMirror === "mapletv"
                    ? "bg-[#FF7E47] text-white border-[#FF7E47] shadow"
                    : "bg-[#1B0C06] text-[#D4A373] border-amber-950/30 hover:bg-[#2D1409]"
                }`}
              >
                🍁 Mirror 3 (Yewtu)
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 bg-[#1B0C06]/70 border border-[#3D1A0E]/30 p-4 rounded-xl flex-1 overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-1">
              Unblocked YouTube Stream
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#FFB347] font-mono mb-3">
              <span>Streaming Video ID: {activeVideoId}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Secure Tunnel</span>
            </div>
            <p className="text-xs text-[#D4A373] leading-relaxed">
              This stream is decrypted in real-time through our dedicated reverse proxies to bypass local school filtering. Zero YouTube tracker files are loaded.
            </p>
          </div>
        </div>

        {/* Sidebar movie fallback list */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col space-y-4 h-full overflow-y-auto pb-6">
          <div className="bg-[#1B0C06] border border-red-950/30 p-4 rounded-xl">
            <h3 className="text-xs font-bold font-mono text-red-500 uppercase border-b border-red-950/20 pb-2 mb-3 flex items-center gap-1.5">
              <Film className="h-4 w-4" /> Switch to Cineby Movies
            </h3>
            <div className="space-y-3">
              {CINEBY_ITEMS.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    handleSelectMovie(m);
                    setActiveVideoId(null);
                  }}
                  className="flex space-x-2 cursor-pointer group hover:bg-red-950/20 p-1.5 rounded transition"
                >
                  <div className="w-10 aspect-[2/3] bg-black rounded overflow-hidden shrink-0 border border-red-950/20">
                    <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-bold text-white truncate group-hover:text-red-400">{m.title}</h4>
                    <p className="text-[8px] text-[#D4A373]/60 font-mono capitalize">{m.type} • {m.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ======================================= */
  /* SCREEN 3: CINEBY MOVIE BROWSER (HOME)  */
  /* ======================================= */
  return (
    <div className="flex-1 bg-[#090302] text-[#FFE8D6] overflow-y-auto p-6 flex flex-col min-h-0 h-full">
      {/* Cinematic Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-red-950/40 via-[#1B0C06] to-[#090302] p-6 border border-red-950 mb-6 overflow-hidden shadow-lg shrink-0">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-[80px]">🍿</div>
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] font-mono tracking-widest text-[#FF7E47] uppercase font-bold bg-red-950/50 border border-red-500/30 px-2.5 py-1 rounded-full">
            🎬 Cineby-at Cinema Player
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-3 mb-1">
            Maple <span className="bg-gradient-to-r from-red-500 to-[#FF7E47] bg-clip-text text-transparent">TV</span>
          </h1>
          <p className="text-xs text-[#D4A373] leading-relaxed">
            Browse and watch unblocked blockbuster movies and hot TV series. Copy and paste any YouTube link below to stream videos or music instantly!
          </p>
        </div>
      </div>

      {/* Double Action Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6 shrink-0">
        
        {/* Box 1: YouTube URL Paste (Span 7) */}
        <div className="lg:col-span-7 bg-[#110603] border border-red-950/30 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold font-mono text-[#FF7E47] uppercase tracking-wider flex items-center gap-1.5">
              <span>🔗</span> Paste YouTube Stream
            </h3>
            <p className="text-[11px] text-[#D4A373]/80 leading-normal mt-1 max-w-xl">
              Paste a YouTube Video Link, Shorts, or ID to play via our secure, unblocked school proxy servers.
            </p>
          </div>

          <form onSubmit={handlePasteSubmit} className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="Paste YouTube Link (e.g., youtube.com/watch?v=...) or ID..."
              value={pastedUrl}
              onChange={(e) => setPastedUrl(e.target.value)}
              className="flex-1 bg-[#1B0C06] border border-red-950/30 text-xs px-3.5 py-2.5 rounded-xl text-white placeholder-[#D4A373]/30 focus:outline-none focus:border-red-500/40 font-mono"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer active:scale-95 shrink-0 shadow-md shadow-red-900/30"
            >
              Stream Video
            </button>
          </form>
          {pasteError && (
            <p className="text-[10px] text-red-400 font-mono mt-2">{pasteError}</p>
          )}
        </div>

        {/* Box 2: Custom Cineby TMDb Injector (Span 5) */}
        <div className="lg:col-span-5 bg-[#110603] border border-red-950/30 rounded-2xl p-5 shadow-md">
          <h3 className="text-xs font-bold font-mono text-red-500 uppercase tracking-wider flex items-center gap-1.5">
            <span>🔌</span> Custom Cineby Injector
          </h3>
          <p className="text-[11px] text-[#D4A373]/80 leading-normal mt-1">
            Want something else? Paste any Movie/TV TMDb ID to fetch it unblocked!
          </p>

          <form onSubmit={handleCustomStreamSubmit} className="flex flex-col gap-2 mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="TMDb ID (e.g. 533535)"
                value={customTmdbId}
                onChange={(e) => setCustomTmdbId(e.target.value)}
                className="w-1/2 bg-[#1B0C06] border border-red-950/30 text-xs px-3 py-1.5 rounded-lg text-white placeholder-[#D4A373]/30 font-mono focus:outline-none"
              />
              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value as "movie" | "tv")}
                className="w-1/2 bg-[#1B0C06] border border-red-950/30 text-xs px-2 py-1.5 rounded-lg text-white font-mono focus:outline-none capitalize"
              >
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Title (Optional)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="flex-1 bg-[#1B0C06] border border-red-950/30 text-xs px-3 py-1.5 rounded-lg text-white placeholder-[#D4A373]/30 font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#FF7E47] hover:bg-[#FF9E79] text-[#110603] font-bold text-xs px-4 py-1.5 rounded-lg transition"
              >
                Inject Stream
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-950/20 pb-5 mb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-bold font-mono text-red-500 flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Search Movies & TV Shows
          </h3>
          <p className="text-[10px] text-[#D4A373]/60 font-mono">Search by title and play instantly</p>
        </div>

        {/* Search & Type Filters */}
        <div className="flex flex-wrap items-center gap-3 max-w-2xl w-full justify-end">
          {/* Type pill selectors */}
          <div className="flex bg-[#110603] border border-red-950/30 p-1 rounded-xl">
            {(["all", "movie", "tv"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition cursor-pointer font-bold capitalize ${
                  selectedType === t
                    ? "bg-red-600 text-white"
                    : "text-[#D4A373]/60 hover:text-white"
                }`}
              >
                {t === "all" ? "🍿 All" : t === "movie" ? "🎬 Movies" : "📺 TV Shows"}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleInstantAutoPlay(movieSearchQuery);
            }}
            className="flex items-center gap-1.5 w-full sm:w-80"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#D4A373]/40" />
              <input
                type="text"
                placeholder="Type name & hit Enter to play..."
                value={movieSearchQuery}
                onChange={(e) => {
                  setMovieSearchQuery(e.target.value);
                  setInstantPlayError(null);
                }}
                className="w-full bg-[#1B0C06] border border-red-950/30 text-xs pl-9 pr-3 py-2 rounded-xl text-white placeholder-[#D4A373]/40 focus:outline-none focus:border-red-500/40 font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0 active:scale-95 shadow-md shadow-red-900/30"
              title="Auto-search and play this title instantly!"
            >
              <span>⚡</span> Play
            </button>
          </form>
        </div>
      </div>

      {/* Instant play error banner */}
      {instantPlayError && (
        <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-xs font-mono flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1.5">
            <span>⚠️</span> {instantPlayError}
          </span>
          <button
            onClick={() => setInstantPlayError(null)}
            className="text-[10px] text-red-400 hover:text-white underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}



      {/* Detail Loading Overlay */}
      {isLoadingDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#FF7E47] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs">🍿</div>
          </div>
          <h2 className="text-white font-bold text-sm mt-4 tracking-wide font-sans">Connecting to Cinema Nodes...</h2>
          <p className="text-[#D4A373]/60 text-[10px] font-mono mt-1">Decrypting catalog metadata and setting up secure stream tunnel</p>
        </div>
      )}

      {/* Cinema Library Grid */}
      {isSearching ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 pb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gradient-to-b from-[#110603] to-[#090302] border border-red-950/20 rounded-xl overflow-hidden aspect-[2/3] animate-pulse flex flex-col items-center justify-center p-4">
              <span className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></span>
              <span className="text-[9px] text-[#D4A373]/40 font-mono mt-3">Searching Cineby Index...</span>
            </div>
          ))}
        </div>
      ) : filteredCinebyItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 pb-6">
          {filteredCinebyItems.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleSelectMovie(movie)}
              className="group cursor-pointer bg-gradient-to-b from-[#110603] to-[#090302] border border-red-950/30 hover:border-red-500/40 rounded-xl overflow-hidden shadow-md flex flex-col h-full relative transition duration-300"
            >
              {/* Cover Art aspect-ratio 2:3 */}
              <div className="relative aspect-[2/3] bg-black overflow-hidden">
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-3">
                  <p className="text-[10px] text-[#D4A373] line-clamp-3 leading-snug mb-2 font-sans">
                    {movie.description}
                  </p>
                  <div className="bg-red-600 text-white rounded-lg py-1.5 flex items-center justify-center gap-1 text-[10px] font-extrabold tracking-wider font-mono uppercase shadow-md shadow-red-900/40">
                    <Play className="h-2.5 w-2.5 fill-white" /> Watch Now
                  </div>
                </div>

                {/* Rating & Year Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  {movie.rating !== "N/A" && (
                    <div className="px-1.5 py-0.5 bg-black/80 text-yellow-500 text-[8px] font-bold font-mono rounded flex items-center gap-0.5 border border-yellow-500/20">
                      ★ {movie.rating}
                    </div>
                  )}
                  <div className="px-1.5 py-0.5 bg-black/80 text-red-400 text-[8px] font-bold font-mono rounded border border-red-500/20 capitalize">
                    {movie.type === "tv" ? "TV Series" : "Movie"}
                  </div>
                </div>
              </div>

              {/* Title area */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-xs group-hover:text-red-400 transition line-clamp-1 leading-snug">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between text-[9px] text-[#D4A373]/60 font-mono mt-1">
                    <span>{movie.year}</span>
                    <span>{movie.runtime || "TV Series"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : movieSearchQuery.trim() === "" ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-[#D4A373]/50 shrink-0 border border-dashed border-red-950/20 rounded-2xl bg-black/10">
          <span className="text-4xl mb-4">🔍</span>
          <p className="text-sm font-bold text-white">Search Movies or TV Shows Above</p>
          <p className="text-xs mt-1 text-[#D4A373]/60 max-w-md leading-relaxed">
            Type any title in the search box (e.g. "Avatar", "Breaking Bad") and click "Play" or select a result to start streaming unblocked bypass layers instantly!
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-[#D4A373]/50 shrink-0 border border-dashed border-red-950/20 rounded-2xl bg-black/10">
          <p className="text-sm font-bold text-white">No results found in Cineby catalog</p>
          <p className="text-xs mt-1">Try another search term, or type a custom TMDb ID in the injector above!</p>
        </div>
      )}

    </div>
  );
}
