export type ContributionDay = { date: string; contributionCount: number };
export type ContributionWeek = { contributionDays: ContributionDay[] };
export type ContributionResponse = {
  username: string;
  from: string;
  to: string;
  totalContributions: number;
  weeks: ContributionWeek[];
  fetchedAt: string;
};

export type CalendarRange = {
  from: string;
  to: string;
  label: string;
};

export function getCalendarRange(value: string): CalendarRange {
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
  const start = new Date(end);

  if (value === "last-year") {
    start.setUTCFullYear(start.getUTCFullYear() - 1);
  } else {
    const year = Number(value);
    start.setUTCFullYear(year, 0, 1);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCFullYear(year, 11, 31);
  }

  return {
    from: start.toISOString(),
    to: end.toISOString(),
    label: value === "last-year" ? "Last 12 months" : value,
  };
}

export async function fetchContributions(range: CalendarRange, signal: AbortSignal): Promise<ContributionResponse> {
  const params = new URLSearchParams({ from: range.from, to: range.to });
  const response = await fetch(`/api/github-contributions?${params.toString()}`, { signal });
  if (!response.ok) throw new Error("Contribution data is unavailable right now.");

  const payload = (await response.json()) as ContributionResponse;
  if (!Array.isArray(payload.weeks) || typeof payload.totalContributions !== "number") {
    throw new Error("The contribution response was incomplete.");
  }
  return payload;
}
