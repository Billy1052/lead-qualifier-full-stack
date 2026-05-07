import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  // Replace with your project ref from trigger.dev dashboard
  project: "proj_rwaevsenhzsmgkhvxgep",
  dirs: ["./Workflows"],
  maxDuration: 60,
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 2,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
    },
  },
});
