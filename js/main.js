import { populateCountries, getHolidaysForCountry } from './ui/countryUtils.js';
import { setupEventListeners } from './eventHandlers/eventHandlers.js';
import { setupSwitchButton } from './switch/switch.js';
import { initializeTimezone } from './timezone/timezone.js';
import { initializeDateSelector, updateCalendarWithHolidays } from './calendar/calendar.js'; // Import the date selector and update functions

document.addEventListener('DOMContentLoaded', () => {
    const defaultServiceType = 'expressPaid'; // Default service type

    // Initialize Semantic UI dropdowns
    $('.ui.dropdown').dropdown();

    // Populate countries dropdown and fetch holidays based on default serviceType
    populateCountries(defaultServiceType).then(() => {
        $('#countrySelect').dropdown('refresh'); // Ensure dropdown is refreshed
    });

    setupEventListeners(); // Setup event listeners for UI elements
    setupSwitchButton(); // Initialize the switch button functionality
    initializeTimezone(); // Initialize the timezone functionality
    initializeDateSelector(); // Initialize the date selector functionality

    // Event listener for country selection
    document.getElementById('countrySelect').addEventListener('change', function() {
        const countryName = this.value;
        // Retrieve holidays from cache for the selected country
        const holidays = getHolidaysForCountry(countryName);
        
        // Update calendar with holidays
        updateCalendarWithHolidays(holidays);
    });
});
