export function formatLocation(job: any) {
  const parts = [job?.city, job?.state].filter(Boolean).join(" - ");
  return parts ? `${parts}${job?.country ? ` (${job.country})` : ""}` : "—";
}
