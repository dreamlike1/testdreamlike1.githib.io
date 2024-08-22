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
            // Update the input field only if the calendar was interacted with
            if ($input.is(':focus')) {
                const formattedDate = date.toISOString().split('T')[0];
                $input.val(formattedDate);
            }
        },
        eventDates: holidays.map(holiday => ({
            date: new Date(holiday.date),
            message: holiday.name,
            class: 'holiday',
            variation: 'holiday'
        }))
    });

    // Handle input changes manually
    $input.on('input', function() {
        // Allow manual input and update the calendar if necessary
        const inputValue = $input.val();
        const parsedDate = parseDate(inputValue);

        if (parsedDate) {
            $calendar.calendar('set date', parsedDate);
        }
    });

    $input.on('blur', function() {
        // Validate the date when input loses focus
        const inputValue = $input.val();
        const parsedDate = parseDate(inputValue);

        if (!parsedDate) {
            // Clear the calendar date if input is invalid
            $calendar.calendar('clear');
        }
    });

    function parseDate(dateStr) {
        // MMDDYYYY format parsing
        const match = dateStr.match(/^(\d{2})(\d{2})(\d{4})$/);

        if (match) {
            const [, month, day, year] = match;
            const date = new Date(`${year}-${month}-${day}`);
            // Validate the date
            if (date.getMonth() + 1 === parseInt(month, 10) &&
                date.getDate() === parseInt(day, 10) &&
                date.getFullYear() === parseInt(year, 10)) {
                return date;
            }
        }

        return null;
    }
}
