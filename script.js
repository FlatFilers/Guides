const simpleMarkdownToHtml = (markdown) => {
  const htmlContent = applyBasicFormatting(markdown).split("\n");
  return processLists(htmlContent).join("\n");
};

const applyBasicFormatting = (markdown) => {
  return markdown
    .replace(/\b[0-9a-f]{7}:\s/gim, "")
    .replace(
      /^## (.*$)/gim,
      "<h2 id='version_$1'><br/><a href='#version_$1'>$1</a></h2>",
    )
    .replace(/^### (.*$)/gim, "<h3 style='margin-top: 15px'>$1</h3>")
    .replace(/^#### (.*$)/gim, "<code>$1</code>")
    .replace(/^# (.*$)/gim, "")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2'>")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>");
};

const processLists = (htmlContent) => {
  let inList = false;
  let listLevel = 0;

  return htmlContent.map((line, index, array) => {
    const { processedLine, newInList, newListLevel } = processListItem(
      line,
      inList,
      listLevel,
    );
    const closingTags = getClosingTags(
      inList,
      listLevel,
      newInList,
      newListLevel,
      index === array.length - 1,
    );

    inList = newInList;
    listLevel = newListLevel;

    return closingTags + processedLine;
  });
};

const processListItem = (line, inList, listLevel) => {
  const trimmedLine = line.trim();
  const currentLevel = line.indexOf(trimmedLine) / 2;

  if (/^- /.test(trimmedLine)) {
    if (trimmedLine.includes("Updated dependencies")) {
      return {
        processedLine: "<strong>Updated dependencies</strong>",
        newInList: false,
        newListLevel: 0,
      };
    }
    if (!inList) {
      return {
        processedLine: "<ul><li>" + trimmedLine.substring(2) + "</li>",
        newInList: true,
        newListLevel: currentLevel,
      };
    }
    return {
      processedLine: "<li>" + trimmedLine.substring(2) + "</li>",
      newInList: true,
      newListLevel: currentLevel,
    };
  }
  return { processedLine: line, newInList: false, newListLevel: 0 };
};

const getClosingTags = (
  inList,
  listLevel,
  newInList,
  newListLevel,
  isLastLine,
) => {
  if (inList && (!newInList || isLastLine)) {
    return "</li></ul>".repeat(listLevel + 1);
  }
  return "";
};

let lastPath = window.location.pathname;

// Function to handle the route logic
const handleRouteChange = (path) => {
  console.log(`Route changed to: ${path}`);
  const segments = path.split("/");
  const lastSegment = segments[segments.length - 1];

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
        "/CHANGELOG.md",
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
        document.getElementById("dynamic-content").innerHTML =
          `<div class='mt-8 relative prose prose-gray dark:prose-invert'>${htmlContent}</div>`;
      })
      .catch((error) => {
        console.error("Fetching Markdown file failed:", error);
      });
  }
};

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

const addIubendaScripts = () => {
  // Create and add the main script
  const mainScript = document.createElement("script");
  mainScript.type = "text/javascript";
  const scriptContent = `
    var _iub = _iub || [];
  _iub.csConfiguration = {
    "countryDetection": true,
    "enableRemoteConsent": true,
    "enableUspr": true,
    "gdprAppliesGlobally": false,
    "usprPurposes": "s",
    "lang": "en",
    "perPurposeConsent": true,
    "siteId": 1225976,
    "cookiePolicyId": 13410267,
    "privacyPolicyUrl": "/privacy/",
    "cookiePolicyInOtherWindow": true,
    "banner": {
      "acceptButtonColor": "#0073CE",
      "acceptButtonDisplay": true,
      "backgroundColor": "#FFFFFF",
      "brandBackgroundColor": "#FFFFFF",
      "brandTextColor": "#000000",
      "closeButtonDisplay": false,
      "customizeButtonCaptionColor": "#0073CE",
      "customizeButtonColor": "#FFFFFF",
      "customizeButtonDisplay": true,
      "explicitWithdrawal": true,
      "fontSizeBody": "12px",
      "listPurposes": false,
      "logo": "https://images.ctfassets.net/hjneo4qi4goj/33l3kWmPd9vgl1WH3m9Jsq/13861635730a1b8af383a8be8932f1d6/flatfile-black.svg",
      "linksColor": "#070707",
      "ownerName": "Flatfile",
      "position": "float-bottom-left",
      "rejectButtonCaptionColor": "#000000",
      "rejectButtonColor": "#EFEFEF",
      "rejectButtonDisplay": true,
      "showPurposesToggles": false,
      "slideDown": false,
      "textColor": "#070707",
      "usesThirdParties": false
    },
    "callback": {
      onPreferenceExpressedOrNotNeeded: function (preference) {
        dataLayer.push({
          iubenda_uspr_s_opted_out: _iub.cs.api.getPreferences().uspr.s,
        });
        var otherPreferences = _iub.cs.api.getPreferences();
        if (otherPreferences) {
          var usprPreferences = otherPreferences.uspr;
          if (usprPreferences) {
            for (var purposeName in usprPreferences) {
              if (usprPreferences[purposeName]) {
                dataLayer.push({
                  event: 'iubenda_consent_given_purpose_' + purposeName,
                });
              }
            }
          }
        }
        if (!preference) {
          dataLayer.push({
            event: 'iubenda_preference_not_needed',
          });
        }
        else if (preference.consent === true) {
          dataLayer.push({
            event: 'iubenda_consent_given',
          });
        }
        else if (preference.consent === false) {
          dataLayer.push({
            event: 'iubenda_consent_rejected',
          });
          window.VWO = window.VWO || [];
          window.VWO.push(['optOutVisitor']);
          console.log('Consent rejected');
        }
        else if (preference.purposes) {
          for (var purposeId in preference.purposes) {
            if (preference.purposes[purposeId]) {
              dataLayer.push({
                event: 'iubenda_consent_given_purpose_' + purposeId,
              });
            }
          }
        }
      }
    }
  };
  `;
  mainScript.textContent = scriptContent;
  document.head.appendChild(mainScript);

  const addScriptIfNotExists = (src, options = {}) => {
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      Object.assign(script, options);
      document.head.appendChild(script);
    }
  };

  // Add sync script
  addScriptIfNotExists("//cs.iubenda.com/sync/1225976.js");

  // Add stub script
  addScriptIfNotExists("//cdn.iubenda.com/cs/gpp/stub.js");

  // Add iubenda_cs script
  addScriptIfNotExists("//cdn.iubenda.com/cs/iubenda_cs.js", {
    charset: "UTF-8",
    async: true,
  });
};

// Call the function to add the scripts
addIubendaScripts();
