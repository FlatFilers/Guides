function simpleMarkdownToHtml(markdown) {
  let htmlContent = markdown
    // Remove commit number patterns
    .replace(/\b[0-9a-f]{7}:\s/gim, "")
    // Headers, blockquotes, and other formatting
    .replace(
      /^## (.*$)/gim,
      "<h2 id='version_$1'><a href='#version_$1'>$1</a></h2>"
    )
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^#### (.*$)/gim, "<h5>$1</h5>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2'>")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .split("\n");

  // Process lists
  let inList = false;
  let listLevel = 0;
  for (let i = 0; i < htmlContent.length; i++) {
    const line = htmlContent[i];
    const trimmedLine = line.trim();
    const currentLevel = line.indexOf(trimmedLine) / 2; // Assuming 2 spaces for indentation

    if (/^- /.test(trimmedLine)) {
      if (!inList) {
        inList = true;
        listLevel = currentLevel;
        if (trimmedLine.includes("Updated dependencies")) {
          htmlContent[i] = "<strong>Updated dependencies</strong>";
        } else {
          htmlContent[i] = "<ul><li>" + trimmedLine.substring(2) + "</li>";
        }
      } else {
        if (trimmedLine.includes("Updated dependencies")) {
          htmlContent[i] = "<strong>Updated dependencies</strong>";
          htmlContent[i - 1] += "</li></ul>".repeat(listLevel + 1);
          inList = false;
          listLevel = 0;
        } else {
          htmlContent[i] = "<li>" + trimmedLine.substring(2) + "</li>";
        }
      }
    } else {
      if (inList) {
        htmlContent[i - 1] += "</li></ul>".repeat(listLevel + 1);
        inList = false;
        listLevel = 0;
      }
    }
  }
  if (inList) {
    htmlContent[htmlContent.length - 1] += "</li></ul>".repeat(listLevel + 1);
  }

  return htmlContent.join("\n");
}

let lastPath = window.location.pathname;

// Function to handle the route logic
function handleRouteChange(path) {
  console.log(`Route changed to: ${path}`);
  let segments = path.split("/");
  let lastSegment = segments[segments.length - 1];

  if (path.includes("changelog/sdks/")) {
    fetch(
      "https://raw.githubusercontent.com/FlatFilers/" +
        (path.includes("plugins")
          ? "flatfile-plugins"
          : "flatfile-core-libraries") +
        "/main/" +
        (path.includes("utils")
          ? "utils"
          : path.includes("plugins")
          ? "plugins"
          : "packages") +
        "/" +
        lastSegment +
        "/CHANGELOG.md"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((markdown) => {
        const htmlContent = simpleMarkdownToHtml(markdown);
        // Wrapping the converted HTML content in a div
        document.getElementById(
          "content-area"
        ).innerHTML = `<div class='mt-8 relative prose prose-gray dark:prose-invert'>${htmlContent}</div>`;
      })
      .catch((error) => {
        console.error("Fetching Markdown file failed:", error);
      });
  }
}

// Check the route on initial load
handleRouteChange(lastPath);

// Then set up an interval to check for route changes
setInterval(() => {
  const currentPath = window.location.pathname;
  if (currentPath !== lastPath) {
    lastPath = currentPath;
    handleRouteChange(currentPath);
  }
}, 1000); // Check every second
