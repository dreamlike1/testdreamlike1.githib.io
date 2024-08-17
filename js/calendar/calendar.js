export function initializeDateSelector(holidays = []) {
    // Log the holidays data
    console.log('Holidays provided:', holidays);

    // Initialize the calendar
    console.log('Initializing calendar...');
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

    // Check calendar initialization
    setTimeout(() => {
        const calendarInstance = $('.ui.calendar').data('calendar');
        if (calendarInstance) {
            console.log('Calendar instance found.');
            // Log eventDates directly from the settings if accessible
            console.log('Event Dates:', calendarInstance.settings.eventDates);
        } else {
            console.error('Calendar instance not found.');
        }
    }, 1000); // Delay to ensure calendar is fully initialized
}
