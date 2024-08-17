export function initializeDateSelector(holidays = []) {
    // Log the input holidays array
    console.log('Holidays provided:', holidays);

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
        eventDates: holidays.map(holiday => {
            const holidayDate = new Date(holiday.date);
            console.log('Processing holiday:', holiday.name, 'Date:', holidayDate);
            return {
                date: holidayDate,
                message: holiday.name,
                class: 'holiday', // Use a CSS class for styling
                variation: 'holiday' // Tooltip variation
            };
        })
    });

    // Log the processed eventDates for verification
    console.log('Processed eventDates:', $('.ui.calendar').data('calendar').settings.eventDates);
}
