import { formatDate } from '../dateUtils/dateUtils.js';
import { calculateBusinessDays as utilsCalculateBusinessDays } from '../businessDayUtils/businessDayUtils.js';
import { getHolidaysForCountry } from './countryUtils.js';

// Helper function to handle fetching and logging of holidays
async function fetchHolidays(selectedCountry) {
    try {
        const holidays = await getHolidaysForCountry(selectedCountry);
        if (!holidays || holidays.length === 0) {
            console.warn(`No holidays found for ${selectedCountry}`);
            return [];
        }
        return holidays;
    } catch (error) {
        console.error(`Error fetching holidays for ${selectedCountry}:`, error);
        return [];
    }
}

// Unified function to calculate business days considering holidays
function calculateBusinessDays(startDate, numDays, holidays, isIndian) {
    let currentDate = new Date(startDate);
    let businessDaysCount = 0;
    const isPast5pmChecked = document.getElementById('cbx-42')?.checked;

    if (isPast5pmChecked) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Skip to the next business day if the start date is a weekend or holiday
    while ((isIndian ? currentDate.getDay() === 0 : false) || holidays.includes(formatDate(currentDate))) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    while (businessDaysCount < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);
        const dayOfWeek = currentDate.getDay();
        const formattedDate = formatDate(currentDate);

        // For India, consider Monday to Saturday as work days
        if (isIndian ? dayOfWeek !== 0 && dayOfWeek !== 7 : dayOfWeek !== 0) {
            if (!holidays.includes(formattedDate)) {
                businessDaysCount++;
            }
        }
    }

    return currentDate;
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

    // Fetch holidays
    const holidays = await fetchHolidays(selectedCountry);

    let endDateStart, endDateEnd;

    if (selectedCountry === 'India') {
        endDateStart = calculateBusinessDays(startDate, numDaysStart, holidays, true);
        endDateEnd = calculateBusinessDays(startDate, numDaysEnd, holidays, true);
    } else {
        endDateStart = calculateBusinessDays(startDate, numDaysStart, holidays, false);
        endDateEnd = calculateBusinessDays(startDate, numDaysEnd, holidays, false);
    }

    // Format and display results
    const formattedStart = formatDate(endDateStart);
    const formattedEnd = formatDate(endDateEnd);
    document.getElementById('result').value = `${formattedStart} and ${formattedEnd}`;
}
