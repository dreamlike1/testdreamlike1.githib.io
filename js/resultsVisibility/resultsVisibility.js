// js/resultsVisibility.js

export function initializeResultsVisibility() {
    $('#serviceType').on('change', handleVisibilityChange);
    $('#countrySelect').on('change', handleVisibilityChange);
}

function handleVisibilityChange() {
    const serviceType = $('#serviceType').val();
    const country = $('#countrySelect').val();

    // Always show #resultText1 but hide its text
    $('#resultText1').removeClass('hidden');
    $('#resultText1').text(''); // Hide text by setting it to empty

    // Default to hiding all other result fields
    $('#resultText2').addClass('hidden');
    $('#standardResultField').addClass('hidden');
    $('#result').addClass('hidden');
    $('#standardResult').addClass('hidden');

    // Show additional fields if the conditions are met
    if (serviceType === 'standard' && country === 'United States') {
        $('#resultText1').text('Result for 5-8 Business Days'); // Set text for #resultText1
        $('#result').removeClass('hidden');

        $('#resultText2').text('Result for 6-7 Business Days');
        $('#resultText2').removeClass('hidden');

        $('#standardResultField').removeClass('hidden');
        $('#standardResult').removeClass('hidden');
    }
}
