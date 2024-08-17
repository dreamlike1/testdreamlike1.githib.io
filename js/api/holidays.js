// Import country code mapping from an external file
import { countryCodeMapping } from './countryData.js';

// Cache for storing fetched holidays with a composite key of country name and year
const holidayCache = new Map();
// List of countries with no holidays found from Nager.Date API
const noHolidayCountriesFromNager = [];

// Fetch API key from environment variables (client-side)
const CALENDARIFIC_API_KEY = 'BTt8heuTpeBgdcywGi3aogyX4C0fKfQ3'; // Ensure this is defined

if (!CALENDARIFIC_API_KEY) {
  console.error('Calendarific API key is not defined in environment variables.');
}

// Function to fetch holidays from Nager.Date API using country code
async function fetchHolidaysFromNager(countryCode, year) {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`);
    if (!response.ok) throw new Error(`Nager API request failed: ${response.statusText}`);
    
    const text = await response.text();
    if (!text) {
      console.warn(`Empty response body for ${countryCode} from Nager.Date API`);
      return [];
    }

    try {
      const holidays = JSON.parse(text);
      // Log the fetched holidays to verify content
      console.log(`Holidays fetched for ${countryCode} in ${year}:`, holidays);
      // Filter holidays to include only those marked with "global": true
      return holidays.filter(holiday => holiday.global);
    } catch (error) {
      console.error(`Error parsing JSON from Nager.Date API response for ${countryCode}:`, error);
      return [];
    }
    
  } catch (error) {
    console.error(`Error fetching holidays from Nager for ${countryCode}:`, error);
    return [];
  }
}

// Function to get holidays for a country and year, using caching
async function getHolidays(countryName, year) {
  const countryCode = countryCodeMapping[countryName];
  if (!countryCode) {
    console.error(`No country code found for ${countryName}`);
    return [];
  }

  const cacheKey = `${countryName}-${year}`;
  
  // Check if holidays are already cached
  if (holidayCache.has(cacheKey)) {
    return holidayCache.get(cacheKey);
  }

  let holidays = await fetchHolidaysFromNager(countryCode, year);
  
  if (holidays && holidays.length > 0) {
    holidayCache.set(cacheKey, holidays);
    return holidays;
  } 

  // If no holidays found from Nager.Date, add to the specific list
  noHolidayCountriesFromNager.push({ countryName, year });

  holidayCache.set(cacheKey, []); // Cache the empty result for future requests
  return [];
}

// Function to fetch holidays for the current year and up to 4 future years dynamically
async function fetchAndCacheHolidays(countries) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4];

  for (const country of countries) {
    console.log(`Fetching holidays for ${country} for years: ${years.join(', ')}`);
    // Create an array of promises to fetch holidays for all years
    const fetchHolidaysPromises = years.map(async year => {
      try {
        console.log(`Fetching holidays for ${country} in ${year}`);
        const holidays = await fetchHolidaysFromNager(countryCodeMapping[country], year);
        if (holidays.length > 0) {
          holidayCache.set(`${country}-${year}`, holidays); // Cache holidays for each year
          console.log(`Holidays fetched for ${country} in ${year}:`, holidays);
        } else {
          console.warn(`No holidays found for ${country} in ${year}`);
          noHolidayCountriesFromNager.push({ countryName: country, year });
          holidayCache.set(`${country}-${year}`, []); // Cache empty result
        }
      } catch (error) {
        console.error(`Error fetching holidays for ${country} in ${year}:`, error);
        holidayCache.set(`${country}-${year}`, []); // Cache empty result in case of error
      }
    });

    // Wait for all promises to resolve
    await Promise.all(fetchHolidaysPromises);
  }

  console.log('All holidays data fetched and cached');
  console.log('Holidays Cache:', holidayCache);
}

// Function to fetch holidays using country name
export async function fetchHolidays(countryName, year) {
  console.log(`Fetching holidays for ${countryName} in ${year}`); // Debug log
  const holidays = await getHolidays(countryName, year);
  
  if (holidays) {
    return holidays;
  } else {
    console.warn(`No holiday data available for ${countryName} for year ${year}`);
    return null;
  }
}

// Function to check if a given date is a holiday for a specific country
export async function isHoliday(date, countryName) {
  try {
    const year = new Date(date).getFullYear();
    const holidays = await getHolidays(countryName, year);
    if (!holidays) return false;

    return holidays.some(holiday => holiday.date === date);
  } catch (error) {
    console.error(`Error in isHoliday function for ${countryName}:`, error);
    return false;
  }
}

// Function to log countries with no holidays found from Nager.Date API
export function listNoHolidayCountries() {
  if (noHolidayCountriesFromNager.length > 0) {
    console.log(`Countries with no holidays found from Nager.Date API:`);
    noHolidayCountriesFromNager.forEach(({ countryName, year }) => {
      console.log(`- ${countryName} (Year: ${year})`);
    });
    console.log(`Total: ${noHolidayCountriesFromNager.length}`);
  }
}
