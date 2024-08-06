// businessDayUtils.js
export function isNonBusinessDay(date, holidays) {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

    // Ensure holidays is an array before calling .some
    const isHoliday = Array.isArray(holidays) && holidays.some(holiday => {
        const holidayDate = new Date(holiday.date);
        return date.getTime() === holidayDate.getTime();
    });

    return isWeekend || isHoliday;
}

export function calculateBusinessDays(startDate, numDays, holidays) {
    let currentDate = new Date(startDate);
    let daysAdded = 0;
    const past5pmCheckbox = document.getElementById('cbx-42');
    
    // Adjust the end date based on the checkbox state
    if (past5pmCheckbox && past5pmCheckbox.checked) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    while (daysAdded < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);

        // Check if the current date is a non-business day
        if (!isNonBusinessDay(currentDate, holidays)) {
            daysAdded++;
        }
    }

    return currentDate;
}
