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
    const past5pmCheckbox = document.getElementById('cbx-42')?.checked;

    // If past 5 pm is checked, move to the next day
    if (past5pmCheckbox) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Ensure the start date is a valid business day
    while (currentDate.getDay() === 0 || isNonBusinessDay(currentDate, holidays)) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Start counting business days from the currentDate
    while (daysAdded < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);

        // Check if the current date is a non-business day
        if (!isNonBusinessDay(currentDate, holidays)) {
            daysAdded++;
        }
    }

    return currentDate;
}
