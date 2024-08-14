import { formatDate } from '../dateUtils/dateUtils.js';
import { calculateBusinessDays } from '../businessDayUtils/businessDayUtils.js';
import { getHolidaysForCountry } from './countryUtils.js';

// Helper function to calculate business days considering India's 6-day work week
function calculateIndianBusinessDays(startDate, numDays, holidays) {
    let currentDate = new Date(startDate);
    let businessDaysCount = 0;
    const past5pmCheckbox = document.getElementById('cbx-42')?.checked;

    // If past 5 pm is checked, move to the next day
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

// Function to calculate business days for countries other than India
function calculateForOtherCountries(startDate, numDays, holidays) {
    return utilsCalculateBusinessDays(startDate, numDays, holidays);
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
    const [numDaysStart, numDaysEnd] = dateRangeInput.includes('-')
        ? dateRangeInput.split('-').map(Number)
        : dateRangeInput.includes(',')
            ? dateRangeInput.split(',').map(Number)
            : [Number(dateRangeInput), Number(dateRangeInput)];

    // Fetch holidays for the selected country
    const holidays = await getHolidaysForCountry(selectedCountry);
    
    // Handle case where no holidays are returned
    if (!holidays || holidays.length === 0) {
        console.warn(`No holidays found for ${selectedCountry}`);
    }

    let endDateStart, endDateEnd;

    if (selectedCountry === 'India') {
        endDateStart = calculateIndianBusinessDays(startDate, numDaysStart, holidays);
        endDateEnd = calculateIndianBusinessDays(startDate, numDaysEnd, holidays);
    } else {
        endDateStart = calculateForOtherCountries(startDate, numDaysStart, holidays);
        endDateEnd = calculateForOtherCountries(startDate, numDaysEnd, holidays);
    }

    // Format and display results
    const formattedStart = formatDate(endDateStart);
    const formattedEnd = formatDate(endDateEnd);
    document.getElementById('result').value = `${formattedStart} and ${formattedEnd}`;
}
