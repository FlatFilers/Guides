const fs = require('fs');
const path = require('path');
const RSS = require('rss');
const { Remarkable } = require('remarkable');

// Initialize markdown parser
const md = new Remarkable({
  html: true,      // Enable HTML tags in source
  breaks: true     // Convert '\n' in paragraphs into <br>
});

/**
 * Generate RSS Feed from Changelog MDX
 * 
 * This script generates an RSS feed XML file from the platform changelog MDX file.
 * It extracts all <Update> components and converts them to RSS items.
 * 
 * Usage: node generateRss.js
 */

// Site configuration
const siteConfig = {
  title: 'Flatfile Platform Changelog',
  description: 'Notable additions and updates to the Flatfile platform',
  site_url: 'https://flatfile.com',
  feed_url: 'https://flatfile.com/changelog/platform/feed.xml',
  image_url: 'https://flatfile.com/favicon.jpg',
  language: 'en',
  ttl: 60
};

// Path to the platform changelog MDX file
const changelogPath = path.join(__dirname, '../platform.mdx');
// Output path for the RSS XML file
const outputPath = path.join(__dirname, '../../public/changelog/platform/feed.xml');

// Ensure the output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Parse date from label format (MM-DD-YYYY)
function parseDate(dateStr) {
  const [month, day, year] = dateStr.split('-').map(part => parseInt(part, 10));
  return new Date(year, month - 1, day);
}

// Extract content from <Update> components in the MDX file
function extractUpdates(content) {
  const updatePattern = /<Update label="([^"]+)" tags={(\[[^\]]+\])}>\s*([\s\S]*?)\s*<\/Update>/g;
  const updates = [];
  let match;

  while ((match = updatePattern.exec(content)) !== null) {
    const dateLabel = match[1];
    // Simple parsing to extract tags as string array
    const tagsString = match[2].replace(/\[|\]/g, '');
    const tags = tagsString.split(',').map(tag => tag.trim().replace(/"/g, '').replace(/'/g, ''));
    const content = match[3].trim();

    updates.push({
      date: parseDate(dateLabel),
      dateLabel,
      tags,
      content
    });
  }

  return updates;
}

// Convert markdown to HTML
function markdownToHtml(markdown) {
  return md.render(markdown);
}

// Generate a title from the first line of content
function generateTitle(content) {
  // Extract the first line that looks like a title (bold text or heading)
  const titlePattern = /^\s*(?:\*\*([^*]+)\*\*|(?:#{1,6})\s+(.+))/m;
  const match = content.match(titlePattern);
  
  if (match) {
    return match[1] || match[2];
  }
  
  // If no title pattern found, take the first line and truncate if needed
  const firstLine = content.split('\n')[0].trim();
  return firstLine.length > 100 ? `${firstLine.substring(0, 97)}...` : firstLine;
}

// Main function to generate the RSS feed
function generateRssFeed() {
  // Read the changelog MDX file
  const changelogContent = fs.readFileSync(changelogPath, 'utf8');
  
  // Extract updates from the changelog
  const updates = extractUpdates(changelogContent);
  
  // Create the RSS feed
  const feed = new RSS({
    title: siteConfig.title,
    description: siteConfig.description,
    feed_url: siteConfig.feed_url,
    site_url: siteConfig.site_url,
    image_url: siteConfig.image_url,
    language: siteConfig.language,
    ttl: siteConfig.ttl,
    generator: 'Flatfile RSS Generator'
  });
  
  // Add items to the feed
  updates.forEach(update => {
    const title = generateTitle(update.content);
    const html = markdownToHtml(update.content);
    
    feed.item({
      title: title,
      description: html,
      url: `${siteConfig.site_url}/changelog/platform#${update.dateLabel.replace(/[-]/g, '')}`,
      categories: update.tags,
      date: update.date,
      guid: `platform-${update.dateLabel}-${update.tags.join('-')}`
    });
  });
  
  // Write the RSS feed to a file
  const rssXml = feed.xml({ indent: true });
  fs.writeFileSync(outputPath, rssXml);
  
  console.log(`RSS feed generated at: ${outputPath}`);
}

// Run the generator
generateRssFeed(); 