/* eslint-disable max-len */
/* eslint-disable no-console, no-shadow, object-curly-newline, no-nested-ternary */

import ffetch from '../../scripts/ffetch.js';
import { cleanUrl, generateUID, getDepth } from '../../scripts/helper.js';

// Sort articles based on title or last modified date
function sortArticles(articles, orderBy, sortDir) {
  return articles.sort((a, b) => {
    let valA;
    let valB;

    if (orderBy === 'title') {
      valA = a.title?.toLowerCase() || '';
      valB = b.title?.toLowerCase() || '';
    } else {
      valA = new Date(a.lastModified || 0);
      valB = new Date(b.lastModified || 0);
    }

    const result = valA > valB ? 1 : valA < valB ? -1 : 0;
    return sortDir === 'ascending' ? result : -result;
  });
}

// Sort articles by last published date in descending order
function sortByLastPublished(articles) {
  return articles.sort((a, b) => {
    const valA = new Date(a.lastPublished || 0);
    const valB = new Date(b.lastPublished || 0);
    return valB - valA;
  });
}

// Create a tab element for filtering articles by tag
function createTab({ tag, title }, uid, isActive = false) {
  const li = document.createElement('li');
  li.setAttribute('role', 'tab');
  li.className = 'tag';
  if (isActive) {
    li.classList.add('tag--active');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-selected', 'true');
  } else {
    li.setAttribute('tabindex', '-1');
    li.setAttribute('aria-selected', 'false');
  }
  li.id = `tabs-${uid}-tab`;
  li.setAttribute('aria-controls', `tabs-${uid}-tabpanel`);
  li.dataset.tag = tag;
  li.textContent = title;
  return li;
}

// Create an article card element to display article details
function createArticleCard({ path, title = '', description = '', image = '', imageAlt = '' }) {
  const article = document.createElement('article');
  article.className = 'article-content';

  const imgLink = document.createElement('a');
  imgLink.className = 'article-image--link';
  imgLink.href = path;

  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'article-image';

  const cmpImage = document.createElement('div');
  cmpImage.className = 'cmp-image';

  const img = document.createElement('img');
  img.className = 'cmp-image__image';
  img.src = image;
  img.alt = imageAlt;
  img.loading = 'lazy';
  img.width = 765;
  img.height = 535;

  cmpImage.appendChild(img);
  imgWrapper.appendChild(cmpImage);
  imgLink.appendChild(imgWrapper);

  const titleLink = document.createElement('a');
  titleLink.className = 'article-title--link';
  titleLink.href = path;

  const titleSpan = document.createElement('span');
  titleSpan.className = 'article-title';
  titleSpan.textContent = title;

  titleLink.appendChild(titleSpan);

  const desc = document.createElement('span');
  desc.className = 'article-description';
  desc.textContent = description;

  article.append(imgLink, titleLink, desc);

  return article;
}

// Enable keyboard navigation for tab elements
function setupTabKeyboardNavigation(tabList) {
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];

  tabList.addEventListener('keydown', (e) => {
    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
    if (e.key === 'ArrowRight') {
      const nextTab = tabs[(currentIndex + 1) % tabs.length];
      nextTab.focus();
    } else if (e.key === 'ArrowLeft') {
      const prevTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
      prevTab.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.activeElement.click();
    }
  });

  tabs.forEach((tab) => {
    tab.setAttribute('tabindex', tab.classList.contains('tag--active') ? '0' : '-1');
  });
}

// Main decorate function that builds the article layout
export default async function decorate(block) {
  const [
    layoutTypeEl, childParentEl, childDepthEl,
    enableTagsEl, filterTagsEl,
    recentParentEl, recentDepthEl, recentCountEl,
    orderEl, sortEl,
  ] = [...block.children];

  const layoutType = layoutTypeEl?.querySelector('p')?.textContent.trim();
  const childParent = cleanUrl(childParentEl?.querySelector('a')?.getAttribute('href') || '');
  const childDepth = parseInt(childDepthEl?.querySelector('p')?.textContent.trim(), 10);
  const enableTags = enableTagsEl?.querySelector('p')?.textContent.trim().toLowerCase() === 'true';
  const filterTags = (filterTagsEl?.querySelector('p')?.textContent || '').split(',').map((t) => t.trim()).filter(Boolean);
  const recentParent = cleanUrl(recentParentEl?.querySelector('a')?.getAttribute('href') || '');
  const recentDepth = parseInt(recentDepthEl?.querySelector('p')?.textContent.trim(), 10);
  const recentCount = parseInt(recentCountEl?.querySelector('p')?.textContent.trim(), 10);
  const order = orderEl?.querySelector('p')?.textContent.trim();
  const sort = sortEl?.querySelector('p')?.textContent.trim();

  console.log(layoutType, childParent, childDepth, enableTags, filterTags, recentParent, recentDepth, recentCount, order, sort);

  let articleList = [];
  try {
    articleList = await ffetch('/article-index.json').all();
    articleList = articleList.filter((article) => (article['cq-tags'] || '').split(',')
      .map((t) => t.trim()).includes('eds-wknd:page-type/article'));
  } catch (e) {
    console.warn('Failed to fetch articles:', e);
    return;
  }

  console.log('article List', articleList);
  block.innerHTML = '';

  const getArticlesByDepth = (parentPath, maxDepth) => {
    const parentDepth = getDepth(parentPath);

    console.log('parentDepth', parentDepth, 'articleList: ', articleList);
    return articleList.filter(({ path }) => {
      const isChild = path.startsWith(parentPath) && path !== parentPath;
      const currentDepth = getDepth(path);
      return isChild && currentDepth > parentDepth && currentDepth <= parentDepth + maxDepth;
    });
  };

  if (layoutType === 'child-articles') {
    const filtered = getArticlesByDepth(childParent, childDepth);
    const sorted = sortArticles(filtered, order, sort);
    console.log('filtered', filtered, 'sorted: ', sorted);

    if (enableTags) {
      // TAG FILTER VARIATION
      let tags = [];
      try {
        tags = await ffetch('/taxonomy.json').all();
      } catch (e) {
        console.warn('Failed to fetch tags:', e);
        return;
      }

      const filteredTags = tags.filter((t) => filterTags.includes(t.tag));
      const uid = generateUID();

      const tabList = document.createElement('ol');
      tabList.className = 'tag-list';
      tabList.setAttribute('role', 'tablist');

      const articleContainer = document.createElement('div');
      articleContainer.className = 'article-list';

      const renderArticles = (tagFilter = '') => {
        articleContainer.innerHTML = '';
        const toRender = tagFilter
          ? sorted.filter((a) => (a['cq-tags'] || '').split(',').map((t) => t.trim()).includes(tagFilter))
          : sorted;
        toRender.forEach((article) => articleContainer.appendChild(createArticleCard(article)));
      };

      const tabs = [];

      const allTab = createTab({ tag: '', title: 'ALL' }, uid, true);
      tabs.push(allTab);
      tabList.appendChild(allTab);

      filteredTags.forEach((tagData) => {
        const tab = createTab(tagData, uid);
        tabs.push(tab);
        tabList.appendChild(tab);
      });

      console.log('tab List', tabList, 'article Container: ', articleContainer);
      setupTabKeyboardNavigation(tabList);
      block.append(tabList, articleContainer);
      renderArticles();

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => {
            t.classList.remove('tag--active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
          });
          tab.classList.add('tag--active');
          tab.setAttribute('aria-selected', 'true');
          tab.setAttribute('tabindex', '0');
          renderArticles(tab.dataset.tag);
        });
      });
    } else {
      // DEFAULT VARIATION
      const articleContainer = document.createElement('div');
      articleContainer.className = 'article-list';
      console.log('default all article', sorted, 'article Container: ', articleContainer);
      sorted.forEach((article) => articleContainer.appendChild(createArticleCard(article)));
      block.appendChild(articleContainer);
    }
    return;
  }

  if (layoutType === 'recent-articles') {
    const filtered = getArticlesByDepth(recentParent, recentDepth);
    const sorted = sortByLastPublished(filtered).slice(0, recentCount);

    const articleContainer = document.createElement('div');
    articleContainer.className = 'article-list';
    sorted.forEach((article) => articleContainer.appendChild(createArticleCard(article)));
    block.appendChild(articleContainer);
    return;
  }

  if (layoutType === 'manual-articles') {
    // To be implemented based on how manual articles are configured
    block.innerHTML = '<p>[Manual Articles Placeholder]</p>';
  }
}
