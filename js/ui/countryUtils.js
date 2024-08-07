import { countryOptions } from '../api/countryData.js'; // Adjust the path as needed
import { fetchHolidays } from '../api/holidays.js';

let holidaysCache = {};  // Cache to store holidays data for all countries

/**
 * Populate the country dropdown with options based on the selected service type.
 */
export async function populateCountries(serviceType = 'expressPaid') {
    const countrySelectDropdown = $('#countrySelect');
    const countries = countryOptions[serviceType] || [];

    console.log('Service Type:', serviceType); // Debugging line
    console.log('Countries:', countries); // Debugging line

    // Prepare options for Semantic UI dropdown
    const options = countries.map(country => ({
        text: country,
        value: country
    }));

    console.log('Dropdown Options:', options); // Debugging line

    // Clear existing options
    countrySelectDropdown.empty();

    // Append the default option
    countrySelectDropdown.append('<option value="" disabled selected>Select Country</option>');

    // Destroy existing dropdown instance if exists
    countrySelectDropdown.dropdown('destroy');

    // Append new options
    const optionElements = options.map(option => `<option value="${option.value}">${option.text}</option>`).join('');
    countrySelectDropdown.append(optionElements);

    // Reinitialize Semantic UI dropdown with the custom options
    countrySelectDropdown.dropdown({
        onChange: function (value) {
            console.log('Dropdown value changed to:', value); // Debugging line
            // Manually hide the dropdown
            countrySelectDropdown.dropdown('hide');
        }
    });

    // Set the first country as selected if options are available
    if (options.length > 0) {
        countrySelectDropdown.dropdown('set selected', options[0].value);
    }

    // Clear previous holidays data
    holidaysCache = {};

    // Fetch and cache holidays for each country in the background
    const fetchHolidaysPromises = countries.map(async (country) => {
        try {
            console.log('Fetching holidays for:', country); // Debugging line
            const currentYear = new Date().getFullYear();
            const holidays = await fetchHolidays(country, currentYear);
            holidaysCache[country] = holidays; // Store holidays in cache
            console.log('Holidays fetched for:', country, holidays); // Debugging line
        } catch (error) {
            console.error(`Error fetching holidays for ${country}:`, error);
        }
    });

    // Wait for all holidays data to be fetched and cached
    await Promise.all(fetchHolidaysPromises);

    console.log('All holidays data fetched and cached'); // Debugging line
}

/**
 * Retrieve holidays for a specific country from the cache.
 * @param {string} country - The country for which to retrieve holidays.
 * @returns {Array} - An array of holiday objects for the specified country.
 */
export function getHolidaysForCountry(country) {
    return holidaysCache[country] || [];
}
