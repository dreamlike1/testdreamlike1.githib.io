export function initializeDateSelector(holidays = []) {
    // Initialize the calendar for startDate with holidays
    initializeCalendar('#startDate', holidays);

    // Initialize the calendar for couponDate without holidays
    initializeCalendar('#couponDate', []);
}

function initializeCalendar(selector, holidays = []) {
    $(selector).calendar({
        type: 'date',
        text: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },
        onChange: function(date, text, mode) {
            if (date) {
                const formattedDate = date.toISOString().split('T')[0];
                $(selector + ' input').val(formattedDate); // Update input value
            } else {
                $(selector + ' input').val('');
            }
        },
        eventDates: holidays.map(holiday => ({
            date: new Date(holiday.date),
            message: holiday.name,
            class: 'holiday',
            variation: 'holiday'
        }))
    });

    // Handle MMDDYYYY input format
    $(selector + ' input').on('change', function() {
        const inputValue = $(this).val();
        const regex = /^(\d{2})(\d{2})(\d{4})$/;
        const match = inputValue.match(regex);

        if (match) {
            const [_, month, day, year] = match;
            const date = new Date(`${year}-${month}-${day}`);
            if (!isNaN(date.getTime())) {
                $(selector).calendar('set date', date);
            } else {
                $(selector).calendar('clear'); // Clear calendar if the date is invalid
            }
        } else {
            $(selector).calendar('clear'); // Clear calendar if input does not match format
        }
    });
}
