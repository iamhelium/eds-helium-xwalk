/* eslint-disable no-console, object-curly-newline */
import ffetch from '../../scripts/ffetch.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { cleanUrl, generateUID, getDepth } from '../../scripts/helper.js';

/**
 * Sorts articles by title or last modified date.
 */
function sortArticles(articles, orderBy, sortDir) {
  return articles.sort((a, b) => {
    const valA = orderBy === 'title' ? a.title?.toLowerCase() || '' : new Date(a.lastModified || 0);
    const valB = orderBy === 'title' ? b.title?.toLowerCase() || '' : new Date(b.lastModified || 0);
    const result = Math.sign(valA - valB);
    return sortDir === 'ascending' ? result : -result;
  });
}

/**
 * Sorts articles by last published date (descending).
 */
function sortByLastPublished(articles) {
  return articles.sort((a, b) => new Date(b.lastPublished || 0) - new Date(a.lastPublished || 0));
}

/**
 * Create a tab element for filtering articles by tag
 */
function createTab({ tag, title }, uid, isActive = false) {
  const li = document.createElement('li');
  li.className = `tag${isActive ? ' tag--active' : ''}`;
  li.setAttribute('role', 'tab');
  li.setAttribute('tabindex', isActive ? '0' : '-1');
  li.setAttribute('aria-selected', isActive ? 'true' : 'false');
  li.id = `tabs-${uid}-tab`;
  li.setAttribute('aria-controls', `tabs-${uid}-tabpanel`);
  li.dataset.tag = tag;
  li.textContent = title;
  return li;
}

/**
 * Creates an article card element.
 */
function createArticleCard({ path, title = '', description = '', image = '', imageAlt = '' }) {
  const article = document.createElement('article');
  article.className = 'article-content';

  // Image section
  const imgLink = document.createElement('a');
  imgLink.className = 'article-image--link';
  imgLink.href = path;

  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'article-image';

  const cmpImage = document.createElement('div');
  cmpImage.className = 'cmp-image';

  const picture = createOptimizedPicture(image, imageAlt, false);
  picture.querySelector('img')?.classList.add('cmp-image__image');

  cmpImage.appendChild(picture);
  imgWrapper.appendChild(cmpImage);
  imgLink.appendChild(imgWrapper);

  // Title section
  const titleLink = document.createElement('a');
  titleLink.className = 'article-title--link';
  titleLink.href = path;

  const titleSpan = document.createElement('span');
  titleSpan.className = 'article-title';
  titleSpan.textContent = title;

  titleLink.appendChild(titleSpan);

  // Description section
  const desc = document.createElement('span');
  desc.className = 'article-description';
  desc.textContent = description;

  article.append(imgLink, titleLink, desc);
  return article;
}

/**
 * Enables keyboard navigation for tab list.
 */
function setupTabKeyboardNavigation(tabList) {
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];

  tabList.addEventListener('keydown', (e) => {
    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
    if (e.key === 'ArrowRight') {
      tabs[(currentIndex + 1) % tabs.length].focus();
    } else if (e.key === 'ArrowLeft') {
      tabs[(currentIndex - 1 + tabs.length) % tabs.length].focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.activeElement.click();
    }
  });

  tabs.forEach((tab) => {
    tab.setAttribute('tabindex', tab.classList.contains('tag--active') ? '0' : '-1');
  });
}

/**
 * Main decorate function that builds the article layout.
 */
export default async function decorate(block) {
  const children = [...block.children];
  const configRows = children.slice(0, 10);
  const manualArticleBlocks = children.slice(10);

  const [
    layoutTypeEl, childParentEl, childDepthEl,
    enableTagsEl, filterTagsEl,
    recentParentEl, recentDepthEl, recentCountEl,
    orderEl, sortEl,
  ] = configRows;

  // Clear original block before rendering any layout
  block.innerHTML = '';

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

  let articleList = [];
  try {
    articleList = await ffetch('/article-index.json').all();
    articleList = articleList.filter((article) => (article['cq-tags'] || '').split(',')
      .map((t) => t.trim()).includes('eds-wknd:page-type/article'));
  } catch (e) {
    console.warn('Failed to fetch articles:', e);
    return;
  }

  const getArticlesByDepth = (parentPath, maxDepth) => {
    const parentDepth = getDepth(parentPath);
    return articleList.filter(({ path }) => {
      const isChild = path.startsWith(parentPath) && path !== parentPath;
      const currentDepth = getDepth(path);
      return isChild && currentDepth > parentDepth && currentDepth <= parentDepth + maxDepth;
    });
  };

  // "child-articles"   → renders all child articles ("All Articles")
  if (layoutType === 'child-articles') {
    const filtered = getArticlesByDepth(childParent, childDepth);
    const sorted = sortArticles(filtered, order, sort);

    if (enableTags) {
      // TAG FILTER VARIATION
      let tags = [];
      try {
        const res = await fetch('/taxonomy.json');
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const taxonomy = await res.json();
        const type = taxonomy[':type'];
        tags = type === 'multi-sheet' ? taxonomy.default?.data || [] : taxonomy.data || [];
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

      // Add "ALL" tab
      const allTab = createTab({ tag: '', title: 'ALL' }, uid, true);
      tabList.appendChild(allTab);
      tabs.push(allTab);

      // Add filtered tags
      filteredTags.forEach((tagData) => {
        const tab = createTab(tagData, uid);
        tabList.appendChild(tab);
        tabs.push(tab);
      });

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
      sorted.forEach((article) => articleContainer.appendChild(createArticleCard(article)));
      block.appendChild(articleContainer);
    }

    return;
  }

  // "recent-articles"  → renders a limited number of recent articles ("Recent Articles")
  if (layoutType === 'recent-articles') {
    const filtered = getArticlesByDepth(recentParent, recentDepth);
    const sorted = sortByLastPublished(filtered).slice(0, recentCount);
    const articleContainer = document.createElement('div');
    articleContainer.className = 'article-list';
    sorted.forEach((article) => articleContainer.appendChild(createArticleCard(article)));
    block.appendChild(articleContainer);
    return;
  }

  // "manual-articles"  → renders manually specified articles ("Create Articles Manually")
  if (layoutType === 'manual-articles') {
    const articleContainer = document.createElement('div');
    articleContainer.className = 'article-list';

    manualArticleBlocks.forEach((rawBlock) => {
      const [imgDiv, titleDiv, descDiv, linkDiv] = [...rawBlock.children];
      const image = imgDiv?.querySelector('img')?.getAttribute('src') || '';
      const imageAlt = imgDiv?.querySelector('img')?.getAttribute('alt') || '';
      const title = titleDiv?.textContent.trim() || '';
      const description = descDiv?.textContent.trim() || '';
      const path = linkDiv?.querySelector('a')?.getAttribute('href') || '';
      const articleCard = createArticleCard({ path, title, description, image, imageAlt });

      // Copy any AUE (Authoring UI Extension) attributes
      [...rawBlock.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-aue')) {
          articleCard.setAttribute(attr.name, attr.value);
        }
      });

      articleContainer.appendChild(articleCard);
    });

    block.appendChild(articleContainer);
  }
}
