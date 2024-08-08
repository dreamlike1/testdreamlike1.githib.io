// dateUtils.js

// Import only the necessary functions from 'holidays.js'
import { isHoliday } from './api/holidays.js';

// Function to format a date as a readable string
export function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Function to check if a date is a weekend or holiday
function isNonBusinessDay(date, holidays) {
    const day = date.getDay();
    return day === 0 || day === 6 || holidays.includes(formatDate(date));
}

// Function to calculate the end date after adding a number of business days
export function calculateBusinessDays(startDate, numDays, holidays) {
    let currentDate = new Date(startDate);
    let daysAdded = 0;
    const past5pmCheckbox = document.getElementById('cbx-42');

    // Adjust the end date based on the checkbox state
    if (past5pmCheckbox.checked) {
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

// Function to initialize the calendar inputs
export function initializeCalendars() {
    $('.ui.calendar').calendar({
        type: 'date',
        endCalendar: null,
        text: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
    });
}

// Function to set up the calculator functionality
export function setupCalculator() {
    document.getElementById('calculateButton').addEventListener('click', () => {
        const startDate = new Date($('#startDate input').val());
        const numDays = parseInt(document.getElementById('businessDays').value.split(',')[0], 10);
        const serviceType = document.getElementById('serviceType').value;
        const holidays = []; // Fetch or define holidays based on serviceType

        // Call calculateBusinessDays and set the result
        const endDate = calculateBusinessDays(startDate, numDays, holidays);
        document.getElementById('result').value = formatDate(endDate);
    });

    document.getElementById('couponCalculateButton').addEventListener('click', () => {
        const couponDate = new Date($('#couponDate input').val());
        const addDays = parseInt(document.getElementById('addDays').value, 10);
        const removeExtraDay = document.getElementById('cbx-43').checked;

        // Calculate expiry date
        let expiryDate = new Date(couponDate);
        expiryDate.setDate(expiryDate.getDate() + addDays);
        if (removeExtraDay) {
            expiryDate.setDate(expiryDate.getDate() - 1);
        }
        document.getElementById('couponResult').value = formatDate(expiryDate);
    });
}
