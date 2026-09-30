type ApiRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
  env?: Record<string, string | undefined>;
};

declare const process: { env: Record<string, string | undefined> };

type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
};

type ContributionResponse = {
  username: string;
  from: string;
  to: string;
  totalContributions: number;
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
  fetchedAt: string;
};

type GithubResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: ContributionResponse["weeks"];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
};

// ponytail: process-local cache is enough for a six-hour snapshot; use shared storage if scale requires it.
const cache = new Map<string, { expiresAt: number; value: ContributionResponse }>();
const cacheLifetime = 6 * 60 * 60 * 1000;

function queryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function validIsoDate(value: string | undefined) {
  return Boolean(value && !Number.isNaN(Date.parse(value)));
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const env = req.env || process.env;
  const username = queryValue(req.query?.username) || env.GITHUB_USERNAME || "Ryo2702";
  const from = queryValue(req.query?.from);
  const to = queryValue(req.query?.to);

  if (!/^[A-Za-z0-9-]{1,39}$/.test(username) || !from || !to || !validIsoDate(from) || !validIsoDate(to)) {
    return res.status(400).json({ error: "username, from, and to are required" });
  }

  const token = env.GITHUB_ACTIVITY || env.GITHUB_TOKEN;
  if (!token) {
    return res.status(503).json({ error: "GitHub activity credentials are not configured" });
  }

  const key = `${username}:${from}:${to}`;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=3600");
    return res.status(200).json(cached.value);
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "charles-pelayo-portfolio",
      },
      body: JSON.stringify({
        query: `query($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks { contributionDays { date contributionCount } }
              }
            }
          }
        }`,
        variables: { login: username, from, to },
      }),
    });

    const payload = (await response.json()) as GithubResponse;
    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;

    if (!response.ok || payload.errors?.length || !calendar) {
      return res.status(response.status === 404 ? 404 : 502).json({ error: payload.errors?.[0]?.message || "GitHub did not return contribution data" });
    }

    const result: ContributionResponse = {
      username,
      from,
      to,
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
      fetchedAt: new Date().toISOString(),
    };

    cache.set(key, { expiresAt: Date.now() + cacheLifetime, value: result });
    res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=3600");
    return res.status(200).json(result);
  } catch {
    return res.status(502).json({ error: "GitHub contribution request failed" });
  }
}
