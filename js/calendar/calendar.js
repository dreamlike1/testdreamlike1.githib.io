import { getHolidaysForCountry } from '../ui/countryUtils.js'; // Adjust the path as needed

/**
 * Initializes the Fomantic UI Calendar as a date selector
 */
export function initializeDateSelector() {
    $('.ui.calendar').calendar({
        type: 'date',
        text: {
            // Custom text for days and months (optional customization)
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        onChange: function(date, text, mode) {
            // Callback function executed when a date is selected or changed
            if (date) {
                // Convert the selected date to yyyy-mm-dd format
                const formattedDate = date.toISOString().split('T')[0];
                // Set the value of the native date input field
                document.getElementById('startDate').value = formattedDate;
            } else {
                // If no date is selected, clear the native date input field
                document.getElementById('startDate').value = '';
            }
        }
    });
}

/**
 * Updates the calendar with highlighted holidays
 * @param {Array} holidays - Array of holiday objects
 */
export function updateCalendarWithHolidays(holidays) {
    // Remove existing highlights
    $('.ui.calendar').calendar('removeEvents'); // Clear existing events

    // Prepare event data for calendar
    const eventDates = holidays.map(holiday => ({
        date: new Date(holiday.date),
        message: `Holiday: ${holiday.name}`,
        class: 'holiday-highlight', // Apply a custom CSS class
        variation: 'blue' // Optional tooltip variation
    }));

    // Update calendar with new event data
    $('.ui.calendar').calendar('set', {
        eventDates: eventDates
    });
}

// Optional: Define CSS class for holiday highlighting
const style = document.createElement('style');
style.innerHTML = `
    .holiday-highlight {
        background-color: #ff9999 !important; /* Light red for holiday */
    }
`;
document.head.appendChild(style);
