// ui/countryUtils.js

import { countryOptions } from '../api/countryData.js';
import { fetchHolidays } from '../api/holidays.js';

let holidaysCache = {};  // Stores holidays data for all countries

export async function populateCountries(serviceType = 'default') {
    // Clear previous holidays data
    holidaysCache = {};

    // Get countries based on selected service type
    const countries = countryOptions[serviceType] || [];
    
    for (const country of countries) {
        try {
            // Fetch holidays for the current country and year
            const currentYear = new Date().getFullYear();
            const holidays = await fetchHolidays(country, currentYear);
            
            // Store holidays in the cache
            holidaysCache[country] = holidays;
        } catch (error) {
            console.error(`Error fetching holidays for ${country}:`, error);
        }
    }
    
    // Optionally, you can do something with the holidays data here,
    // like updating the UI to reflect that all data is loaded.
}

// Function to retrieve holidays for a specific country
export function getHolidaysForCountry(country) {
    return holidaysCache[country] || [];
}
