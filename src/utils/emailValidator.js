/**
 * Client-Side Email Domain Validator
 * Validates that user emails belong to allowed university domains
 */

/**
 * Check if an email belongs to an allowed university domain
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is from allowed domain, false otherwise
 */
export const isUniversityEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const emailLower = email.toLowerCase().trim();

    // Check both student and supervisor domains
    const isStudentEmail = emailLower.endsWith('@ugrad.iiuc.ac.bd');
    const isSupervisorEmail = emailLower.endsWith('@iiuc.ac.bd') && !emailLower.endsWith('@ugrad.iiuc.ac.bd');

    return isStudentEmail || isSupervisorEmail;
};

/**
 * Get a user-friendly error message for invalid emails
 * @returns {string} Error message
 */
export const getInvalidEmailMessage = () => {
    return `Only university emails are allowed. Students must use @ugrad.iiuc.ac.bd and supervisors must use @iiuc.ac.bd`;
};

/**
 * Validate email and return result with error message
 * @param {string} email - Email to validate
 * @returns {object} { isValid: boolean, message?: string }
 */
export const validateUniversityEmail = (email) => {
    const isValid = isUniversityEmail(email);

    if (!isValid) {
        return {
            isValid: false,
            message: getInvalidEmailMessage()
        };
    }

    return {
        isValid: true
    };
};

/**
 * Determine role based on email domain
 * @param {string} email - Email address
 * @returns {string} 'student' or 'supervisor' or null
 */
export const getRoleFromEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return null;
    }

    const emailLower = email.toLowerCase().trim();

    if (emailLower.endsWith('@ugrad.iiuc.ac.bd')) {
        return 'student';
    } else if (emailLower.endsWith('@iiuc.ac.bd') && !emailLower.endsWith('@ugrad.iiuc.ac.bd')) {
        return 'supervisor';
    }

    return null;
};

/**
 * Get allowed domains for display purposes
 * @returns {string[]} Array of allowed domains
 */
export const getAllowedDomainsForDisplay = () => {
    return ['@ugrad.iiuc.ac.bd', '@iiuc.ac.bd'];
};
