import { countryOptions } from '../api/countryData.js'; // Adjust the path as needed
import { fetchHolidays } from '../api/holidays.js';

let holidaysCache = {};  // Cache to store holidays data for all countries

export async function populateCountries(serviceType = 'expressPaid') {
    const countrySelectDropdown = $('#countrySelect'); // Ensure correct ID is used here
    const countries = countryOptions[serviceType] || [];

    // Prepare options for Semantic UI dropdown
    const options = countries.map(country => ({
        text: country,
        value: country
    }));

    console.log('Dropdown Options:', options); // Debugging line

    // Clear existing options and add new ones
    countrySelectDropdown.empty(); // Ensure dropdown is cleared
    countrySelectDropdown.append('<option value="" disabled selected>Select Country</option>'); // Reset the default option

    // Reinitialize the dropdown
    countrySelectDropdown.dropdown('destroy'); // Destroy any existing dropdown instance
    countrySelectDropdown.append(options.map(option => `<option value="${option.value}">${option.text}</option>`).join(''));

    // Initialize Semantic UI dropdown
    countrySelectDropdown.dropdown(); // Reinitialize dropdown

    // Set the first country as selected if options are available
    if (options.length > 0) {
        countrySelectDropdown.dropdown('set selected', options[0].value);
    }

    // Close the dropdown when an option is selected
    countrySelectDropdown.on('change', function() {
        $(this).dropd
