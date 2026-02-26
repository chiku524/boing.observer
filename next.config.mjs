/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

// Optional: integrate OpenNext Cloudflare for local dev (bindings, etc.)
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
