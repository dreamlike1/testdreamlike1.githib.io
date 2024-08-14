import { formatDate } from '../dateUtils/dateUtils.js';
import { calculateBusinessDays } from '../businessDayUtils/businessDayUtils.js';
import { fetchHolidays } from '../api/holidays.js'; // Import fetchHolidays
import { countryCodeMapping } from '../api/countryData.js'; // Import countryCodeMapping

// Fetch holidays based on selected country and year
async function getHolidaysForCountry(country, year) {
    const countryCode = countryCodeMapping[country];
    if (!countryCode) {
        console.error(`Invalid country name: ${country}`);
        return [];
    }
    return await fetchHolidays(countryCode, year);
}

export async function calculateBusinessDate() {
    let startDate = new Date(document.getElementById('startDate').value);
    const dateRangeInput = document.getElementById('businessDays').value;
    const selectedCountry = document.getElementById('countrySelect').value;

    if (!dateRangeInput || !selectedCountry || isNaN(startDate.getTime())) {
        alert('Please enter a valid start date, range of business days, and select a country.');
        return;
    }

    let numDaysStart, numDaysEnd;

    // Handle different range formats
    if (dateRangeInput.includes('-')) {
        const ranges = dateRangeInput.split('-').map(Number);
        numDaysStart = ranges[0];
        numDaysEnd = ranges[1];
    } else if (dateRangeInput.includes(',')) {
        const ranges = dateRangeInput.split(',').map(Number);
        numDaysStart = ranges[0];
        numDaysEnd = ranges[1];
    } else {
        numDaysStart = numDaysEnd = Number(dateRangeInput);
    }

    // Fetch holidays for the selected country
    const holidays = await getHolidaysForCountry(selectedCountry, startDate.getFullYear());

    // Calculate the end dates considering holidays and weekends
    const endDateStart = await calculateBusinessDays(startDate, numDaysStart, selectedCountry);
    const endDateEnd = await calculateBusinessDays(startDate, numDaysEnd, selectedCountry);

    // Format and display results
    const formattedStart = formatDate(endDateStart);
    const formattedEnd = formatDate(endDateEnd);
    document.getElementById('result').value = `${formattedStart} and ${formattedEnd}`;
}
