// js/ui/dateCalculation.js

import { formatDate } from '../dateUtils/dateUtils.js';
import { calculateBusinessDays } from '../businessDayUtils/businessDayUtils.js';
import { fetchHolidays } from '../api/holidays.js';  // Correct import

async function calculateBusinessDate() {
    const startDateInput = document.getElementById('startDate').value;
    const dateRangeInput = document.getElementById('businessDays').value;
    const selectedCountry = document.getElementById('countrySelect').value;

    if (!startDateInput || !dateRangeInput || !selectedCountry || isNaN(new Date(startDateInput).getTime())) {
        alert('Please enter a valid start date, range of business days, and select a country.');
        return;
    }

    const startDate = new Date(startDateInput);
    const [numDaysStart, numDaysEnd] = dateRangeInput.includes('-')
        ? dateRangeInput.split('-').map(Number)
        : [Number(dateRangeInput), Number(dateRangeInput)];

    // Get holidays for the selected country
    const holidays = await fetchHolidays(selectedCountry, startDate.getFullYear());
    console.log(`Selected country: ${selectedCountry}`);
    console.log(`Start date: ${startDate}`);
    console.log(`Date range input: ${dateRangeInput}`);
    console.log(`Holidays (raw): ${JSON.stringify(holidays)}`);

    const formattedHolidays = holidays.map(holiday => formatDate(new Date(holiday.date)));
    console.log(`Formatted holiday dates: ${formattedHolidays}`);

    let endDateStart, endDateEnd;

    if (selectedCountry === 'India') {
        console.log('Calculating business days for India');
        endDateStart = calculateIndianBusinessDays(startDate, numDaysStart, formattedHolidays);
        endDateEnd = calculateIndianBusinessDays(startDate, numDaysEnd, formattedHolidays);
    } else {
        endDateStart = calculateBusinessDays(startDate, numDaysStart, formattedHolidays);
        endDateEnd = calculateBusinessDays(startDate, numDaysEnd, formattedHolidays);
    }

    const formattedStart = formatDate(endDateStart);
    const formattedEnd = formatDate(endDateEnd);
    console.log(`Business date range: ${formattedStart} to ${formattedEnd}`);
    document.getElementById('result').value = `${formattedStart} and ${formattedEnd}`;
}
