// ui/countryUtils.js

import { countryOptions } from '../api/countryData.js';
import { fetchHolidays } from '../api/holidays.js';

let holidaysCache = {};  // Cache to store holidays data for all countries

/**
 * Fetch and cache holidays for countries based on the selected service type,
 * and populate the country dropdown.
 */
export async function populateCountries(serviceType = 'default') {
    const countrySelect = document.getElementById('countrySelect');
    const countries = countryOptions[serviceType] || [];

    // Clear the current options in the dropdown
    countrySelect.innerHTML = '<option value="">Select a country</option>'; // Add default option

    // Clear previous holidays data
    holidaysCache = {};

    // Fetch holidays for each country and update cache
    for (const country of countries) {
        try {
            const currentYear = new Date().getFullYear();
            const holidays = await fetchHolidays(country, currentYear);
            holidaysCache[country] = holidays; // Store holidays in cache
        } catch (error) {
            console.error(`Error fetching holidays for ${country}:`, error);
        }
    }

    // Populate the country dropdown
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

/**
 * Retrieve holidays for a specific country from the cache.
 * @param {string} country - The country for which to retrieve holidays.
 * @returns {Array} - An array of holiday objects for the specified country.
 */
export function getHolidaysForCountry(country) {
    return holidaysCache[country] || [];
}
