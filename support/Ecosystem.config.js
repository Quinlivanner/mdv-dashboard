module.exports = {
  apps: [
    {
      name: "github-hook-neomuse-frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "70M",
    },
  ],
};
