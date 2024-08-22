export function initializeDateSelector(holidays = []) {
    // Initialize main calendar
    $('.ui.calendar').calendar({
        type: 'date',
        text: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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
            message: holiday.name,
            class: 'holiday',
            variation: 'holiday'
        }))
    });

    // Handle MMDDYYYY input format for startDate
    $('#startDate input').on('change', function() {
        const inputValue = $(this).val();
        const regex = /^(\d{2})(\d{2})(\d{4})$/;
        const match = inputValue.match(regex);

        if (match) {
            const [_, month, day, year] = match;
            const date = new Date(`${year}-${month}-${day}`);
            if (!isNaN(date.getTime())) {
                $('.ui.calendar').calendar('set date', date);
            }
        }
    });

    // Initialize couponDate calendar
    $('#couponDate').calendar({
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
        }
    });

    // Handle MMDDYYYY input format for couponDate
    $('#couponDate input').on('change', function() {
        const inputValue = $(this).val();
        const regex = /^(\d{2})(\d{2})(\d{4})$/;
        const match = inputValue.match(regex);

        if (match) {
            const [_, month, day, year] = match;
            const date = new Date(`${year}-${month}-${day}`);
            if (!isNaN(date.getTime())) {
                $('#couponDate').calendar('set date', date);
            }
        }
    });
}
