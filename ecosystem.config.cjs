module.exports = {
  apps: [
    {
      name: "upmaths",
      script: "node_modules/.bin/next",
      args: "start -p 3001 -H 127.0.0.1",
      cwd: "/var/www/upmaths",
      interpreter: "none",
      max_restarts: 3,
      watch: false,
    },
  ],
};
