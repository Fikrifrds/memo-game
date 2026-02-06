/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? "/memo-game" : "",
  assetPrefix: process.env.GITHUB_PAGES === "true" ? "/memo-game/" : "",
};

export default nextConfig;
