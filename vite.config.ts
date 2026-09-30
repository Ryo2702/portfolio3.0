import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import githubContributions from "./api/github-contributions.ts";

type DevResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): DevResponse;
  json(body: unknown): void;
};

function githubApiDevPlugin(env: Record<string, string>) {
  return {
    name: "github-api-dev",
    configureServer(server: { middlewares: { use: (path: string, handler: (req: any, res: any, next: () => void) => unknown) => void } }) {
      server.middlewares.use("/api/github-contributions", async (req, res, next) => {
        if (!req.url) return next();

        const query = Object.fromEntries(new URL(req.url, "http://localhost").searchParams.entries());
        const response: DevResponse = {
          setHeader: (name, value) => res.setHeader(name, value),
          status: (code) => {
            res.statusCode = code;
            return response;
          },
          json: (body) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(body));
          },
        };

        await githubContributions({ method: req.method, query, env }, response);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [githubApiDevPlugin(env), react(), tailwindcss()],
  };
});
