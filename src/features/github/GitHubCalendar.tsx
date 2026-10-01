import { useEffect, useMemo, useState } from "react";
import { ChevronDown, CircleAlert, ExternalLink, GitBranch } from "lucide-react";
import { site } from "../../data/portfolio";
import { Section } from "../../components/shared/Section";
import { fetchContributions, getCalendarRange, type ContributionResponse } from "./githubApi";

function formatDate(value: string) {
  return new Date(value.includes("T") ? value : `${value}T12:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function GitHubCalendar() {
  const [range, setRange] = useState("last-year");
  const [state, setState] = useState<{ status: "idle" | "loading" | "success" | "error"; data?: ContributionResponse; message?: string }>({
    status: "idle",
  });
  const currentYear = new Date().getUTCFullYear();
  const rangeOptions = ["last-year", String(currentYear - 1), String(currentYear - 2)];
  const selectedRange = useMemo(() => getCalendarRange(range), [range]);
  const githubUsername = state.data?.username || site.githubUsername;

  useEffect(() => {
    const controller = new AbortController();

    setState({ status: "loading" });
    fetchContributions(selectedRange, controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ status: "error", message: error instanceof Error ? error.message : "Contribution data is unavailable right now." });
      });

    return () => controller.abort();
  }, [selectedRange.from, selectedRange.to]);

  return (
    <Section
      id="github"
      eyebrow="08 / GitHub activity"
      title="The public rhythm of the work."
      intro="Live contribution data is requested from GitHub through a server-side endpoint. No response means no invented total."
    >
      <div className="github-card">
        <div className="github-card-topline">
          <div>
            <div className="github-title-line">
              <GitBranch size={24} aria-hidden="true" />
              <h3>{githubUsername}</h3>
            </div>
            <p className="muted-copy">Contributions / {selectedRange.label}</p>
          </div>
          <label className="range-select">
            <span>Range</span>
            <select value={range} onChange={(event) => setRange(event.target.value)}>
              {rangeOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "last-year" ? "Last 12 months" : option}
                </option>
              ))}
            </select>
            <ChevronDown size={17} aria-hidden="true" />
          </label>
        </div>

        {state.status === "loading" || state.status === "idle" ? <ContributionSkeleton /> : null}
        {state.status === "error" ? <ContributionError message={state.message} /> : null}
        {state.status === "success" && state.data ? <ContributionData data={state.data} /> : null}
      </div>
    </Section>
  );
}

function ContributionSkeleton() {
  return (
    <div className="calendar-loading" aria-label="Loading contribution activity">
      <div className="calendar-skeleton" aria-hidden="true">
        {Array.from({ length: 52 }, (_, week) => (
          <div className="skeleton-week" key={week}>
            {Array.from({ length: 7 }, (_, day) => <span className="skeleton-cell" key={day} />)}
          </div>
        ))}
      </div>
      <div className="skeleton-copy" aria-hidden="true">
        <span />
        <span />
      </div>
    </div>
  );
}

function ContributionError({ message }: { message?: string }) {
  return (
    <div className="github-error">
      <CircleAlert size={23} aria-hidden="true" />
      <div>
        <h3>Activity unavailable</h3>
        <p>{message || "The live contribution snapshot could not be loaded."}</p>
        <a className="text-link" href={site.github} target="_blank" rel="noreferrer">
          Open GitHub profile <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function ContributionData({ data }: { data: ContributionResponse }) {
  const days = data.weeks.flatMap((week) => week.contributionDays);
  const rangeLabel = `${formatDate(data.from)} — ${formatDate(data.to)}`;
  const profileUrl = `https://github.com/${data.username}`;

  return (
    <>
      <div className="github-summary">
        <div>
          <strong>{data.totalContributions.toLocaleString()}</strong>
          <span>contributions</span>
        </div>
        <div>
          <strong>{rangeLabel}</strong>
          <span>selected range</span>
        </div>
        <a className="text-link" href={profileUrl} target="_blank" rel="noreferrer">
          View profile <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="calendar-scroll" tabIndex={0} aria-label="Horizontally scrollable GitHub contribution calendar">
        <div className="calendar-grid" aria-label={`GitHub contributions from ${rangeLabel}`}>
          {data.weeks.map((week, index) => (
            <div className="calendar-week" key={`${week.contributionDays[0]?.date || "week"}-${index}`}>
              {week.contributionDays.map((day) => (
                <button
                  className={`contribution-cell ${day.contributionCount > 0 ? "is-filled" : ""}`}
                  type="button"
                  key={day.date}
                  title={`${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                  aria-label={`${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-legend">
        <span>Less</span>
        <span className="contribution-cell" aria-hidden="true" />
        <span className="contribution-cell is-filled" aria-hidden="true" />
        <span>More</span>
      </div>
      <details className="calendar-text-alternative">
        <summary>Open text alternative</summary>
        <ul>
          {days.map((day) => (
            <li key={day.date}>
              <strong>{formatDate(day.date)}</strong>: {day.contributionCount} contribution{day.contributionCount === 1 ? "" : "s"}
            </li>
          ))}
        </ul>
      </details>
      <p className="github-updated">Last successful update: {formatDateTime(data.fetchedAt)}</p>
    </>
  );
}
