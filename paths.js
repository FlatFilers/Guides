const websitePaths = [
    "/guides/upgrade/v2_upgrade",
    "/upgrade/v2_repo",
    "/developer-tools/mapping-libraries/flatfile-mapping-python",
    "/plugins",
    "/plugins/extractors/xlsx-extractor", // FIX
    "/plugins/extractors/json-extractor",
    "/plugins/extractors/xml-extractor",
    "/plugins/extractors/zip-extractor",
    "/plugins/extractors/delimiter-extractor",
    "/plugins/extractors/pdf-extractor",
    "/plugins/transform/record-hook", // FIX
    "/plugins/transform/autocast",
    "/plugins/transform/dedupe",
    "/plugins/automations/automap",
    "/plugins/export/workbook",
    "/plugins/export/webhook",
    "/plugins/schemas/convert-json-schema",
    "/plugins/schemas/convert-yaml-schema",
    "/plugins/schemas/convert-sql-ddl",
    "/plugins/schemas/convert-openapi",
    "/plugins/migrations/dxp-configure",
    "/plugins/core/job-handler",
    "/plugins/core/space-configure",
    "/plugins/utils/extractor",
    "/plugins/utils/file-buffer",
    "/plugins/utils/response-rejection",
    "/overview",
    "/starter-projects", // FIX
    "/changelog/platform",
    "/changelog/sdks",
    "/changelog/sdks/plugins/highlights",
    "/changelog/sdks/core/cli",
    "/changelog/sdks/core/listener",
    "/changelog/sdks/wrappers/javascript",
    "/changelog/sdks/wrappers/react",
    "/changelog/sdks/wrappers/angular",
    "/changelog/sdks/wrappers/vue",
    "/changelog/sdks/plugins/extractors/xlsx-extractor",
    "/changelog/sdks/plugins/extractors/json-extractor",
    "/changelog/sdks/plugins/extractors/xml-extractor",
    "/changelog/sdks/plugins/extractors/zip-extractor",
    "/changelog/sdks/plugins/extractors/delimiter-extractor",
    "/changelog/sdks/plugins/extractors/pdf-extractor",
    "/changelog/sdks/plugins/transform/record-hook",
    "/changelog/sdks/plugins/transform/autocast",
    "/changelog/sdks/plugins/transform/dedupe",
    "/changelog/sdks/plugins/automations/automap",
    "/changelog/sdks/plugins/export/export-workbook",
    "/changelog/sdks/plugins/export/webhook-egress",
    "/changelog/sdks/plugins/schemas/json-schema",
    "/changelog/sdks/plugins/schemas/yaml-schema",
    "/changelog/sdks/plugins/schemas/sql-ddl-converter",
    "/changelog/sdks/plugins/schemas/openapi-schema",
    "/changelog/sdks/plugins/migrations/dxp-configure",
    "/changelog/sdks/plugins/core/job-handler",
    "/changelog/sdks/plugins/core/space-configure",
    "/changelog/sdks/plugins/utils/extractor",
    "/changelog/sdks/plugins/utils/file-buffer",
    "/changelog/sdks/plugins/utils/response-rejection",
    "/apps/embedding/overview", // FIX
    "/apps/embedding/javascript/guide", // FIX
    "/apps/embedding/javascript/new_space_quickstart", // FIX
    "/apps/embedding/javascript/new_space", // FIX  
    "/apps/embedding/javascript/reuse_space", // FIX
    "/apps/embedding/react/guide", // FIX
    "/apps/embedding/react/new_space_quickstart", // FIX
    "/apps/embedding/react/components", // FIX
    "/apps/embedding/react/legacy", // FIX
    "/apps/embedding/vue/guide", // FIX
    "/apps/embedding/vue/new_space", // FIX
    "/apps/embedding/vue/reuse_space", // FIX
    "/apps/embedding/angular/guide", // FIX
    "/apps/embedding/angular/new_space_quickstart", // FIX
    "/apps/embedding/angular/new_space", // FIX
    "/apps/embedding/angular/reuse_space", // FIX
    "/apps/embedding/reference/simple", // FIX  
    "/apps/embedding/reference/common", // FIX
    "/apps/embedding/reference/advanced", // FIX
    "/apps/projects/overview", // FIX
    "/apps/workbooks", // FIX
    "/apps/custom/tutorial-landing", // FIX
    "/apps/custom/meet-the-listener", // FIX
    "/apps/custom/meet-the-workbook", // FIX
    "/apps/custom/add-data-transformation", // FIX
    "/apps/custom/submit-action", // FIX
    "/apps/custom/deploying", // FIX
    "/guides/handling-data",
    "/guides/actions",
    "/guides/dynamic-configurations",
    "/guides/namespaces",
    "/guides/metadata",
    "/guides/egress",
    "/guides/theming",
    "/guides/guest_sidebar",
    "/guides/documents",
    "/guides/secrets",
    "/guides/automap",
    "/guides/localization",
    "/guides/additional-fields",
    "/guides/flatfile_query_language",
    "/guides/data-retention",
    "/guides/api",
    "/guides/multi-part_jobs",
    "/guides/ai",
    "/guides/bubble-io",
    "/orchestration/listeners",
    "/orchestration/events",
    "/orchestration/actions",
    "/orchestration/jobs",
    "/blueprint/overview",
    "/blueprint/sheet-options",
    "/blueprint/field-types",
    "/blueprint/constraints",
    "/blueprint/relationships",
    "/blueprint/access",
    "/upgrade/overview",
    "/reference/icons",
    "/upgrade/v2_upgrade",
    "/upgrade/v2_upgrade_concepts",
    "/upgrade/v2_repo",
    "/upgrade/v3_upgrade",
    "/upgrade/v3_dxp_configure",
    "/upgrade/v3_repo",
    "/developer-tools/developing/running-local",
    "/developer-tools/developing/check-for-agents",
    "/developer-tools/deploying",
    "/developer-tools/environment",
    "/developer-tools/spaces",
    "/developer-tools/security/authentication",
    "/developer-tools/security/account-token",
    "/developer-tools/security/roles-and-permissions",
    "/developer-tools/core-libraries/flatfile",
    "/developer-tools/core-libraries/listener",
    "/developer-tools/versioning",
    "/developer-tools/core-libraries/api",
    "/developer-tools/core-libraries/api-python",
    "/developer-tools/core-libraries/api-go",
    "/developer-tools/core-libraries/api-java",
    "/developer-tools/core-libraries/wrappers/vanilla",
    "/developer-tools/core-libraries/wrappers/react",
    "/developer-tools/core-libraries/wrappers/angular",
    "/developer-tools/core-libraries/wrappers/vuejs",
    "/developer-tools/mapping-libraries/flatfile-mapping-python"
];

// Define the base URL
const baseURL = 'http://localhost:3001';

(async () => {
const [open, { default: readline }] = await Promise.all([
    import('open').then(module => module.default || module),
    import('readline')
]);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to open paths one by one
async function openPaths(paths) {
    for (const path of paths) {
        // Open the current path in the default browser
        await open(`${baseURL}${path}`);
        
        // Wait for user input to proceed to the next path
        await new Promise(resolve => {
            console.log(`Opening ${path}`);
            rl.question('Next? (Press Enter to continue)', () => {
                resolve();
            });
        });
    }
    rl.close();
}

// Start the process
await openPaths(websitePaths);
})().catch(console.error);
