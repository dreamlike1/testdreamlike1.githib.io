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
        eventDates: holidays.map(holiday => ({
            date: new Date(holiday.date),
            message: `<span class="holiday-message ${holiday.class || ''}">${holiday.name}</span>`, // Use the holiday class for styling
            class: 'holiday', // You can use a default class for the cell
            variation: holiday.variation || 'holiday' // Tooltip variation
        }))
    });
}
