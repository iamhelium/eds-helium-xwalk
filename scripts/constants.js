/**
 * AEM Environment Types
 */
export const ENVIRONMENTS = {
  AUTHOR: 'author',
  PUBLISH: 'publish',
};

/**
 * AEM Environment Base Domains
 */
export const ENVIRONMENT_DOMAINS = {
  [ENVIRONMENTS.AUTHOR]: 'author-p51328-e442308.adobeaemcloud.com',
  [ENVIRONMENTS.PUBLISH]: 'publish-p51328-e442308.adobeaemcloud.com',
};

/**
 * Query Index Paths
 */
export const QUERY_INDEX_PATHS = {
  ARTICLES: '/article-index.json',
  TAXONOMY: '/taxonomy.json',
  TEASERS: '/teaser-index.json',
};
