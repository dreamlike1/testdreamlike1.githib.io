export function initializeDateSelector(startDateHolidays = [], couponDateHolidays = []) {
    // Initialize startDate calendar with its specific event dates
    $('#startDate .ui.calendar').calendar({
        type: 'date',
        text: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        onChange: function(date, text, mode) {
            if (date) {
                const formattedDate = date.toISOString().split('T')[0];
                $('#startDate input').val(formattedDate);
            } else {
                $('#startDate input').val('');
            }
        },
        eventDates: startDateHolidays.map(holiday => ({
            date: new Date(holiday.date),
            message: holiday.name,
            class: 'holiday',
            variation: 'holiday'
        }))
    });

    // Initialize couponDate calendar with its specific event dates
    $('#couponDate .ui.calendar').calendar({
        type: 'date',
        text: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        onChange: function(date, text, mode) {
            if (date) {
                const formattedDate = date.toISOString().split('T')[0];
                $('#couponDate input').val(formattedDate);
            } else {
                $('#couponDate input').val('');
            }
        },
        eventDates: couponDateHolidays.map(holiday => ({
            date: new Date(holiday.date),
            message: holiday.name,
            class: 'holiday',
            variation: 'holiday'
        }))
    });

    // Handle MMDDYYYY input format for both date pickers
    $('input').on('change', function() {
        const inputValue = $(this).val();
        const regex = /^(\d{2})(\d{2})(\d{4})$/;
        const match = inputValue.match(regex);

        if (match) {
            const [_, month, day, year] = match;
            const date = new Date(`${year}-${month}-${day}`);
            if (!isNaN(date.getTime())) {
                $(this).closest('.ui.calendar').calendar('set date', date);
            }
        }
    });
}
