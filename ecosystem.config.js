module.exports = {
  apps: [
    {
      name: "multiagente-flow",

      // binario real de Next
      script: "node_modules/next/dist/bin/next",

      // argumentos
      args: "start -p 3002",

      // 👉 cwd relativo (opcional pero recomendable)
      cwd: ".",

      exec_mode: "fork",
      instances: 1,

      autorestart: true,
      watch: false,

      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },

      max_memory_restart: "800M",

      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
