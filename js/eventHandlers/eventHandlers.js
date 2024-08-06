// eventHandlers/eventHandlers.js
import { populateCountries } from '../ui/countryUtils.js'; // Adjusted path
import { getBusinessDays } from '../ui/businessDaysUtils.js'; // Adjusted path
import { formatDate } from '../dateUtils/dateUtils.js'; // Correct path to dateUtils.js
import { calculateBusinessDate } from '../ui/dateCalculation.js';

export function setupEventListeners() {
    document.getElementById('serviceType').addEventListener('change', () => {
        populateCountries();
        populateBusinessDays();
    });
    document
        .getElementById('countrySelect')
        .addEventListener('change', populateBusinessDays);
    document
        .getElementById('calculateButton')
        .addEventListener('click', calculateBusinessDate);
    document.getElementById('result').addEventListener('click', () => {
        const resultField = document.getElementById('result');
        navigator.clipboard.writeText(resultField.value).then(() => {
            const copyMessageCalculator = document.getElementById('copyMessageCalculator');
            copyMessageCalculator.style.display = 'block';
            setTimeout(() => {
                copyMessageCalculator.style.display = 'none';
            }, 2000);
        });
    });
}
