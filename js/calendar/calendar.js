export function initializeDateSelector(holidays = []) {
    // Define a color for the messages that matches the date color
    const messageColor = '#FF5733'; // Example color, adjust as needed

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
        // Highlight holidays with a consistent color for the message
        eventDates: holidays.map(holiday => ({
            date: new Date(holiday.date),
            message: `<span style="color: ${messageColor};">${holiday.name}</span>`,
            class: 'holiday',
            variation: 'holiday'
        }))
    });
}
