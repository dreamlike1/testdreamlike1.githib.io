export function initializeDateSelector(holidays = []) {
    // Initialize the calendar with type 'date'
    $('.ui.calendar').calendar({
        type: 'date',
        text: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        onChange: function(date, text, mode) {
            if (date) {
                const formattedDate = date.toISOString().split('T')[0];
                document.getElementById('startDate').value = formattedDate;
            } else {
                document.getElementById('startDate').value = '';
            }
        },
        // Highlight holidays
        eventDates: holidays.map(holiday => ({
            date: new Date(holiday.date),
            message: holiday.name,
            class: 'holiday', // Use a CSS class for styling
            variation: 'holiday' // Tooltip variation (if supported)
        }))
    });
}

// Example testing data
document.addEventListener('DOMContentLoaded', () => {
    // Example holidays for testing
    const testHolidays = [
        { date: '2025-01-01', name: 'New Year\'s Day' },
        { date: '2025-12-25', name: 'Christmas Day' }
    ];

    // Initialize date selector with test holidays
    initializeDateSelector(testHolidays);
});
