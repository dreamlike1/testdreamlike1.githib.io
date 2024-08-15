// js/ui/dateCalculation.js
import { formatDate } from '../dateUtils/dateUtils.js';
import { calculateBusinessDays } from '../businessDayUtils/businessDayUtils.js';
import { getHolidaysForCountry } from './countryUtils.js';

export async function calculateBusinessDate() {
    let startDateInput = document.getElementById('startDate').value;
    const dateRangeInput = document.getElementById('businessDays').value;
    const selectedCountry = document.getElementById('countrySelect').value;

    // Validate start date
    let startDate = new Date(startDateInput);
    if (!startDateInput || isNaN(startDate.getTime())) {
        alert('Please enter a valid start date.');
        return;
    }

    // Validate country and range input
    if (!dateRangeInput || !selectedCountry) {
        alert('Please enter a valid range of business days and select a country.');
        return;
    }

    // Fetch holidays for the selected country
    const holidays = await getHolidaysForCountry(selectedCountry);
    
    // Check if holidays were successfully fetched
    if (!Array.isArray(holidays)) {
        console.error('No holidays data found or error fetching holidays.');
        return;
    }

    // Parse the date range input
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

    try {
        // Calculate the end dates considering holidays and weekends
        const endDateStart = calculateBusinessDays(startDate, numDaysStart, holidays);
        const endDateEnd = calculateBusinessDays(startDate, numDaysEnd, holidays);

        // Format and display results
        const formattedStart = formatDate(endDateStart);
        const formattedEnd = formatDate(endDateEnd);
        document.getElementById('result').value = `${formattedStart} and ${formattedEnd}`;
    } catch (error) {
        console.error('Error calculating business dates:', error);
        alert('Error calculating business dates. Please check the input and try again.');
    }
}
