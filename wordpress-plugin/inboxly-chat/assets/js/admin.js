// Admin JS
jQuery(function($) {
    'use strict';

    // Test API connection
    $('#test-api-connection').on('click', function() {
        const apiUrl = $('#api_url').val();
        
        $.ajax({
            url: apiUrl + '/api/health',
            type: 'GET',
            success: function() {
                alert('API connection successful!');
            },
            error: function() {
                alert('Failed to connect to API. Please check the URL.');
            }
        });
    });
});
