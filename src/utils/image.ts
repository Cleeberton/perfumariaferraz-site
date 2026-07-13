/**
 * Format Google Drive links to direct download web links
 */
export function formatImageUrl(url: string): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600';
  }
  
  const cleanUrl = url.trim();
  
  // Match Google Drive file id patterns:
  // e.g. drive.google.com/file/d/FILE_ID/view...
  // e.g. drive.google.com/open?id=FILE_ID
  const driveMatch = cleanUrl.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]{25,})/i);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  
  return cleanUrl;
}
