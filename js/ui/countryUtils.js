//js/ui/countryUtils.js
import { countryOptions, countryCodeMapping } from '../api/countryData.js';
import { fetchHolidays } from '../api/holidays.js';

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

    // Fetch and cache holidays
    await fetchAndCacheHolidays(countries);
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
