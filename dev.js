import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start the Vite dev server for the client
const vite = spawn("npx", ["vite", "client"], {
  stdio: "inherit",
  shell: true,
});

// Start the server using tsx
const server = spawn("npx", ["tsx", "server/index.ts"], {
  stdio: "inherit",
  shell: true,
});

// Handle process termination
process.on("SIGINT", () => {
  vite.kill();
  server.kill();
  process.exit();
});

process.on("SIGTERM", () => {
  vite.kill();
  server.kill();
  process.exit();
});
