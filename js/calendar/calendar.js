// Initialize the date selector with the calendar widget
export function initializeDateSelector(holidays = []) {
    $('.ui.calendar').calendar({
        type: 'date',
        text: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        onChange: function(date) {
            if (date) {
                // Update the input field when a date is selected from the calendar
                document.getElementById('startDate').value = date.toISOString().split('T')[0];
            }
        },
        eventDates: holidays.map(holiday => ({
            date: new Date(holiday.date),
            message: holiday.name,
            class: 'holiday',
            variation: 'holiday'
        }))
    });
}

// Handle manual input in MMDDYYYY format
document.getElementById('startDate').addEventListener('input', function(event) {
    const inputValue = event.target.value;

    // Regex to check if input is in MMDDYYYY format
    const datePattern = /^(0[1-9]|1[0-2])([0-2][0-9]|3[0-1])\d{4}$/;

    if (datePattern.test(inputValue)) {
        // Extract month, day, and year
        const month = inputValue.substring(0, 2);
        const day = inputValue.substring(2, 4);
        const year = inputValue.substring(4, 8);
        
        // Create a date object
        const date = new Date(`${year}-${month}-${day}`);

        // Check if date is valid
        if (date && !isNaN(date.getTime())) {
            // Sync calendar widget with manual input
            $('.ui.calendar').calendar('set date', date);
        } else {
            // Handle invalid date
            console.error('Invalid date input');
        }
    } else {
        // Clear calendar date if input is invalid
        $('.ui.calendar').calendar('clear');
    }
});

// Ensure calendar input field is typeable
$('.ui.calendar').calendar({
    onChange: function(date) {
        if (date) {
            document.getElementById('startDate').value = date.toISOString().split('T')[0];
        }
    }
});
