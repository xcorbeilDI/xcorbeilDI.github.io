import { defineConfig } from "astro/config";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const owner = process.env.GITHUB_REPOSITORY_OWNER;

const base = isGitHubActions && repoName ? `/${repoName}/` : "/";
const site = owner ? `https://${owner}.github.io` : undefined;

export default defineConfig({
  output: "static",
  base,
  site,
});
