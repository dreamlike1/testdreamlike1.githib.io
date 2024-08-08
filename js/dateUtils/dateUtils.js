import { isHoliday } from '../api/holidays.js';

// Function to format a date as a readable string
export function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Function to check if a date is a non-business day
function isNonBusinessDay(date, holidays) {
    const dayOfWeek = date.getDay();
    const formattedDate = formatDate(date);
    return dayOfWeek === 0 || holidays.includes(formattedDate);
}

// Function to calculate the end date after adding a number of business days
export function calculateBusinessDays(startDate, numDays, holidays) {
    let currentDate = new Date(startDate);
    let daysAdded = 0;
    const past5pmCheckbox = document.getElementById('cbx-42')?.checked;

    // Adjust the start date based on the checkbox state
    if (past5pmCheckbox) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    while (daysAdded < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);

        // Check if the current date is a non-business day
        if (!isNonBusinessDay(currentDate, holidays)) {
            daysAdded++;
        }
    }

    return currentDate;
}
