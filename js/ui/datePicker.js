export function initializeCalendars() {
    $(document).ready(function() {
        $('.ui.calendar').calendar({
            type: 'date',
            endCalendar: null,
            text: {
                days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            }
        });
    });
}
