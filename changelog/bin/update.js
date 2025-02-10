const fs = require('fs');
const path = require('path');

/**
 * Create Changelog File Script
 * 
 * This script combines multiple MDX files from a specified input directory into a single output file.
 * It also inserts monthly headers based on the filenames and includes a provided header file at the top.
 * 
 * Usage: node update.js <inputDir> <outputFile> <type>
 * 
 * Parameters:
 *   <type> - The type of header to use ('platform', 'libraries', or 'plugins').
 *   <inputDir>  - The directory containing the input .mdx files. Files should be named in YYYYMMDD.mdx format.
 *   <outputFile> - The path to the output .mdx file where the combined content will be written.
 * 
 * Example:
 *   node update.js ./input ./output/combined.mdx libraries
 * 
 */

function formatDate(year, month, day) {
  const paddedMonth = month.toString().padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');
  return `${paddedMonth}-${paddedDay}-${year}`;
}

function getHeader(type) {
  switch (type) {
    case 'libraries':
      return {
        title: "SDKs",
        description: "Notable additions and updates to Flatfile core libraries",
        icon: "cube"
      };
    case 'platform':
      return {
        title: "Platform",
        description: "Notable additions and updates to the Flatfile platform",
        icon: "layer-group"
      };
    case 'plugins':
      return {
        title: "Plugins",
        description: "Notable additions and updates to Flatfile plugins",
        icon: "plug"
      };
    case 'misc':
      return {
        title: "General Updates",
        description: "All other updates and changes",
        icon: "check-circle"
      };
    default:
      throw new Error("Invalid type");
  }
}

function readMdxFiles(dir) {
  return fs.readdirSync(dir).filter(file => file.endsWith('.mdx'));
}

function transformMdToMdx(date, file) {
  const cleanedDate = date.replace(/^### /, '').trim()
  const rawUpdates = file.split('\n## ')

  const formattedUpdates = rawUpdates.map((section) => {
      const splitSection = section.split('\n')
      const chip = splitSection.shift().replace('## ', '').trim()
      const text = splitSection.join('\n').trim()

      return text.length > 30 ? `<Update label="${cleanedDate}" description="${chip}">\n${text}\n</Update>` : ''
  })

  return formattedUpdates.filter(Boolean).join('\n\n')
}

function extractDateFromFilename(filename) {
  const match = filename.match(/^(\d{8})/);
  if (!match) {
    console.warn(`Could not extract date from filename: ${filename}`);
    return null;
  }
  return match[1];
}

function aggregateFilesByMonthAndYear(dir, files) {
  // Sort files by date in reverse chronological order
  const sortedFiles = files.sort((a, b) => {
    const dateA = extractDateFromFilename(a);
    const dateB = extractDateFromFilename(b);
    
    if (!dateA || !dateB) return 0;
    return dateB.localeCompare(dateA);
  });

  const aggregatedData = {};

  sortedFiles.forEach(file => {
    const dateStr = extractDateFromFilename(file);
    if (!dateStr) return;
    
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const formattedDate = formatDate(year, month, day);
    const monthYear = `${year}-${month}`; // Changed to YYYY-MM format for sorting

    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const date = lines.shift();
    const transformedContent = transformMdToMdx(formattedDate, lines.join('\n'));
    

    if (!aggregatedData[monthYear]) {
      aggregatedData[monthYear] = [];
    }

    let dayEntry = aggregatedData[monthYear].find(entry => entry.day === day);
    if (!dayEntry) {
      dayEntry = { 
        day, 
        content: `### ${formattedDate}`, // Changed to YYYY-MM-DD format
        timestamp: dateStr // Store full timestamp for sorting
      };
      aggregatedData[monthYear].push(dayEntry);
    }

    dayEntry.content += '\n\n' + transformedContent;
  });

  // Sort entries within each month in reverse chronological order
  Object.values(aggregatedData).forEach(monthEntries => {
    monthEntries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  });

  return aggregatedData;
}

function writeAggregatedFile(type, aggregatedData, outputFile) {
  // Get all entries in reverse chronological order, flattened
  const allEntries = Object.values(aggregatedData)
    .flat()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  
  // Extract just the update content without the date headers
  const outputContent = allEntries
    .map(entry => {
      const parts = entry.content.split('\n\n');
      return parts.slice(1).join('\n\n'); // Skip the date header
    })
    .filter(Boolean)
    .join('\n\n');

  const header = getHeader(type);
  const headerContent = `---
title: ${header.title}
description: "${header.description}"
icon: "${header.icon}"
---`;

  fs.writeFileSync(outputFile, `${headerContent}\n\n${outputContent}`, 'utf8');
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error('Usage: node update.js <type> <inputDir> <outputFile>');
    process.exit(1);
  }

  const [type, sourceDir, outputFile] = args;

  const files = readMdxFiles(sourceDir);
  const data = aggregateFilesByMonthAndYear(sourceDir, files);
  writeAggregatedFile(type, data, outputFile);
}

main();