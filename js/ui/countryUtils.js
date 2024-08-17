import { fetchHolidays } from '../api/holidays.js';
import { listNoHolidayCountries } from '../api/holidays.js'; // Ensure this import is correct
import { countryOptions } from '../api/countryData.js';

let holidaysCache = {};  // Cache to store holidays data for all countries

/**
 * Populate the country dropdown with options based on the selected service type.
 * @param {string} serviceType - The service type to filter countries.
 */
export async function populateCountries(serviceType = 'expressPaid') {
    const countrySelectDropdown = $('#countrySelect');
    const countries = countryOptions[serviceType] || [];
    
    // Debugging: log service type and available countries
    console.log('Service Type:', serviceType);
    console.log('Countries:', countries);
    
    // Prepare dropdown options
    const options = countries.map(country => ({
        text: country,
        value: country
    }));

    // Debugging: log dropdown options
    console.log('Dropdown Options:', options);

    // Reinitialize dropdown
    await initializeDropdown(countrySelectDropdown, options);

    // Clear previous holidays data
    holidaysCache = {};

    // Fetch and cache holidays for the current year and the next 3 years
    await fetchAndCacheHolidays(countries);

    // Log countries with no holidays found
    listNoHolidayCountries(); // Ensure this function is correctly called
}

/**
 * Initialize or reinitialize the dropdown with the provided options.
 * @param {jQuery} dropdown - The jQuery object of the dropdown element.
 * @param {Array} options - Array of options to populate the dropdown.
 */
async function initializeDropdown(dropdown, options) {
    // Clear existing options
    dropdown.empty();
    
    // Append the default option
    dropdown.append('<option value="" disabled selected>Select Country</option>');

    // Destroy existing dropdown instance if it exists
    if (dropdown.hasClass('ui dropdown')) {
        dropdown.dropdown('destroy');
    }

    // Append new options
    const optionElements = options.map(option => `<option value="${option.value}">${option.text}</option>`).join('');
    dropdown.append(optionElements);

    // Reinitialize Semantic UI dropdown
    dropdown.dropdown({
        onChange: function(value) {
            console.log('Dropdown value changed to:', value);
            // Manually hide the dropdown with a slight delay
            setTimeout(() => dropdown.dropdown('hide'), 100);
        },
        allowAdditions: false, // Disable adding new items if not needed
        fullTextSearch: true   // Enable full text search if needed
    });

    // Set the first country as selected if options are available
    if (options.length > 0) {
        dropdown.dropdown('set selected', options[0].value);
    }
}

/**
 * Fetch holidays for each country and cache the results for the current year and the next 3 years.
 * @param {Array} countries - Array of country names to fetch holidays for.
 */
async function fetchAndCacheHolidays(countries) {
    console.log('Fetching holidays for countries:', countries);
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];

    // Create an array of promises to fetch holidays for all countries and years
    const fetchHolidaysPromises = countries.flatMap(country => 
        years.map(async year => {
            try {
                console.log('Fetching holidays for:', country, 'Year:', year);
                const holidays = await fetchHolidays(country, year);
                if (!holidaysCache[country]) {
                    holidaysCache[country] = [];
                }
                holidaysCache[country].push(...holidays); // Append holidays to the cache
                console.log('Holidays fetched for:', country, year, holidays);
            } catch (error) {
                console.error(`Error fetching holidays for ${country} in ${year}:`, error);
            }
        })
    );

    // Wait for all promises to resolve
    await Promise.all(fetchHolidaysPromises);

    console.log('All holidays data fetched and cached');
    console.log('Holidays Cache:', holidaysCache);
}

/**
 * Retrieve holidays for a specific country from the cache.
 * @param {string} country - The country for which to retrieve holidays.
 * @returns {Array} - An array of holiday objects for the specified country.
 */
export function getHolidaysForCountry(country) {
    return holidaysCache[country] || [];
}
