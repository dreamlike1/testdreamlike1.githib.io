// calendar/calendar.js

export function initializeDateSelector() {
    // Initialize the Fomantic UI calendar as a date picker
    $('.ui.calendar').calendar({
        type: 'date',
        text: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        onChange: function(date, text, mode) {
            console.log('Selected date:', date); // Handle date change
        }
    });
}
