import { countryCodeMapping } from './countryData.js';

// Cache for storing holidays data
const holidayCache = new Map();

/**
 * Fetch holidays from the Nager.Date API.
 * @param {string} countryCode - The country code to fetch holidays for.
 * @param {number} year - The year to fetch holidays for.
 * @returns {Promise<Array>} - A promise that resolves to an array of holidays.
 */
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

/**
 * Get holidays for a specific country and year, using caching.
 * @param {string} countryCode - The country code to fetch holidays for.
 * @param {number} year - The year to fetch holidays for.
 * @returns {Promise<Array>} - A promise that resolves to an array of holidays.
 */
async function getHolidays(countryCode, year) {
    const cacheKey = `${countryCode}-${year}`;
    if (holidayCache.has(cacheKey)) {
        return holidayCache.get(cacheKey);
    }

    const holidays = await fetchHolidaysFromNager(countryCode, year);
    if (holidays.length === 0) {
        console.warn(`No holidays found for ${countryCode} in ${year}`);
    }
    holidayCache.set(cacheKey, holidays);
    return holidays;
}

/**
 * Fetch holidays for a given country and year.
 * @param {string} country - The country name to fetch holidays for.
 * @param {number} year - The year to fetch holidays for.
 * @returns {Promise<Array>} - A promise that resolves to an array of holidays.
 */
export async function fetchHolidays(country, year) {
    const countryCode = countryCodeMapping[country];
    if (!countryCode) {
        console.error(`No country code found for ${country}`);
        return [];
    }
    return await getHolidays(countryCode, year);
}

/**
 * Check if a specific date is a holiday in the given country.
 * @param {string} date - The date to check (in ISO format, e.g., '2024-08-15').
 * @param {string} country - The country name to check holidays for.
 * @returns {Promise<boolean>} - A promise that resolves to true if the date is a holiday, false otherwise.
 */
export async function isHoliday(date, country) {
    try {
        const countryCode = countryCodeMapping[country];
        if (!countryCode) {
            console.error(`Invalid country name: ${country}`);
            return false;
        }

        const year = new Date(date).getFullYear();
        const holidays = await getHolidays(countryCode, year);
        return holidays.some(holiday => holiday.date === date);
    } catch (error) {
        console.error(`Error in isHoliday function for ${country}:`, error);
        return false;
    }
}
