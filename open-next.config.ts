import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // No R2 incremental cache; use default in-memory for preview/deploy
});
