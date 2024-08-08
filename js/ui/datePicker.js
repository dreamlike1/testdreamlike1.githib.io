let startDateCalendar = null;
let couponDateCalendar = null;

export function initializeCalendars() {
    $(document).ready(function() {
        startDateCalendar = $('#startDate').calendar({
            type: 'date',
            endCalendar: null,
            text: {
                days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            }
        });

        couponDateCalendar = $('#couponDate').calendar({
            type: 'date',
            endCalendar: null,
            text: {
                days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            }
        });
    });
}

export { startDateCalendar, couponDateCalendar };
