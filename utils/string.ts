// Helper function to truncate text
export const truncateText = (text: string | null, maxLength: number = 20) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
