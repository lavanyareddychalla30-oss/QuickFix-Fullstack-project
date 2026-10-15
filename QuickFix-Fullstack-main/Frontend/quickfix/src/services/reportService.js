import { api, isDemo, unwrap } from './api.js';
// Demo reports are computed in the browser from tickets (see utils/reportUtils.js).
export const getSummary = (params) => (isDemo ? Promise.resolve(null) : unwrap(api.get('/reports/summary', { params })));
export const getSlaOverview = () => (isDemo ? Promise.resolve(null) : unwrap(api.get('/sla/overview')));
