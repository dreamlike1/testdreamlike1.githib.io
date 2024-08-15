export function initializeDateSelector() {
    // Inject CSS for weekend highlighting
    const style = document.createElement('style');
    style.innerHTML = `
        .highlight-weekend {
            background-color: lightblue !important;
            color: #000; /* Ensure text is visible on the blue background */
        }
    `;
    document.head.appendChild(style);

    // Initialize the calendar with type 'date'
    $('.ui.calendar').calendar({
        type: 'date',
        text: {
            // Custom text for days and months (optional customization)
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        onChange: function(date, text, mode) {
            // Callback function executed when a date is selected or changed
            if (date) {
                // Convert the selected date to yyyy-mm-dd format
                const formattedDate = date.toISOString().split('T')[0];
                // Set the value of the native date input field
                document.getElementById('startDate').value = formattedDate;
            } else {
                // If no date is selected, clear the native date input field
                document.getElementById('startDate').value = '';
            }
        },
        onShow: function() {
            // Highlight weekends when calendar is shown
            // Use a slight delay to ensure the calendar is rendered before manipulating it
            setTimeout(() => {
                $('.ui.calendar .day').each(function() {
                    const dayOfWeek = $(this).data('day');
                    if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 = Sunday, 6 = Saturday
                        $(this).addClass('highlight-weekend');
                    }
                });
            }, 0);
        }
    });
}
