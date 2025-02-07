const fs = require("fs");
const path = require("path");

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

function getMonthName(month) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex = parseInt(month, 10) - 1;
  return monthNames[monthIndex];
}

function getHeader(type) {
  switch (type) {
    case "libraries":
      return {
        title: "SDKs",
        description: "Notable additions and updates to Flatfile core libraries",
        icon: "cube",
      };
    case "platform":
      return {
        title: "Platform",
        description: "Notable additions and updates to the Flatfile platform",
        icon: "layer-group",
      };
    case "plugins":
      return {
        title: "Plugins",
        description: "Notable additions and updates to Flatfile plugins",
        icon: "plug",
      };
    case "misc":
      return {
        title: "General Updates",
        description: "All other updates and changes",
        icon: "check-circle",
      };
    default:
      throw new Error("Invalid type");
  }
}

function readMdxFiles(dir) {
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
}

function transformMdToMdx(file) {
  const rawUpdates = file.split("\n## ");

  const formattedUpdates = rawUpdates.map((section) => {
    const splitSection = section.split("\n");
    const chip = splitSection.shift().replace("## ", "").trim();
    const text = splitSection.join("\n");

    return text.length > 30
      ? `
  <div style={{ display: "table-row", width: "auto" }}>
    <Snippet file="chips/${chip}.mdx" />
    <div style={{ float: "left", display: "table-column", paddingLeft: "30px", width: "calc(80% - 30px)" }}>
      ${text.replace(/\n/g, "\n      ")}
    </div>
  </div>`
      : "";
  });

  return `<div style={{ display: "table", width: "auto" }}>${formattedUpdates.join("\n")}\n</div>`;
}

function aggregateFilesByMonthAndYear(dir, files) {
  const aggregatedData = {};

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const date = lines.shift();
    const transformedContent = transformMdToMdx(lines.join("\n"));

    const dateMatch = file.match(/^(\d{4})(\d{2})(\d{2})/);
    if (!dateMatch) {
      console.warn(`Skipping file with invalid name format: ${file}`);
      return;
    }

    const [, year, month, day] = dateMatch;
    const monthYear = `${getMonthName(month)} ${year}`;

    if (!aggregatedData[monthYear]) {
      aggregatedData[monthYear] = [];
    }

    let dayEntry = aggregatedData[monthYear].find((entry) => entry.day === day);
    if (!dayEntry) {
      dayEntry = { day, content: date };
      aggregatedData[monthYear].push(dayEntry);
    }

    dayEntry.content += "\n\n" + transformedContent;
  });

  return aggregatedData;
}

function adjustHeaderLevels(content, additionalHashes) {
  return content.replace(/(### )/g, `${additionalHashes}$1`);
}

function writeAggregatedFile(type, aggregatedData, outputFile) {
  let outputContent = "";

  // Sort the keys in reverse chronological order
  const sortedKeys = Object.keys(aggregatedData).sort((a, b) => {
    const [monthA, yearA] = a.split(" ");
    const [monthB, yearB] = b.split(" ");
    const dateA = new Date(`${yearA}-${monthA}-01`);
    const dateB = new Date(`${yearB}-${monthB}-01`);
    return dateB - dateA;
  });

  sortedKeys.forEach((monthYear, index) => {
    const entryCount = aggregatedData[monthYear].length;
    const header = index < 3 ? monthYear : `${monthYear} (${entryCount})`;

    outputContent += `## ${header}\n\n`;

    // Sort entries within the month in reverse chronological order
    const sortedEntries = aggregatedData[monthYear].sort(
      (a, b) => b.day - a.day,
    );

    if (index >= 3) {
      sortedEntries.forEach((entry) => {
        entry.content = adjustHeaderLevels(entry.content, "##");
      });
    }

    outputContent += sortedEntries.map((entry) => entry.content).join("\n\n");
    outputContent += "\n\n";
  });

  const header = getHeader(type);
  const headerContent = `---
title: ${header.title}
description: "${header.description}"
icon: "${header.icon}"
---`;

  fs.writeFileSync(outputFile, `${headerContent}\n\n${outputContent}`, "utf8");
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("Usage: node update.js <type> <inputDir> <outputFile>");
    process.exit(1);
  }

  const [type, sourceDir, outputFile] = args;

  const files = readMdxFiles(sourceDir);
  const data = aggregateFilesByMonthAndYear(sourceDir, files);
  writeAggregatedFile(type, data, outputFile);
}

main();
