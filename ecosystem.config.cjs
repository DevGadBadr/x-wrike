module.exports = {
  apps: [
    {
      name: "xmanager-3008",
      cwd: "/root/Gad/web/Apps/x-wrike",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3008",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
