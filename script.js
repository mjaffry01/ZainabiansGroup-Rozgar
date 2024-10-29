// script.js

// ============================
// 1. Centralized Configuration
// ============================

const GROUP_PHONE = '919650068218'; // Zainabians Group WhatsApp and SMS number

// Message Templates
const MESSAGE_TEMPLATE_WHATSAPP = `As Salamwalakum, my name is {requesterName}. 
Please book a service call with {serviceProviderName} ({serviceProviderPhone}). 
The service I need is {profession}, and my phone number is {requesterPhone}.`;

const MESSAGE_TEMPLATE_SMS = `As Salamwalakum, my name is {requesterName}. 
Please book a service call with {serviceProviderName} ({serviceProviderPhone}). 
The service I need is {profession}, and my phone number is {requesterPhone}.`;

// ============================
// 2. Synonyms Dictionary
// ============================

const professionSynonyms = {
    "teacher": ["tutor", "instructor", "educator", "mentor", "professor", "lecturer"],
    "dentist": ["dental surgeon", "oral health specialist", "teeth specialist", "orthodontist"],
    "private tutor": ["tutor", "educator", "instructor", "mentor", "teacher"],
    "astrophysicist": ["space scientist", "astronomer", "cosmologist", "space researcher"],
    "engineer": ["mechanical engineer", "civil engineer", "electrical engineer", "software engineer", "technologist"],
    "lawyer": ["attorney", "legal advisor", "counselor", "solicitor", "barrister"],
    "doctor": ["physician", "surgeon", "general practitioner", "medical doctor", "clinician"],
    "nurse": ["registered nurse", "nursing assistant", "nurse practitioner", "medical assistant", "caregiver"],
    "chef": ["cook", "culinary expert", "kitchen staff", "pastry chef", "line cook"],
    "programmer": ["developer", "software engineer", "coder", "web developer", "computer programmer"],
    "psychologist": ["therapist", "counselor", "mental health professional", "behavioral therapist"],
    "accountant": ["bookkeeper", "auditor", "financial analyst", "tax advisor"],
    "architect": ["designer", "urban planner", "building designer", "interior architect"],
    "pharmacist": ["chemist", "druggist", "pharmacy technician", "prescription specialist"],
    "plumber": ["pipefitter", "pipe layer", "irrigation technician", "sewer technician"],
    "electrician": ["electrical technician", "line installer", "electrical engineer", "cable technician"],
    "mechanic": ["automotive technician", "repair technician", "vehicle technician", "machine operator"],
    "scientist": ["researcher", "biologist", "chemist", "physicist", "data scientist"],
    "artist": ["painter", "sculptor", "illustrator", "visual artist", "graphic designer"],
    "photographer": ["cameraman", "photojournalist", "videographer", "image editor"],
    "writer": ["author", "journalist", "copywriter", "content creator", "novelist"],
    "marketing specialist": ["marketer", "digital marketer", "content strategist", "advertising specialist", "brand manager"],
    "business analyst": ["analyst", "data analyst", "market researcher", "strategic planner"],
    "data scientist": ["data analyst", "machine learning engineer", "data engineer", "AI specialist"],
    "translator": ["interpreter", "linguist", "language specialist", "transcriber"],
    "social worker": ["counselor", "family support worker", "community service worker", "case manager"],
    "real estate agent": ["realtor", "property consultant", "broker", "real estate advisor"],
    "fitness trainer": ["personal trainer", "exercise coach", "fitness instructor", "gym trainer"],
    "massage therapist": ["masseuse", "masseur", "bodywork specialist", "spa therapist"],
    "event planner": ["event coordinator", "wedding planner", "party organizer", "meeting planner"]
    // Add more professions and their synonyms as needed
};

// ============================
// 3. Utility Functions
// ============================

/**
 * Masks the last name in a full name string.
 * @param {string} fullName - The full name to be masked.
 * @returns {string} - The masked name.
 */
function maskName(fullName) {
    let parts = fullName.trim().split(' ');
    if (parts.length <= 2) {
        // If only first and last name, mask the last name
        return `${parts[0]} ${parts[1].charAt(0)}****`;
    } else {
        // Keep the title and first name, mask the last name
        let title = parts[0];
        let firstName = parts[1];
        let lastName = parts.slice(2).join(' ');
        // Masking the last name completely
        return `${title} ${firstName} ${'*'.repeat(lastName.length)}`;
    }
}

/**
 * Validates a phone number to ensure it contains exactly 10 digits.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - True if valid, else false.
 */
function isValidPhoneNumber(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

/**
 * Formats a message by replacing placeholders with actual data.
 * @param {string} template - The message template with placeholders.
 * @param {object} data - An object containing data to replace in the template.
 * @returns {string} - The formatted message.
 */
function formatMessage(template, data) {
    return template
        .replace('{requesterName}', data.requesterName)
        .replace('{serviceProviderName}', data.serviceProviderName)
        .replace('{serviceProviderPhone}', data.serviceProviderPhone)
        .replace('{profession}', data.profession)
        .replace('{requesterPhone}', data.requesterPhone);
}

/**
 * Sanitizes the phone number by removing any non-numeric characters.
 * @param {string} phone - The phone number to sanitize.
 * @returns {string} - The sanitized phone number.
 */
function sanitizePhoneNumber(phone) {
    return phone.replace(/\D/g, ''); // Removes all non-digit characters
}

/**
 * Finds the standard profession term based on the search query using synonyms.
 * @param {string} query - The user's search query.
 * @returns {string} - The standard profession term or the original query if no synonym found.
 */
function findStandardProfession(query) {
    // Iterate through the synonyms dictionary
    for (let standardTerm in professionSynonyms) {
        let synonyms = professionSynonyms[standardTerm].map(s => s.toLowerCase());
        if (synonyms.includes(query.toLowerCase())) {
            return standardTerm;
        }
    }
    // If no synonym matches, return the original query
    return query;
}

/**
 * Handles communication via WhatsApp, SMS, or Email.
 * @param {string} method - The communication method ('whatsapp', 'sms', or 'email').
 * @param {string} serviceProviderPhone - The service provider's phone number.
 * @param {string} serviceProviderName - The service provider's name.
 * @param {string} profession - The type of service needed.
 * @param {string} [email] - The service provider's email address (optional).
 */
function handleCommunication(method, serviceProviderPhone, serviceProviderName, profession, email = null) {
    // Store the current communication parameters to use after modal submission
    currentCommunication = {
        method: method,
        serviceProviderPhone: serviceProviderPhone,
        serviceProviderName: serviceProviderName,
        profession: profession,
        email: email
    };
    
    // Reset and hide any previous error messages
    $('#inputError').hide();
    $('#userInputForm')[0].reset();
    
    // Determine modal content based on the method
    if (method === 'email') {
        // Update modal title for email
        $('#userInputModalLabel').text('Provide Your Name');
        
        // Hide the phone number input
        $('#requesterPhone').parent().hide();
        $('#requesterName').parent().removeClass('col-md-6').addClass('col-md-12');
    } else {
        // Reset modal title and show all inputs
        $('#userInputModalLabel').text('Provide Your Details');
        $('#requesterPhone').parent().show();
        $('#requesterName').parent().removeClass('col-md-12').addClass('col-md-6');
    }
    
    // Show the modal
    $('#userInputModal').modal('show');
}

// Variable to store communication parameters
let currentCommunication = null;

/**
 * Processes the user input from the modal and initiates the communication.
 */
function processUserInput() {
    if (!currentCommunication) {
        alert("Unexpected error: Communication parameters not found.");
        return;
    }
    
    let { method, serviceProviderPhone, serviceProviderName, profession, email } = currentCommunication;
    
    // Get user inputs from the modal
    let userName = $('#requesterName').val().trim();
    let requesterPhone = $('#requesterPhone').val().trim();
    
    // Validate inputs based on the method
    if (method !== 'email') {
        if (!userName || !requesterPhone) {
            $('#inputError').text("Please enter both your name and phone number.").show();
            return;
        }
        if (!isValidPhoneNumber(requesterPhone)) {
            $('#inputError').text("Please enter a valid 10-digit phone number.").show();
            return;
        }
    } else {
        if (!userName) {
            $('#inputError').text("Please enter your name.").show();
            return;
        }
    }
    
    // Prepare data for message formatting
    let messageData = {
        requesterName: userName,
        requesterPhone: requesterPhone,
        serviceProviderName: serviceProviderName,
        serviceProviderPhone: serviceProviderPhone,
        profession: profession
    };
    
    // Select the appropriate message template
    let messageTemplate;
    if (method === 'whatsapp') {
        messageTemplate = MESSAGE_TEMPLATE_WHATSAPP;
    } else if (method === 'sms') {
        messageTemplate = MESSAGE_TEMPLATE_SMS;
    }
    
    // Create the message using the template
    let message = formatMessage(messageTemplate, messageData);
    
    // Sanitize the GROUP_PHONE for URLs (remove any non-digit characters)
    let sanitizedGroupPhone = sanitizePhoneNumber(GROUP_PHONE);
    
    // Open the appropriate communication channel directed to GROUP_PHONE
    if (method === 'whatsapp') {
        let whatsappUrl = `https://wa.me/${sanitizedGroupPhone}?text=${encodeURIComponent(message)}`;
        console.log("WhatsApp URL:", whatsappUrl); // Debugging
        window.open(whatsappUrl, '_blank');
    } else if (method === 'sms') {
        let smsUrl = `sms:${sanitizedGroupPhone}?body=${encodeURIComponent(message)}`;
        console.log("SMS URL:", smsUrl); // Debugging
        window.open(smsUrl, '_blank');
    } else if (method === 'email') {
        // For email, construct the mailto link
        let emailSubject = encodeURIComponent(`Service Request from ${userName}`);
        let emailBody = encodeURIComponent(`As Salamwalakum,\n\nMy name is ${userName}.\n\nI would like to book a service call for ${profession}.\n\nThank you.`);
        let mailtoUrl = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
        console.log("Email URL:", mailtoUrl); // Debugging
        window.open(mailtoUrl, '_blank');
    }
    
    // Hide the modal after processing
    $('#userInputModal').modal('hide');
    
    // Reset communication parameters
    currentCommunication = null;
}

// ============================
// 4. Display Functions
// ============================

/**
 * Displays business owners on the front page.
 */
function displayBusinessOwners() {
    let businessList = $('#businessList');
    businessList.empty(); // Clear existing data

    professionals.forEach(professional => {
        if (professional.business) {
            businessList.append(`
                <li class="list-group-item business-owner-item" 
                    data-name="${professional.name}" 
                    data-phone="${professional.phone}" 
                    data-email="${professional.email}" 
                    data-profession="${professional.profession}">
                    <i class="fas fa-store-alt"></i>
                    <div>
                        <strong>
                            <button type="button" class="btn btn-primary business-owner-button" 
                                    data-phone="${professional.phone || 'N/A'}" 
                                    data-email="${professional.email || 'N/A'}" 
                                    data-profession="${professional.profession || 'N/A'}">
                                ${professional.name}
                            </button>
                        </strong><br>
                        <span>${professional.description}</span>
                    </div>
                </li>
            `);
        }
    });
}

/**
 * Displays other professionals based on search criteria.
 * @param {Array} data - The array of professional objects to display.
 */
function displayProfessionals(data) {
    let tableBody = $('#resultsTable');
    tableBody.empty(); // Clear existing data

    if (data.length === 0) {
        tableBody.append(`
            <tr>
                <td colspan="4" class="text-center">No professionals found matching your search.</td>
            </tr>
        `);
        return;
    }

    data.forEach(professional => {
        tableBody.append(`
            <tr>
                <td>${professional.name}</td>
                <td>${professional.profession}</td>
                <td>${professional.description}</td>
                <td>
                    <button class="btn btn-sm btn-primary whatsapp-button" 
                        data-phone="${professional.phone}" 
                        data-name="${professional.name}" 
                        data-profession="${professional.profession}">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    <button class="btn btn-sm btn-success call-button">
                        <i class="fas fa-phone"></i> Call
                    </button>
                    <button class="btn btn-sm btn-info message-button" 
                        data-phone="${professional.phone}" 
                        data-name="${professional.name}" 
                        data-profession="${professional.profession}">
                        <i class="fas fa-comment"></i> Message
                    </button>
                </td>
            </tr>
        `);
    });
}

// ============================
// 5. Event Handlers
// ============================

// Handle form submission from the modal
$('#userInputForm').on('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    processUserInput();
});

// Debounce Timer for Search Input
let debounceTimer;

/**
 * Handles the search input with debounce and minimum query length.
 */
$('#searchInput').on('input', function() {
    clearTimeout(debounceTimer);
    const searchQuery = $(this).val().trim().toLowerCase();
    
    debounceTimer = setTimeout(() => {
        // Only perform search if input length >= 3
        if (searchQuery.length < 2) {
            $('#resultsTable').empty(); // Clear table
            console.log("Search input less than 3 characters. Clearing results.");
            return;
        }
        
        console.log("Search Query:", searchQuery); // Debugging
        
        // Normalize the search query using synonyms
        const standardProfession = findStandardProfession(searchQuery);
        console.log("Standard Profession:", standardProfession); // Debugging
        
        // Filter professionals based on normalized profession
        let filteredData = professionals.filter(prof => {
            // Check if 'profession' exists and is a string
            if (typeof prof.profession !== 'string') {
                console.warn(`Professional ${prof.name} has an invalid or missing 'profession' property.`);
                return false; // Exclude this professional from the filtered results
            }
            // Check if profession matches the search query or its synonyms
            const professionMatch = prof.profession.toLowerCase().includes(standardProfession.toLowerCase());
            const notBusiness = !prof.business;
            return professionMatch && notBusiness;
        });
        
        console.log("Filtered Data:", filteredData); // Debugging
        
        displayProfessionals(filteredData);
    }, 300); // Debounce delay of 300ms
});

// Display all professionals when the Show All button is clicked
$('#showAllButton').on('click', function() {
    const allProfessionals = professionals.filter(prof => !prof.business);
    displayProfessionals(allProfessionals);
});

// Handle WhatsApp button click in professionals table
$(document).on('click', '.whatsapp-button', function() {
    let serviceProviderPhone = $(this).data('phone');
    let serviceProviderName = $(this).data('name');
    let profession = $(this).data('profession');

    handleCommunication('whatsapp', serviceProviderPhone, serviceProviderName, profession);
});

// Handle Message button click in professionals table
$(document).on('click', '.message-button', function() {
    let serviceProviderPhone = $(this).data('phone');
    let serviceProviderName = $(this).data('name');
    let profession = $(this).data('profession');

    handleCommunication('sms', serviceProviderPhone, serviceProviderName, profession);
});

// Handle Call button click in professionals table
$(document).on('click', '.call-button', function() {
    // Direct the call to GROUP_PHONE instead of the vendor's phone
    window.location.href = `tel:${GROUP_PHONE}`;
});

// Handle Business Owner item click to show modal
$(document).on('click', '.business-owner-item', function() {
    let name = $(this).data('name');
    let phone = $(this).data('phone');
    let email = $(this).data('email');
    let profession = $(this).data('profession');

    // Populate modal fields
    $('#modalName').text(name);
    $('#modalPhone').text(phone);
    $('#modalEmail').text(email);

    // Attach data to modal buttons
    $('#modalWhatsAppButton')
        .data('phone', phone)
        .data('name', name)
        .data('profession', profession);
    $('#modalCallButton').data('phone', phone);
    
    $('#modalSMSButton')
        .data('phone', phone)
        .data('name', name)
        .data('profession', profession);
    $('#modalEmailButton')
        .data('email', email)
        .data('profession', profession);

    // Show the modal
    $('#businessOwnerModal').modal('show');
});

// Handle WhatsApp button click within modal
$('#modalWhatsAppButton').on('click', function() {
    let serviceProviderPhone = $(this).data('phone');
    let serviceProviderName = $(this).data('name');
    let profession = $(this).data('profession');

    handleCommunication('whatsapp', serviceProviderPhone, serviceProviderName, profession);
});

// Handle SMS button click within modal
$('#modalSMSButton').on('click', function() {
    let serviceProviderPhone = $(this).data('phone');
    let serviceProviderName = $(this).data('name');
    let profession = $(this).data('profession');

    handleCommunication('sms', serviceProviderPhone, serviceProviderName, profession);
});

// Handle Call button click within modal
$('#modalCallButton').on('click', function() {
    // Direct the call to GROUP_PHONE instead of the vendor's phone
    window.location.href = `tel:${GROUP_PHONE}`;
});

// Handle Email button click within modal
$('#modalEmailButton').on('click', function() {
    let email = $(this).data('email');
    let profession = $(this).data('profession');

    // Initiate email communication
    handleCommunication('email', null, null, profession, email);
});

// ============================
// 6. Initialization
// ============================

// Display business owners on page load
$(document).ready(function() {
    // Check if 'professionals' is defined and is an array
    if (typeof professionals === 'undefined' || !Array.isArray(professionals)) {
        alert('Failed to load professionals data. Please ensure data.js is correctly loaded.');
        return;
    }

    displayBusinessOwners();
});

// Back to Top Button functionality
$(document).ready(function() {
    // Show or hide the button based on scroll position
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) { // Show after scrolling down 100px
            $('#backToTopBtn').fadeIn();
        } else {
            $('#backToTopBtn').fadeOut();
        }
    });

    // Click event to scroll to top
    $('#backToTopBtn').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 600); // 600ms for smooth scrolling
        return false;
    });
});
