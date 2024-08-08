// dateCalculation.js
import { formatDate } from '../dateUtils/dateUtils.js';
import { calculateBusinessDays } from '../businessDayUtils/businessDayUtils.js';
import { getHolidaysForCountry } from './countryUtils.js';

// Helper function to adjust for India's 6-day work week
function adjustForIndianWorkWeek(startDate, numDays, holidays) {
    // Create a copy of the start date to avoid modifying the original
    let currentDate = new Date(startDate);
    let businessDaysCount = 0;

    while (businessDaysCount < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();
        // Assuming the Indian work week is Monday to Saturday (0-based index: 0=Sunday, 1=Monday, ..., 6=Saturday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(formatDate(currentDate))) {
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
        endDateStart = adjustForIndianWorkWeek(startDate, numDaysStart, holidays);
        endDateEnd = adjustForIndianWorkWeek(startDate, numDaysEnd, holidays);
    } else {
        endDateStart = calculateBusinessDays(startDate, numDaysStart, holidays);
        endDateEnd = calculateBusinessDays(startDate, numDaysEnd, holidays);
    }

    const formattedStart = formatDate(endDateStart);
    const formattedEnd = formatDate(endDateEnd);
    document.getElementById('result').value = `${formattedStart} and ${formattedEnd}`;
}
