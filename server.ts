import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // API Proxy Route
  app.post("/api/proxy", async (req, res) => {
    const { url, method = "GET", headers = {}, body } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const startTime = Date.now();

    try {
      const cleanHeaders: Record<string, string> = {};
      
      // Filter out typical client-only headers to prevent credential leaks or fetch errors
      Object.keys(headers).forEach((key) => {
        const lKey = key.toLowerCase();
        if (
          !lKey.startsWith("sec-") &&
          lKey !== "host" &&
          lKey !== "origin" &&
          lKey !== "referer" &&
          lKey !== "connection"
        ) {
          cleanHeaders[key] = headers[key];
        }
      });

      const fetchOptions: RequestInit = {
        method: method.toUpperCase(),
        headers: {
          ...cleanHeaders,
          "User-Agent": "AI-Studio-Developer-Proxy/1.0",
        },
      };

      if (body && ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())) {
        fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      const endTime = Date.now();
      const latency = endTime - startTime;

      // Extract response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Parse payload
      const contentType = response.headers.get("content-type") || "";
      let responseBody: any = null;
      let isJson = false;

      if (contentType.includes("application/json")) {
        try {
          responseBody = await response.json();
          isJson = true;
        } catch {
          responseBody = await response.text();
        }
      } else {
        responseBody = await response.text();
      }

      res.json({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
        isJson,
        latency,
        size: typeof responseBody === "string" ? responseBody.length : JSON.stringify(responseBody || "").length,
      });
    } catch (error: any) {
      const endTime = Date.now();
      res.status(500).json({
        error: "Failed to proxy request",
        message: error.message,
        latency: endTime - startTime,
      });
    }
  });

  // Cineby API - Dynamic OMDb Search Proxy
  app.get("/api/cineby/search", async (req, res) => {
    const query = req.query.q as string;
    const filterType = req.query.type as string; // 'movie' or 'series' / 'tv'
    
    if (!query || !query.trim()) {
      return res.json({ Search: [] });
    }

    try {
      const omdbType = filterType === "tv" ? "series" : filterType === "movie" ? "movie" : "";
      const omdbUrl = `http://www.omdbapi.com/?apikey=thewdb&s=${encodeURIComponent(query)}&type=${omdbType}`;
      
      const response = await fetch(omdbUrl);
      if (!response.ok) {
        throw new Error(`OMDb error: ${response.status}`);
      }

      const data: any = await response.json();
      if (data.Response === "True" && data.Search) {
        const items = data.Search.map((item: any) => ({
          id: item.imdbID,
          title: item.Title,
          type: item.Type === "series" ? "tv" : "movie",
          rating: "N/A",
          year: item.Year,
          genres: [item.Type === "series" ? "Series" : "Movie"],
          thumbnail: item.Poster !== "N/A" ? item.Poster : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80",
          description: "Click to load details and stream instantly...",
        }));
        res.json({ Search: items });
      } else {
        res.json({ Search: [], error: data.Error || "No movies found" });
      }
    } catch (error: any) {
      console.error("Cineby search error:", error);
      res.status(500).json({ Search: [], error: error.message });
    }
  });

  // Cineby API - Get Movie/Show Details
  app.get("/api/cineby/detail", async (req, res) => {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }

    try {
      const omdbUrl = `http://www.omdbapi.com/?apikey=thewdb&i=${id}&plot=full`;
      const response = await fetch(omdbUrl);
      if (!response.ok) {
        throw new Error(`OMDb error: ${response.status}`);
      }

      const data: any = await response.json();
      if (data.Response === "True") {
        const genres = data.Genre !== "N/A" ? data.Genre.split(",").map((g: string) => g.trim()) : ["Drama"];
        res.json({
          id: data.imdbID,
          title: data.Title,
          type: data.Type === "series" ? "tv" : "movie",
          rating: data.imdbRating !== "N/A" ? data.imdbRating : "8.0",
          year: data.Year,
          runtime: data.Runtime !== "N/A" ? data.Runtime : undefined,
          genres: genres,
          thumbnail: data.Poster !== "N/A" ? data.Poster : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80",
          description: data.Plot !== "N/A" ? data.Plot : "No description available.",
          seasonsCount: data.totalSeasons !== "N/A" ? parseInt(data.totalSeasons) || undefined : undefined,
        });
      } else {
        res.status(404).json({ error: data.Error || "Movie details not found" });
      }
    } catch (error: any) {
      console.error("Cineby detail error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Cineby API - Find Movie/Show by direct title search (auto-plays matches)
  app.get("/api/cineby/detail_by_title", async (req, res) => {
    const title = req.query.title as string;
    const filterType = req.query.type as string; // 'movie' or 'tv'
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title parameter is required" });
    }

    try {
      const omdbType = filterType === "tv" ? "series" : filterType === "movie" ? "movie" : "";
      const omdbUrl = `http://www.omdbapi.com/?apikey=thewdb&t=${encodeURIComponent(title)}&type=${omdbType}`;
      const response = await fetch(omdbUrl);
      if (!response.ok) {
        throw new Error(`OMDb error: ${response.status}`);
      }

      const data: any = await response.json();
      if (data.Response === "True") {
        const genres = data.Genre !== "N/A" ? data.Genre.split(",").map((g: string) => g.trim()) : ["Drama"];
        res.json({
          id: data.imdbID,
          title: data.Title,
          type: data.Type === "series" ? "tv" : "movie",
          rating: data.imdbRating !== "N/A" ? data.imdbRating : "8.0",
          year: data.Year,
          runtime: data.Runtime !== "N/A" ? data.Runtime : undefined,
          genres: genres,
          thumbnail: data.Poster !== "N/A" ? data.Poster : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80",
          description: data.Plot !== "N/A" ? data.Plot : "No description available.",
          seasonsCount: data.totalSeasons !== "N/A" ? parseInt(data.totalSeasons) || undefined : undefined,
        });
      } else {
        res.status(404).json({ error: data.Error || "Movie details not found" });
      }
    } catch (error: any) {
      console.error("Cineby detail_by_title error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // RAW PROXY ROUTE (Full Webpage Unblocker)
  app.get("/api/proxy/raw", async (req, res) => {
    let targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).send("URL parameter is required");
    }

    // Add protocol if missing
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    // 1. YouTube smart unblocking / redirection
    if (/youtube\.com|youtu\.be/i.test(targetUrl)) {
      const videoMatch = targetUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i);
      if (videoMatch && videoMatch[1]) {
        return res.redirect(`https://www.youtube-nocookie.com/embed/${videoMatch[1]}?autoplay=1`);
      }
      
      // Preserve search queries from YouTube so searching from the unblocker works perfectly
      const searchMatch = targetUrl.match(/(?:search_query|q)=([^&]+)/i);
      if (searchMatch && searchMatch[1]) {
        return res.redirect(`https://piped.video/results?search_query=${searchMatch[1]}`);
      }

      // Redirect YouTube Home, "For You", and other feeds to Piped (gorgeous, clean unblocked YouTube client)
      return res.redirect("https://piped.video/");
    }

    // 2. Scratch & TurboWarp smart redirection to direct unblocked TurboWarp embed (100% working high-performance HTML5 player)
    if (/scratch\.mit\.edu|turbowarp\.org/i.test(targetUrl)) {
      const projectMatch = targetUrl.match(/(?:projects\/|\/)(\d+)/i);
      if (projectMatch && projectMatch[1]) {
        // Use the official, standard embed.html query format to ensure it is 100% valid in TurboWarp
        return res.redirect(`https://turbowarp.org/embed.html?project=${projectMatch[1]}&hq=true&autoplay=true`);
      }
      return res.redirect("https://turbowarp.org/");
    }

    // Build anti-detect browser headers with Range/cache support
    const requestHeaders: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": req.headers["accept"] as string || "*/*",
      "Accept-Language": req.headers["accept-language"] as string || "en-US,en;q=0.9",
    };

    // Forward HTTP Range headers (critical for audio/video streaming files)
    if (req.headers["range"]) {
      requestHeaders["Range"] = req.headers["range"] as string;
    }
    if (req.headers["if-range"]) {
      requestHeaders["If-Range"] = req.headers["if-range"] as string;
    }
    // Forward standard validation/caching headers
    if (req.headers["if-none-match"]) {
      requestHeaders["If-None-Match"] = req.headers["if-none-match"] as string;
    }
    if (req.headers["if-modified-since"]) {
      requestHeaders["If-Modified-Since"] = req.headers["if-modified-since"] as string;
    }

    const fetchOptions: RequestInit = {
      method: "GET",
      headers: requestHeaders
    };

    let response: Response;
    let finalUrl = targetUrl;
    let fallbackToExternal = false;

    try {
      response = await fetch(targetUrl, fetchOptions);
      finalUrl = response.url || targetUrl;

      // If we receive a rate limit or authorization block, fall back to external proxy
      if (response.status === 429 || response.status === 403 || response.status === 401) {
        fallbackToExternal = true;
      }
    } catch (e) {
      fallbackToExternal = true;
    }

    // If local fetch failed or was blocked, try the external proxy requested by the user
    if (fallbackToExternal) {
      try {
        const externalProxyUrl = `https://agile-brain-307.inmobiliariamardelplata.com/api/proxy/raw?url=${encodeURIComponent(targetUrl)}`;
        const extResponse = await fetch(externalProxyUrl, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
          }
        });

        if (extResponse.ok) {
          const contentType = extResponse.headers.get("content-type") || "";
          res.setHeader("Content-Type", contentType);

          if (contentType.includes("text/html")) {
            let html = await extResponse.text();
            // Rewrite the links back to our local proxy path so navigation stays inside our applet iframe
            html = html.replaceAll("https://agile-brain-307.inmobiliariamardelplata.com/api/proxy/raw", "/api/proxy/raw");
            html = html.replaceAll("http://agile-brain-307.inmobiliariamardelplata.com/api/proxy/raw", "/api/proxy/raw");
            html = html.replaceAll("https://agile-brain-307.inmobiliariamardelplata.com", "");
            html = html.replaceAll("http://agile-brain-307.inmobiliariamardelplata.com", "");
            return res.send(html);
          } else {
            const buffer = await extResponse.arrayBuffer();
            return res.send(Buffer.from(buffer));
          }
        }
      } catch (extError) {
        // Fall through to local fallback/error screen if both failed
      }
    }

    // If we didn't fall back, or if external proxy fallback failed, proceed with local response
    try {
      if (!response) {
        throw new Error("Target site is unreachable");
      }

      const contentType = response.headers.get("content-type") || "";
      res.setHeader("Content-Type", contentType);

      if (contentType.includes("text/html")) {
        let html = await response.text();

        const resolveAndProxy = (match: string, attr: string, urlVal: string) => {
          if (!urlVal || urlVal.startsWith("#") || urlVal.startsWith("javascript:") || urlVal.startsWith("data:") || urlVal.startsWith("/api/proxy/raw")) {
            return match;
          }
          try {
            const absoluteUrl = new URL(urlVal, finalUrl).toString();
            return `${attr}="/api/proxy/raw?url=${encodeURIComponent(absoluteUrl)}"`;
          } catch (e) {
            return match;
          }
        };

        html = html.replace(/(src|href)=["']([^"']*)["']/gi, (match, attr, urlVal) => {
          return resolveAndProxy(match, attr, urlVal);
        });

        html = html.replace(/(action)=["']([^"']*)["']/gi, (match, attr, urlVal) => {
          return resolveAndProxy(match, attr, urlVal);
        });

        const injection = `
          <script>
            window.__PROXY_TARGET_URL__ = "${finalUrl}";

            function proxyUrl(url) {
              if (!url) return url;
              const sUrl = String(url).trim();
              if (sUrl.startsWith('#') || sUrl.startsWith('javascript:') || sUrl.startsWith('data:') || sUrl.startsWith('/api/proxy/raw')) {
                return url;
              }
              try {
                const abs = new URL(sUrl, window.__PROXY_TARGET_URL__).toString();
                return '/api/proxy/raw?url=' + encodeURIComponent(abs);
              } catch(e) {
                return url;
              }
            }

            window.addEventListener('DOMContentLoaded', () => {
              document.querySelectorAll('a').forEach(link => {
                if (link.href) {
                  const hrefVal = link.getAttribute('href');
                  if (hrefVal && !hrefVal.startsWith('#') && !hrefVal.startsWith('javascript:')) {
                    try {
                      link.href = proxyUrl(hrefVal);
                    } catch(e) {}
                  }
                }
              });
            });

            // Intercept window.fetch
            const origFetch = window.fetch;
            window.fetch = async function(input, init) {
              let url = "";
              if (typeof input === 'string') {
                url = input;
              } else if (input instanceof Request) {
                url = input.url;
              } else {
                url = String(input);
              }
              
              if (url && !url.startsWith('/api/proxy') && !url.startsWith('data:')) {
                const proxied = proxyUrl(url);
                if (typeof input === 'string') {
                  input = proxied;
                } else {
                  input = new Request(proxied, input);
                }
              }
              return origFetch.call(this, input, init);
            };

            // Intercept XMLHttpRequest
            const origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
              if (typeof url === 'string' && url && !url.startsWith('/api/proxy') && !url.startsWith('data:')) {
                url = proxyUrl(url);
              }
              return origOpen.call(this, method, url, ...args);
            };
          </script>
        `;

        if (html.includes("</head>")) {
          html = html.replace("</head>", injection + "</head>");
        } else {
          html = injection + html;
        }

        res.send(html);
      } else {
        // Forward response status (crucial for 206 Partial Content, 304 Not Modified, etc.)
        res.status(response.status);

        // Forward response headers that are important for media streaming/caching
        const headersToForward = [
          "content-type",
          "content-length",
          "content-range",
          "accept-ranges",
          "cache-control",
          "expires",
          "pragma",
          "last-modified",
          "etag"
        ];
        for (const h of headersToForward) {
          const val = response.headers.get(h);
          if (val) {
            res.setHeader(h, val);
          }
        }

        if (response.body) {
          const reader = response.body.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              res.write(Buffer.from(value));
            }
          } catch (streamError) {
            console.error("Error streaming proxy response:", streamError);
          } finally {
            res.end();
          }
        } else {
          // Fallback if response.body is not available
          const buffer = await response.arrayBuffer();
          res.send(Buffer.from(buffer));
        }
      }
    } catch (fallbackError: any) {
      res.status(500).send(`
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background: #1b0c06; color: #ffe8d6; border-radius: 12px; max-width: 500px; margin: 40px auto; border: 1px solid #3d1a0e; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <div style="background: rgba(239, 68, 68, 0.1); color: #ff7e47; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; margin-right: 12px;">🍁</div>
            <h3 style="margin: 0; font-size: 18px; color: #ffffff;">Maple Unblocc failed to load</h3>
          </div>
          <p style="font-size: 14px; color: #d4a373; margin-bottom: 20px;">Could not unblock <strong>${targetUrl}</strong> via any tunnel.</p>
          <div style="background: #110603; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; color: #ff9e79; border: 1px solid #3d1a0e; margin-bottom: 20px; overflow-x: auto;">
            Error: ${fallbackError.message}
          </div>
          <button onclick="window.location.reload()" style="background: linear-gradient(135deg, #ff7e47 0%, #a63a13 100%); color: white; border: none; padding: 10px 20px; font-size: 14px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.2s; width: 100%;">
            Retry Proxy Tunnel
          </button>
        </div>
      `);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
