import { fetchHolidays } from '../api/holidays.js';
import { listNoHolidayCountries } from '../api/holidays.js'; // Make sure this import is correct
import { countryOptions } from '../api/countryData.js';

let holidaysCache = {};  // Cache to store holidays data for all countries

/**
 * Populate the country dropdown with options based on the selected service type.
 * @param {string} serviceType - The service type to filter countries.
 */
export async function populateCountries(serviceType = 'expressPaid') {
    const countrySelectDropdown = $('#countrySelect');
    const countries = countryOptions[serviceType] || [];
    
    // Prepare dropdown options
    const options = countries.map(country => ({
        text: country,
        value: country
    }));

    // Reinitialize dropdown
    await initializeDropdown(countrySelectDropdown, options);

    // Clear previous holidays data
    holidaysCache = {};

    // Fetch and cache holidays
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
 * Fetch holidays for each country and cache the results.
 * @param {Array} countries - Array of country names to fetch holidays for.
 * @param {number} [year] - Optional year to fetch holidays for. Defaults to current year.
 */
async function fetchAndCacheHolidays(countries, year = new Date().getFullYear()) {
    console.log('Fetching holidays for countries:', countries, 'Year:', year);

    // Create an array of promises to fetch holidays for all countries
    const fetchHolidaysPromises = countries.map(async country => {
        try {
            console.log('Fetching holidays for:', country, 'Year:', year);
            const holidays = await fetchHolidays(country, year);
            holidaysCache[`${country}_${year}`] = holidays; // Cache with year-specific key
            console.log('Holidays fetched for:', country, 'Year:', year, holidays);
        } catch (error) {
            console.error(`Error fetching holidays for ${country} in year ${year}:`, error);
        }
    });

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

/**
 * Extract year from a date string.
 * @param {string} dateStr - The date string in YYYY-MM-DD format.
 * @returns {number} - The extracted year.
 */
function extractYearFromDate(dateStr) {
    return new Date(dateStr).getFullYear();
}

// Example of using the date picker
$('#startDate').on('change', async function() {
    const selectedDate = $(this).val();
    const year = extractYearFromDate(selectedDate);

    console.log('Selected year:', year);
    // Ensure countries are populated first
    await populateCountries();
    // Fetch holidays for the selected year
    await fetchAndCacheHolidays(Object.keys(countryOptions['expressPaid']), year);
});
