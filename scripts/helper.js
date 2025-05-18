/* eslint-disable linebreak-style */
import { ENVIRONMENT_DOMAINS } from './constants.js';

/**
 * Adds the 'active' class to anchor tags within the container that match the current pathname.
 * @param {Element} container - The element that contains anchor (`<a>`) tags.
 */
export function highlightActiveLink(container) {
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const links = container.querySelectorAll('a');

  links.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
}

/**
 * Cleans a given URL by removing `.html` extension and `/content/{repoName}` prefix.
 * @param {string} url - The full URL or path.
 * @returns {string} - Cleaned path (e.g. "/component/teaser-block").
 */
export function cleanUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return '';

  let cleaned = url.trim();
  const repoName = 'eds-wknd';

  // Remove ".html" at the end (case insensitive)
  cleaned = cleaned.replace(/\.html$/i, '');

  // Remove repo prefix if present
  const prefixPattern = new RegExp(`^/content/${repoName}`, 'i');
  cleaned = cleaned.replace(prefixPattern, '');

  // Ensure it starts with a "/"
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

/**
 * Generates a short, random alphanumeric unique identifier (UID).
 * @returns {string} A UID string consisting of 8 characters (letters and numbers).
 */
export function generateUID() {
  return Math.random().toString(36).slice(2, 15);
}

/**
 * Calculates the depth of a given path.
 * The depth is determined by the number of non-empty segments in the path.
 * @param {string} path - The path string to analyze. Defaults to an empty string.
 * @returns {number} The depth of the path (i.e., the number of non-empty segments).
 */
export function getDepth(path = '') {
  // Split the path by slashes ('/'), filter out any empty segments,
  // and count the remaining segments to determine the depth
  return path.split('/').filter(Boolean).length;
}

/**
 * Returns the current AEM environment based on the hostname.
 * If the hostname contains 'adobeaemcloud', it's considered an author environment.
 * Otherwise, it's treated as a publish environment.
 */
export function getAEMEnv() {
  return window.location.hostname.includes('adobeaemcloud') ? 'author' : 'publish';
}

/**
 * Returns the AEM publish domain if the environment is 'publish'.
 * Otherwise, returns an empty string.
 *
 * @returns {string} - The publish domain or an empty string.
 */
export function getAEMDomain() {
  const env = getAEMEnv();
  return env === 'publish' ? ENVIRONMENT_DOMAINS.publish : '';
}
