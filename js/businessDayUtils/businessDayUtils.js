import { fetchHolidays } from '../api/holidays.js'; // Import the fetchHolidays function
import { countryCodeMapping } from '../api/countryData.js'; // Import countryCodeMapping

// Check if a date is a non-business day
export async function isNonBusinessDay(date, holidays) {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

    // Ensure holidays is an array before calling .some
    const isHoliday = Array.isArray(holidays) && holidays.some(holiday => {
        const holidayDate = new Date(holiday.date);
        return date.getTime() === holidayDate.getTime();
    });

    return isWeekend || isHoliday;
}

// Calculate business days including holidays
export async function calculateBusinessDays(startDate, numDays, country) {
    let currentDate = new Date(startDate);
    let daysAdded = 0;
    const past5pmCheckbox = document.getElementById('cbx-42')?.checked;

    // If past 5 pm is checked, move to the next day
    if (past5pmCheckbox) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Get the country code
    const countryCode = countryCodeMapping[country];
    if (!countryCode) {
        console.error(`Invalid country name: ${country}`);
        return null; // Or handle this case as needed
    }

    // Fetch holidays for the current year
    const year = currentDate.getFullYear();
    const holidays = await fetchHolidays(countryCode, year);

    // Ensure the start date is a valid business day
    while (currentDate.getDay() === 0 || await isNonBusinessDay(currentDate, holidays)) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Start counting business days from the currentDate
    while (daysAdded < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);

        // Check if the current date is a non-business day
        if (!await isNonBusinessDay(currentDate, holidays)) {
            daysAdded++;
        }
    }

    return currentDate;
}
