export function initializeDateSelector(holidays = []) {
    const $calendar = $('.ui.calendar');
    const $input = $('#startDate');

    // Initialize the calendar
    $calendar.calendar({
        type: 'date',
        text: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        onChange: function(date, text, mode) {
            if (date) {
                const formattedDate = date.toISOString().split('T')[0];
                $input.val(formattedDate);
            } else {
                $input.val('');
            }
        },
        eventDates: holidays.map(holiday => ({
            date: new Date(holiday.date),
            message: holiday.name,
            class: 'holiday',
            variation: 'holiday'
        }))
    });

    // Handle input changes
    $input.on('input', function() {
        const inputValue = $input.val();
        const parsedDate = parseDate(inputValue);

        if (parsedDate) {
            $calendar.calendar('set date', parsedDate);
        }
    });

    function parseDate(dateStr) {
        // MMDDYYYY format parsing
        const match = dateStr.match(/^(\d{2})(\d{2})(\d{4})$/);

        if (match) {
            const [, month, day, year] = match;
            const date = new Date(`${year}-${month}-${day}`);
            // Validate date
            if (date.getMonth() + 1 === parseInt(month, 10) &&
                date.getDate() === parseInt(day, 10) &&
                date.getFullYear() === parseInt(year, 10)) {
                return date;
            }
        }

        return null;
    }
}
