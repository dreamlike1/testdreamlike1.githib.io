// dateCalculation.js
import { formatDate } from '../dateUtils/dateUtils.js';
import { calculateBusinessDays } from '../businessDayUtils/businessDayUtils.js'; // Ensure this import is correct
import { getHolidaysForCountry } from './countryUtils.js';

// Helper function to adjust for India's 6-day work week
function adjustForIndianWorkWeek(startDate, numDays, holidays) {
    let currentDate = new Date(startDate);
    let businessDaysCount = 0;

    while (businessDaysCount < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();
        const formattedDate = formatDate(currentDate);

        // Check if it's a working day (Monday to Saturday) and not a holiday
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(formattedDate)) {
            businessDaysCount++;
        }
    }
    return currentDate;
}

export async function calculateBusinessDate() {
    let startDate = new Date(document.getElementById('startDate').value);
    const dateRangeInput = document.getElementById('businessDays').value;
    const selectedCountry = document.getElementById('countrySelect').value;

    if (!dateRangeInput || !selectedCountry || isNaN(startDate.getTime())) {
        alert('Please enter a valid start date, range of business days, and select a country.');
        return;
    }

    // Log the selected country for debugging purposes
    console.log(`Selected country: ${selectedCountry}`);

    let numDaysStart, numDaysEnd;

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

    const holidays = getHolidaysForCountry(selectedCountry); // Ensure this function uses the selectedCountry parameter
    let endDateStart, endDateEnd;

    if (selectedCountry === 'India') {
        console.log('Calculating business days for India');
        endDateStart = adjustForIndianWorkWeek(startDate, numDaysStart, holidays);
        endDateEnd = adjustForIndianWorkWeek(startDate, numDaysEnd, holidays);
    } else {
        if (typeof calculateBusinessDays === 'undefined') {
            console.error('calculateBusinessDays is not defined. Ensure it is imported correctly.');
            return;
        }
        endDateStart = calculateBusinessDays(startDate, numDaysStart, holidays);
        endDateEnd = calculateBusinessDays(startDate, numDaysEnd, holidays);
    }

    const formattedStart = formatDate(endDateStart);
    const formattedEnd = formatDate(endDateEnd);
    document.getElementById('result').value = `Between ${formattedStart} and ${formattedEnd}`;
}
