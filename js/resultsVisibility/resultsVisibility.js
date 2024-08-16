// js/resultsVisibility.js

export function initializeResultsVisibility() {
    $('#serviceType').on('change', handleVisibilityChange);
    $('#countrySelect').on('change', handleVisibilityChange);
}

function handleVisibilityChange() {
    const serviceType = $('#serviceType').val();
    const country = $('#countrySelect').val();

    // Default to hiding all text fields and result fields
    $('#resultText1').addClass('hidden');
    $('#resultText2').addClass('hidden');
    $('#standardResultField').addClass('hidden');
    $('#result').addClass('hidden');
    $('#standardResult').addClass('hidden');

    // Show all fields if the conditions are met
    if (serviceType === 'standard' && country === 'United States') {
        $('#resultTextMessage1').text('Result for 5-8 Business Days');
        $('#resultText1').removeClass('hidden');
        $('#result').removeClass('hidden');

        $('#resultTextMessage2').text('Result for 6-7 Business Days');
        $('#resultText2').removeClass('hidden');

        $('#standardResultField').removeClass('hidden');
        $('#standardResult').removeClass('hidden');
    }
}
