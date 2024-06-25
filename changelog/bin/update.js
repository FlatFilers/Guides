const fs = require('fs');
const path = require('path');

/**
 * Create Changelog File Script
 * 
 * This script combines multiple MDX files from a specified input directory into a single output file.
 * It also inserts monthly headers based on the filenames and includes a provided header file at the top.
 * 
 * Usage: node combineMdxFiles.js <inputDir> <outputFile> <type>
 * 
 * Parameters:
 *   <type> - The type of header to use ('platform', 'libraries', or 'plugins').
 *   <inputDir>  - The directory containing the input .mdx files. Files should be named in MMDDYYYY.mdx format.
 *   <outputFile> - The path to the output .mdx file where the combined content will be written.
 * 
 * Example:
 *   node combineMdxFiles.js ./input ./output/combined.mdx libraries
 * 
 */

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node combineMdxFiles.js <inputDir> <outputFile> <type>');
  process.exit(1);
}

const [type, inputDir, outputFile] = args;

const getHeader = (type) => {
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
    default:
      throw new Error("Invalid type");
  }
};

const header = getHeader(type);
const headerContent = `---
title: ${header.title}
description: "${header.description}"
icon: "${header.icon}"
---`;

const getMonthName = (month) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[parseInt(month, 10) - 1];
};

const readFileContent = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
};

const writeOutputFile = (content) => {
  fs.writeFileSync(outputFile, content, 'utf8');
};

const processFiles = () => {
  const files = fs.readdirSync(inputDir);

  const mdxFiles = files
    .filter((file) => path.extname(file) === '.mdx')
    .sort((a, b) => {
      const dateA = new Date(a.slice(4, 8), a.slice(0, 2) - 1, a.slice(2, 4));
      const dateB = new Date(b.slice(4, 8), b.slice(0, 2) - 1, b.slice(2, 4));
      return dateB - dateA;
    });

  let combinedContent = headerContent + '\n';
  let currentMonth = '';

  mdxFiles.forEach((file) => {
    const filePath = path.join(inputDir, file);
    const content = readFileContent(filePath);

    const month = file.slice(0, 2);
    const year = file.slice(4, 8);
    const monthYear = `${getMonthName(month)} ${year}`;

    if (monthYear !== currentMonth) {
      combinedContent += `\n## ${monthYear}\n\n`;
      currentMonth = monthYear;
    }

    combinedContent += content + '\n';
  });

  writeOutputFile(combinedContent);
};

const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

processFiles();
