// countryUtils.js
import { countryOptions } from './api/countryData.js';
import { fetchHolidays } from './api/holidays.js';

let holidays = [];

export async function populateCountries() {
    const countrySelect = document.getElementById('countrySelect');
    const selectedService = document.getElementById('serviceType').value;
    const countries = countryOptions[selectedService] || [];

    countrySelect.innerHTML = '<option value="">Select a country</option>'; // Add default option

    for (const country of countries) {
        holidays = await fetchHolidays(country, new Date().getFullYear());
    }

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

export function getHolidays() {
    return holidays;
}
