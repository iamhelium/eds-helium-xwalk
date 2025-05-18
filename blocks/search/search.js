/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';

import {
  createOptimizedPicture,
  decorateIcons,
  // fetchPlaceholders,
} from '../../scripts/aem.js';

const searchParams = new URLSearchParams(window.location.search);

function highlightTextElements(terms, elements) {
  elements.forEach((element) => {
    if (!element || !element.textContent) return;

    const matches = [];
    const { textContent } = element;
    terms.forEach((term) => {
      let start = 0;
      let offset = textContent.toLowerCase().indexOf(term.toLowerCase(), start);
      while (offset >= 0) {
        matches.push({ offset, term: textContent.substring(offset, offset + term.length) });
        start = offset + term.length;
        offset = textContent.toLowerCase().indexOf(term.toLowerCase(), start);
      }
    });

    if (!matches.length) {
      return;
    }

    matches.sort((a, b) => a.offset - b.offset);
    let currentIndex = 0;
    const fragment = matches.reduce((acc, { offset, term }) => {
      if (offset < currentIndex) return acc;
      const textBefore = textContent.substring(currentIndex, offset);
      if (textBefore) {
        acc.appendChild(document.createTextNode(textBefore));
      }
      const markedTerm = document.createElement('mark');
      markedTerm.textContent = term;
      acc.append(markedTerm);
      currentIndex = offset + term.length;
      return acc;
    }, document.createDocumentFragment());
    const textAfter = textContent.substring(currentIndex);
    if (textAfter) {
      fragment.appendChild(document.createTextNode(textAfter));
    }
    element.innerHTML = '';
    element.append(fragment);
  });
}

export async function fetchData() {
  const source = 'https://author-p51328-e442308.adobeaemcloud.com/content/eds-helium-xwalk.resource/query-index.json';

  try {
    const response = await fetch(source);
    if (!response.ok) {
      console.error('Error loading API response', response);
      return null;
    }

    const json = await response.json();
    if (!json) {
      console.error('Empty API response');
      return null;
    }

    return json.data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

function renderResult(result, searchTerms) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = result.path;

  if (result.image) {
    const wrapper = document.createElement('div');
    wrapper.className = 'search-result-image';
    const pic = createOptimizedPicture(result.image, '', false, [{ width: '375' }]);
    wrapper.append(pic);
    a.append(wrapper);
  }

  if (result.title) {
    const title = document.createElement('h3');
    title.className = 'search-result-title';
    const link = document.createElement('a');
    link.href = result.path;
    link.textContent = result.title;
    highlightTextElements(searchTerms, [link]);
    title.append(link);
    a.append(title);
  }

  if (result.description) {
    const description = document.createElement('p');
    description.textContent = result.description;
    highlightTextElements(searchTerms, [description]);
    a.append(description);
  }

  li.append(a);
  return li;
}

function clearSearchResults(block) {
  const searchResults = block.querySelector('.search-results');
  if (searchResults) {
    searchResults.innerHTML = '';
  }
}

function clearSearch(block) {
  clearSearchResults(block);
  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = '';
    searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
  }
}

async function renderResults(block, filteredData, searchTerms) {
  clearSearchResults(block);
  const searchResults = block.querySelector('.search-results');

  if (filteredData.length) {
    searchResults.classList.remove('no-results');
    filteredData.forEach((result) => {
      const li = renderResult(result, searchTerms);
      searchResults.append(li);
    });
  } else {
    const noResultsMessage = document.createElement('li');
    searchResults.classList.add('no-results');
    noResultsMessage.textContent = 'No results found.';
    searchResults.append(noResultsMessage);
  }
}

function filterData(searchTerms, data) {
  return data.filter((result) => searchTerms.some((term) => (result.title
    && result.title.toLowerCase().includes(term))
    || (result.description && result.description.toLowerCase().includes(term))));
}

async function handleSearch(e, block) {
  const searchValue = e.target.value.trim();
  searchParams.set('q', searchValue);

  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = searchParams.toString();
    window.history.replaceState({}, '', url.toString());
  }

  if (searchValue.length < 3) {
    clearSearch(block);
    return;
  }

  const searchTerms = searchValue.toLowerCase().split(/\s+/).filter(Boolean);
  const data = await fetchData();
  if (!data) {
    console.error('No data fetched');
    return;
  }

  const filteredData = filterData(searchTerms, data);
  await renderResults(block, filteredData, searchTerms);
}

function searchBox(block) {
  const input = document.createElement('input');
  input.setAttribute('type', 'search');
  input.className = 'search-input';
  input.placeholder = 'Search...';
  input.setAttribute('aria-label', 'Search');

  input.addEventListener('input', (e) => {
    handleSearch(e, block);
  });

  input.addEventListener('keyup', (e) => {
    if (e.code === 'Escape') {
      clearSearch(block);
    }
  });

  const box = document.createElement('div');
  box.classList.add('search-box');
  box.append(input);

  return box;
}

/**
 * Cleans a given URL by removing `.html` extension and `/content/{repoName}` prefix.
 * @param {string} url - The full URL or path.
 * @returns {string} - Cleaned path (e.g. "/component/teaser-block").
 */
export function cleanUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return '';

  let cleaned = url.trim();
  const repoName = 'eds-helium-xwalk';

  // Remove ".html" at the end (case insensitive)
  cleaned = cleaned.replace(/\.html$/i, '');

  // Remove repo prefix if present
  const prefixPattern = new RegExp(`^/content/${repoName}`, 'i');
  cleaned = cleaned.replace(prefixPattern, '');

  // Ensure it starts with a "/"
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

export default async function decorate(block) {
  console.log('Query Index: ', await ffetch('/query-index.json').all());
  console.log('Teaser Index: ', await ffetch('/teaser-index.json').all());
  console.log('Article Index: ', await ffetch('/article-index.json').all());
  console.log('Taxonomy: ', await ffetch('/taxonomy.json').all());

  const currentUrl = '/content/eds-helium-xwalk/component/teaser-block.html';
  const currentPath = cleanUrl(currentUrl);

  const matchedEntries = await ffetch('/teaser-index.json').filter(({ path }) => path === currentPath).first();

  console.log('Matched Entry:', matchedEntries);

  block.innerHTML = '';

  const searchResults = document.createElement('ul');
  searchResults.classList.add('search-results');

  block.append(searchBox(block), searchResults);

  if (searchParams.get('q')) {
    const input = block.querySelector('input');
    input.value = searchParams.get('q');
    input.dispatchEvent(new Event('input'));
  }

  decorateIcons(block);
}
