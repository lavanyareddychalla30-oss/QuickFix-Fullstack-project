export const CATEGORIES = ['Hardware', 'Software', 'Network', 'Access Request', 'Email', 'Other'];
export const MAX_FILE = 5 * 1024 * 1024;
export function validateTicket({ title = '', description = '', category = '', contact = '' }) {
  const e = {};
  if (title.trim().length < 5) e.title = 'Title must be at least 5 characters.';
  if (description.trim().length < 20) e.description = 'Describe the problem in at least 20 characters.';
  if (!category) e.category = 'Select a category.';
  if (contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^[+\d][\d\s-]{6,}$/.test(contact)) e.contact = 'Enter a valid email or phone number.';
  return e;
}
export function validateFile(f) {
  if (f.size > MAX_FILE) return `${f.name} is larger than 5 MB.`;
  if (!/\.(png|jpe?g|pdf|txt|log|docx?)$/i.test(f.name)) return `${f.name} has an unsupported file type.`;
  return null;
}
