import React from 'react';
import DOMPurify from 'dompurify';

/**
 * Safe HTML Display Component
 * Renders HTML content safely using DOMPurify to prevent XSS attacks
 * Only allows safe HTML tags commonly used in formatted text
 */
const SafeHtmlDisplay = ({ htmlContent, className = '' }) => {
    // Sanitize HTML content with strict whitelist
    const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's',
            'ol', 'ul', 'li',
            'a', 'span'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
        // Force all links to open in new tab and add noopener for security
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        ADD_ATTR: ['target', 'rel'],
    });

    // Post-process to ensure all links have target="_blank" and rel="noopener noreferrer"
    const processedHtml = sanitizedHtml.replace(
        /<a /g,
        '<a target="_blank" rel="noopener noreferrer" '
    );

    return (
        <div
            className={`safe-html-display prose max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
    );
};

export default SafeHtmlDisplay;
