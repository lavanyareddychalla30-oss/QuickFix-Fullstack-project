import { api, isDemo, unwrap } from './api.js';
import { ARTICLES } from '../data/articles.js';
export const listArticles = () => (isDemo ? Promise.resolve(ARTICLES) : unwrap(api.get('/knowledge-base/articles')));
