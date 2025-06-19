# Mintlify Starter Kit

Click on `Use this template` to copy the Mintlify starter kit. The starter kit contains examples including

- Guide pages
- Navigation
- Customizations
- API Reference pages
- Use of popular components

### 👩‍💻 Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mint
```

Run the following command at the root of your documentation (where mint.json is)

```
mint dev
```

### 😎 Publishing Changes

Changes will be deployed to production automatically after pushing to the default branch.

You can also preview changes using PRs, which generates a preview link of the docs.

### 😭 Troubleshooting

- Page loads as a 404 - Make sure you are running in a folder with `mint.json`
- Things look different between production and local - Run `npm i -g mint@latest`
- Check the Mintlify [Quickstart Troubleshooting docs](https://mintlify.com/docs/quickstart#troubleshooting) and [Installation docs](https://mintlify.com/docs/installation#issue-encountering-an-unknown-error)


### RSS Feed

`npm run rss` will update the rss feed hosted at the public/changelog/platform/feed.xml.
Commit the changes and merge to update https://raw.githubusercontent.com/FlatFilers/Guides/refs/heads/main/public/changelog/platform/feed.xml. This action could be automated. This feed should be removed when Mintlify releases their RSS feature.