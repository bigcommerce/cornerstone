import utils from '@bigcommerce/stencil-utils';

/**
 * Initializes a Google Map for address input and handles reverse geocoding.
 * @param {Object} options
 * @param {string} options.mapContainerId - The ID of the div element to contain the map.
 * @param {string} options.latitudeInputSelector - Selector for the hidden input to store latitude. (Optional)
 * @param {string} options.longitudeInputSelector - Selector for the hidden input to store longitude. (Optional)
 * @param {Object} options.addressFields - Selectors for the address form fields.
 * @param {string} options.addressFields.street1 - Selector for street address line 1.
 * @param {string} options.addressFields.city - Selector for city.
 * @param {string} options.addressFields.state - Selector for state/province (select or input).
 * @param {string} options.addressFields.zip - Selector for zip/postal code.
 * @param {string} options.addressFields.country - Selector for country (select).
 * @param {Object} options.defaultCenter - Default map center { lat, lng }.
 * @param {number} options.defaultZoom - Default map zoom level.
 */
export default function initMapAddressInput(options) {
    const {
        mapContainerId,
        latitudeInputSelector,
        longitudeInputSelector,
        addressFields,
        defaultCenter = { lat: 34.052235, lng: -118.243683 }, // Default to Los Angeles
        defaultZoom = 8,
    } = options;

    const $mapContainer = $(`#${mapContainerId}`);
    if (!$mapContainer.length) {
        console.error(`Map container #${mapContainerId} not found.`);
        return;
    }
    // Basic loader and message display
    $mapContainer.html('<div class="map-loader-placeholder" style="text-align:center; padding:20px;">Loading map...</div><div class="map-message-placeholder" style="display:none; margin-top:10px; padding:10px; border:1px solid #ccc; background-color:#f9f9f9;"></div>');
    const $loader = $mapContainer.find('.map-loader-placeholder');
    const $message = $mapContainer.find('.map-message-placeholder');


    let map;
    let marker;
    let geocoder;

    function initMap() {
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            console.error('Google Maps API not loaded.');
            // Optionally, load it dynamically here if not already loaded via script tag
            // For now, we assume it's loaded via a script tag in base.html
            $loader.text('Google Maps API not loaded. Please ensure it is included.');
            $message.hide();
            return;
        }

        $loader.hide(); // Hide "Loading map..." text
        $message.hide(); // Clear any previous messages

        // Create a sub-div for the actual map if not already done, to separate from loader/message
        let $trueMapCanvas = $mapContainer.find('.true-map-canvas-internal');
        if (!$trueMapCanvas.length) {
            $trueMapCanvas = $('<div class="true-map-canvas-internal" style="height:100%; width:100%;"></div>').appendTo($mapContainer);
        }


        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map($trueMapCanvas[0], { // Initialize map in the sub-div
            center: defaultCenter,
            zoom: defaultZoom,
            streetViewControl: false,
            mapTypeControl: false,
        });

        marker = new google.maps.Marker({
            map,
            draggable: true,
            position: defaultCenter,
        });

        marker.addListener('dragend', () => {
            $message.text('Fetching address...').removeClass('error').addClass('info').show();
            const newPosition = marker.getPosition();
            map.panTo(newPosition);
            if (latitudeInputSelector) {
                $(latitudeInputSelector).val(newPosition.lat());
            }
            if (longitudeInputSelector) {
                $(longitudeInputSelector).val(newPosition.lng());
            }
            reverseGeocode(newPosition);
        });

        // Optional: Try to geocode existing address if fields are pre-filled
        // This would be an enhancement for the edit address page.
        // For now, focus on pin drop populating fields.
    }

    function reverseGeocode(latLng) {
        if (!geocoder) return;

        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    populateAddressFields(results[0]);
                    $message.hide(); // Hide "Fetching address..."
                } else {
                    console.warn('No results found for reverse geocoding.');
                    $message.text('Could not find address for this location. Please try a different spot or fill fields manually.').removeClass('info').addClass('error').show();
                    clearAddressFields();
                }
            } else {
                console.error(`Geocoder failed due to: ${status}`);
                $message.text(`Address lookup failed: ${status}. Please try again or fill fields manually.`).removeClass('info').addClass('error').show();
                clearAddressFields();
            }
        });
    }

    function populateAddressFields(place) {
        clearAddressFields(); // Clear fields before populating

        const components = place.address_components;
        let streetNumber = '';
        let route = '';

        components.forEach(component => {
            const types = component.types;
            if (types.includes('street_number')) {
                streetNumber = component.long_name;
            }
            if (types.includes('route')) {
                route = component.long_name;
            }
            if (types.includes('locality')) {
                $(addressFields.city).val(component.long_name).trigger('change');
            }
            if (types.includes('administrative_area_level_1')) {
                const $stateEl = $(addressFields.state);
                if ($stateEl.is('select')) {
                    // Attempt to match by long_name or short_name
                    let found = false;
                    $stateEl.find('option').each(function() {
                        if ($(this).text() === component.long_name || $(this).text() === component.short_name) {
                            $(this).prop('selected', true);
                            found = true;
                            return false; // break loop
                        }
                    });
                    if (!found) $stateEl.val(''); // Or try to set by value if available
                } else {
                    $stateEl.val(component.long_name);
                }
                $stateEl.trigger('change'); // Trigger change for any dependent logic
            }
            if (types.includes('country')) {
                const $countryEl = $(addressFields.country);
                 // Attempt to match by short_name (e.g., 'US') first, then long_name
                let found = false;
                $countryEl.find('option').each(function() {
                    if ($(this).val() === component.short_name) { // Assuming option value is country code
                        $(this).prop('selected', true);
                        found = true;
                        return false;
                    }
                });
                if (!found) {
                    $countryEl.find('option').each(function() {
                        if ($(this).text() === component.long_name) {
                            $(this).prop('selected', true);
                            found = true;
                            return false;
                        }
                    });
                }
                if (!found) $countryEl.val('');
                $countryEl.trigger('change'); // Important for state dropdown population
            }
            if (types.includes('postal_code')) {
                $(addressFields.zip).val(component.long_name).trigger('change');
            }
        });

        $(addressFields.street1).val(`${streetNumber} ${route}`.trim()).trigger('change');
    }

    function clearAddressFields() {
        $(addressFields.street1).val('');
        $(addressFields.city).val('');
        // Don't necessarily clear state and country if they drive other logic,
        // but ensure they are reset if no corresponding component found.
        // $(addressFields.state).val('');
        // $(addressFields.country).val('');
        $(addressFields.zip).val('');
    }

    // Check if Google Maps API is loaded, if not, set up a callback
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
        initMap();
    } else {
        // Assuming a global initMapCallback function will be called by the API script
        // If you have a specific function name for the API callback, use that.
        // This is a common pattern, but if the theme has a different way, adjust accordingly.
        const existingCallback = window.initMapCallback; // Or whatever the theme uses
        window.initMapCallback = function() {
            if (existingCallback) existingCallback();
            initMap();
        };
        // If the API script is already requested and just hasn't loaded,
        // the callback will handle it. If not, you might need to dynamically load it.
        // For this PR, we assume script tag is in base.html and will call initMapCallback.
    }

    // Return an object with a method to manually trigger reverse geocode if needed
    return {
        geocode: (latLng) => reverseGeocode(latLng),
        getMap: () => map,
        getMarker: () => marker,
    };
}
