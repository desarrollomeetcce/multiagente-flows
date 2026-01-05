module.exports = {
  apps: [
    {
      name: "multiagente-flow", // cámbialo si quieres
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3002",
      cwd: "/var/www/multiagente", // 🔴 ruta absoluta del proyecto
      exec_mode: "fork",
      instances: 1, // Next maneja el render, no cluster aquí
      autorestart: true,
      watch: false,

      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },

      max_memory_restart: "800M",

      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
