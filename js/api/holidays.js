// Import country code mapping from an external file
import { countryCodeMapping } from './countryData.js';

// Cache for storing fetched holidays with a composite key of country code and year
const holidayCache = new Map();
// List of countries with no holidays found from Nager.Date API
const noHolidayCountriesFromNager = [];

// Fetch API key from environment variables (client-side)
const CALENDERIFIC_API_KEY = 'IhwrwKSLCH7TxspRv0NROXGLSUqhcJgk';

if (!CALENDERIFIC_API_KEY) {
  console.error('Calenderific API key is not defined in environment variables.');
}

async function fetchHolidaysFromNager(countryCode, year) {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`);
    if (!response.ok) throw new Error(`Nager API request failed: ${response.statusText}`);
    
    const holidays = await response.json();
    return holidays.filter(holiday => holiday.type === 'Public');
    
  } catch (error) {
    console.error(`Error fetching holidays from Nager for ${countryCode}:`, error);
    return [];
  }
}

async function fetchHolidaysFromCalenderific(countryCode, year) {
  try {
    const response = await fetch(`https://calendarific.com/api/v2/holidays?&api_key=${CALENDERIFIC_API_KEY}&country=${countryCode}&year=${year}`);
    if (!response.ok) {
      console.error(`Calenderific API request failed: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.response.holidays
      .filter(holiday => holiday.type === 'Public')
      .map(holiday => ({
        date: holiday.date.iso,
        localName: holiday.name,
        countryCode: countryCode
      }));
    
  } catch (error) {
    console.error(`Error fetching holidays from Calenderific for ${countryCode}:`, error);
    return null;
  }
}

async function getHolidays(countryCode, year) {
  const cacheKey = `${countryCode}-${year}`;
  
  // Check cache first
  if (holidayCache.has(cacheKey)) {
    return holidayCache.get(cacheKey);
  }

  // Fetch holidays from Nager.Date
  const nagerHolidays = await fetchHolidaysFromNager(countryCode, year);

  if (nagerHolidays.length > 0) {
    holidayCache.set(cacheKey, nagerHolidays);
    return nagerHolidays;
  }

  // If no holidays found from Nager.Date, add to specific list and fetch from Calenderific
  noHolidayCountriesFromNager.push(countryCode);
  const calenderificHolidays = await fetchHolidaysFromCalenderific(countryCode, year);

  if (calenderificHolidays && calenderificHolidays.length > 0) {
    holidayCache.set(cacheKey, calenderificHolidays);
    return calenderificHolidays;
  }

  return [];
}

export async function fetchHolidays(country, year) {
  const countryCode = countryCodeMapping[country];
  if (!countryCode) {
    console.error(`No country code found for ${country}`);
    return null;
  }

  const holidays = await getHolidays(countryCode, year);
  
  if (holidays) {
    return holidays;
  } else {
    console.warn(`No holiday data available for ${country} for year ${year}`);
    return null;
  }
}

export async function isHoliday(date, country) {
  try {
    const countryCode = countryCodeMapping[country];
    if (!countryCode) {
      console.error(`Invalid country name: ${country}`);
      return false;
    }

    const year = new Date(date).getFullYear();
    const holidays = await getHolidays(countryCode, year);
    return holidays ? holidays.some(holiday => holiday.date === date) : false;
  } catch (error) {
    console.error(`Error in isHoliday function for ${country}:`, error);
    return false;
  }
}

// Log countries with no holidays found from Nager.Date API
console.log('Countries with no holidays found from Nager.Date API:', noHolidayCountriesFromNager);
