// dateCalculation.js
import { formatDate } from '../dateUtils/dateUtils.js';
import { calculateBusinessDays as calculateStandardBusinessDays } from '../businessDayUtils/businessDayUtils.js'; // Ensure this import is correct
import { getHolidaysForCountry } from './countryUtils.js';
import { isHoliday } from '../api/holidays.js'; // Import the necessary function

// Helper function to adjust for India's 6-day work week
function calculateIndianBusinessDays(startDate, numDays, holidays, past5pm) {
    let currentDate = new Date(startDate);
    let businessDaysCount = 0;

    // Adjust the start date if past 5 PM checkbox is checked
    if (past5pm) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    while (businessDaysCount < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();
        const formattedDate = formatDate(currentDate);

        // Log current date and its status for debugging
        console.log(`Checking date: ${formattedDate}, Day of week: ${dayOfWeek}`);

        // Check if it's a working day (Monday to Saturday) and not a holiday
        if (dayOfWeek !== 0 && !holidays.includes(formattedDate)) {
            businessDaysCount++;
        }
    }
    return currentDate;
}

// Function to calculate business days for other countries
function calculateForOtherCountries(startDate, numDays, holidays, past5pm) {
    let currentDate = new Date(startDate);
    
    // Adjust the start date if past 5 PM checkbox is checked
    if (past5pm) {
        currentDate.setHours(17); // Set to 5 PM for more accurate adjustment
    }

    let daysAdded = 0;

    while (daysAdded < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);
        
        // Check if the current date is a non-business day
        if (!isNonBusinessDay(currentDate, holidays)) {
            daysAdded++;
        }
    }

    return currentDate;
}

// Function to determine if a date is a non-business day
function isNonBusinessDay(date, holidays) {
    const dayOfWeek = date.getDay();
    const formattedDate = formatDate(date);

    // Check if it's a weekend or a holiday
    return dayOfWeek === 0 || holidays.includes(formattedDate) || isHoliday(formattedDate);
}

export async function calculateBusinessDate() {
    const startDateInput = document.getElementById('startDate').value;
    const dateRangeInput = document.getElementById('businessDays').value;
    const selectedCountry = document.getElementById('countrySelect').value;
    const past5pmCheckbox = document.getElementById('cbx-42').checked; // Get the checkbox state

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

    // Get holidays for the selected country
    const holidays = getHolidaysForCountry(selectedCountry);
    console.log(`Selected country: ${selectedCountry}`);
    console.log(`Start date: ${startDate}`);
    console.log(`Date range input: ${dateRangeInput}`);
    console.log(`Holidays: ${holidays}`);
    console.log(`Past 5 PM Checkbox: ${past5pmCheckbox}`);

    let endDateStart, endDateEnd;

    if (selectedCountry === 'India') {
        console.log('Calculating business days for India');
        endDateStart = calculateIndianBusinessDays(startDate, numDaysStart, holidays, past5pmCheckbox);
        endDateEnd = calculateIndianBusinessDays(startDate, numDaysEnd, holidays, past5pmCheckbox);
    } else {
        if (typeof calculateStandardBusinessDays === 'undefined') {
            console.error('calculateBusinessDays is not defined. Ensure it is imported correctly.');
            return;
        }
        endDateStart = calculateForOtherCountries(startDate, numDaysStart, holidays, past5pmCheckbox);
        endDateEnd = calculateForOtherCountries(startDate, numDaysEnd, holidays, past5pmCheckbox);
    }

    // Format and display results
    const formattedStart = formatDate(endDateStart);
    const formattedEnd = formatDate(endDateEnd);
    document.getElementById('result').value = `Between ${formattedStart} and ${formattedEnd}`;
}
