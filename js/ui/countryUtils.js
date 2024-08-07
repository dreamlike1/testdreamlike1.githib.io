import { countryOptions } from '../api/countryData.js'; // Adjust the path as needed
import { fetchHolidays } from '../api/holidays.js';

let holidaysCache = {};  // Cache to store holidays data for all countries

/**
 * Populate the country dropdown with options based on the selected service type,
 * and set the first country as the selected option.
 */
export async function populateCountries(serviceType = 'expressPaid') {
    const countrySelectDropdown = $('#countrySelect'); // Ensure correct ID is used here
    const countries = countryOptions[serviceType] || [];

    // Clear existing options
    countrySelectDropdown.dropdown('clear');

    // Prepare options for Semantic UI dropdown
    const options = countries.map(country => ({
        text: country,
        value: country
    }));

    // Update dropdown with new options
    countrySelectDropdown.dropdown('setup menu', {
        values: options
    });

    // Set the first country as selected
    if (options.length > 0) {
        countrySelectDropdown.dropdown('set selected', options[0].value);
    }

    // Clear previous holidays data
    holidaysCache = {};

    // Fetch and cache holidays for each country in the background
    const fetchHolidaysPromises = countries.map(async (country) => {
        try {
            const currentYear = new Date().getFullYear();
            const holidays = await fetchHolidays(country, currentYear);
            holidaysCache[country] = holidays; // Store holidays in cache
        } catch (error) {
            console.error(`Error fetching holidays for ${country}:`, error);
        }
    });

    // Wait for all holidays data to be fetched and cached
    await Promise.all(fetchHolidaysPromises);
}

/**
 * Retrieve holidays for a specific country from the cache.
 * @param {string} country - The country for which to retrieve holidays.
 * @returns {Array} - An array of holiday objects for the specified country.
 */
export function getHolidaysForCountry(country) {
    return holidaysCache[country] || [];
}
