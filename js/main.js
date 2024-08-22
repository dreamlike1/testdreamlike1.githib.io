import { populateCountries } from './ui/countryUtils.js';
import { setupEventListeners } from './eventHandlers/eventHandlers.js';
import { setupSwitchButton } from './switch/switch.js';
import { initializeTimezone } from './timezone/timezone.js';
import { initializeDateSelector } from './calendar/calendar.js'; // Import the date selector module
import { initializeResultsVisibility } from './resultsVisibility/resultsVisibility.js'; // Import the results visibility module

document.addEventListener('DOMContentLoaded', () => {
    const defaultServiceType = 'expressPaid'; // Default service type

    // Function to format the date in a worded format
    function formatDateToWorded(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    // Function to set today's date in a specific format
    function setTodayDate() {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        document.getElementById('couponDate').querySelector('input').value = formattedDate;
    }

    // Initialize Semantic UI dropdowns
    $('.ui.dropdown').dropdown();

    // Fetch holidays based on default serviceType
    populateCountries(defaultServiceType).then(holidays => {
        $('#countrySelect').dropdown('refresh'); // Ensure dropdown is refreshed
        
        // Initialize the date selectors
        initializeDateSelector(holidays); // Initialize with holidays for startDate, no holidays for couponDate
    });

    setupEventListeners(); // Setup event listeners for UI elements
    setupSwitchButton(); // Initialize the switch button functionality
    initializeTimezone(); // Initialize the timezone functionality
    initializeResultsVisibility(); // Initialize results visibility logic

    // Set today's date as default value for couponDate input
    setTodayDate();
});
