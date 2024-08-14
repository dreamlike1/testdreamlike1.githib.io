// js/ui/dateCalculation.js

import { formatDate } from '../dateUtils/dateUtils.js';
import { calculateBusinessDays } from '../businessDayUtils/businessDayUtils.js';
import { fetchHolidays } from '../api/holidays.js';

// Helper function to adjust for India's 6-day work week
function calculateIndianBusinessDays(startDate, numDays, holidays) {
    let currentDate = new Date(startDate);
    let businessDaysCount = 0;
    const past5pmCheckbox = document.getElementById('cbx-42')?.checked;

    console.log(`Initial date: ${formatDate(currentDate)}, Holidays: ${holidays}`);

    // If past 5 pm is checked, move to the next day
    if (past5pmCheckbox) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Ensure the start date is a valid business day
    while (currentDate.getDay() === 0 || holidays.includes(formatDate(currentDate))) {
        console.log(`Skipping start date ${formatDate(currentDate)} because it's either a holiday or Sunday.`);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`Adjusted start date: ${formatDate(currentDate)}`);

    // Start counting business days from the currentDate
    while (businessDaysCount < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();
        const formattedDate = formatDate(currentDate);

        console.log(`Checking date: ${formattedDate}, Day of week: ${dayOfWeek}`);

        // Check if it's a working day (Monday to Saturday) and not a holiday
        if (dayOfWeek !== 0 && !holidays.includes(formattedDate)) {
            businessDaysCount++;
            console.log(`Added ${formattedDate} as business day. Total business days counted: ${businessDaysCount}`);
        } else {
            console.log(`${formattedDate} is either a Sunday or a holiday. Skipping.`);
        }
    }
    console.log(`Final date after counting business days: ${formatDate(currentDate)}`);
    return currentDate;
}

// Function to calculate business days for other countries
function calculateForOtherCountries(startDate, numDays, holidays) {
    return calculateBusinessDays(startDate, numDays, holidays);
}

// Main function to calculate business date
export async function calculateBusinessDate() {
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
        endDateStart = calculateForOtherCountries(startDate, numDaysStart, formattedHolidays);
        endDateEnd = calculateForOtherCountries(startDate, numDaysEnd, formattedHolidays);
    }

    const formattedStart = formatDate(endDateStart);
    const formattedEnd = formatDate(endDateEnd);
    console.log(`Business date range: ${formattedStart} to ${formattedEnd}`);
    document.getElementById('result').value = `${formattedStart} and ${formattedEnd}`;
}
