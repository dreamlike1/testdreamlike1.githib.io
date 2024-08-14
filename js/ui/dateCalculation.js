// js/ui/dateCalculation.js
import { formatDate } from '../dateUtils/dateUtils.js';
import { calculateBusinessDays } from '../businessDayUtils/businessDayUtils.js';
import { getHolidaysForCountry } from './countryUtils.js';

// Helper function to adjust for India's 6-day work week
function calculateBusinessDaysWithHolidays(startDate, numDays, holidays) {
    let currentDate = new Date(startDate);
    let businessDaysCount = 0;

    // If past 5 pm is checked, move to the next day
    const past5pmCheckbox = document.getElementById('cbx-42')?.checked;
    if (past5pmCheckbox) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Ensure the start date is a valid business day
    while (currentDate.getDay() === 0 || holidays.includes(formatDate(currentDate))) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Start counting business days from the currentDate
    while (businessDaysCount < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();
        const formattedDate = formatDate(currentDate);

        // Check if it's a working day (Monday to Saturday) and not a holiday
        if (dayOfWeek !== 0 && !holidays.includes(formattedDate)) {
            businessDaysCount++;
        }
    }
    return currentDate;
}

// Function to calculate business days for other countries
function calculateForOtherCountries(startDate, numDays, holidays) {
    return calculateBusinessDays(startDate, numDays, holidays);
}

export async function calculateBusinessDate() {
    const startDateInput = document.getElementById('startDate').value;
    const dateRangeInput = document.getElementById('businessDays').value;
    const selectedCountry = document.getElementById('countrySelect').value;

    // Validate input
    if (!startDateInput || !dateRangeInput || !selectedCountry || isNaN(new Date(startDateInput).getTime())) {
        alert('Please enter a valid start date, range of business days, and select a country.');
        return;
    }

    // Parse input
    const startDate = new Date(startDateInput);
    const [numDaysStart, numDaysEnd] = dateRangeInput.includes('-') ?
        dateRangeInput.split('-').map(Number) :
        [Number(dateRangeInput), Number(dateRangeInput)];

    // Fetch holidays for the selected country
    const holidays = getHolidaysForCountry(selectedCountry).map(holiday => holiday.date);
    
    // Calculate business days
    const businessDateStart = calculateBusinessDaysWithHolidays(startDate, numDaysStart, holidays);
    const businessDateEnd = calculateForOtherCountries(startDate, numDaysEnd, holidays);

    // Format dates
    const formattedStart = formatDate(businessDateStart);
    const formattedEnd = formatDate(businessDateEnd);

    console.log(`Selected country: ${selectedCountry}`);
    console.log(`Start date: ${startDate}`);
    console.log(`Date range input: ${dateRangeInput}`);
    console.log(`Holidays (raw): ${JSON.stringify(holidays)}`);
    console.log(`Formatted holiday dates: ${holidays.join(', ')}`);
    console.log(`Business date range: ${formattedStart} to ${formattedEnd}`);
}
