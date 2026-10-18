import { desc, gte, sql, sum } from "drizzle-orm";
import { requireDb } from "../../db/client";
import { pageViewsDaily } from "../../db/schema";

export async function hit(day: string, path: string, country: string) {
  await requireDb().insert(pageViewsDaily).values({ day, path, country, views: 1 })
    .onConflictDoUpdate({ target: [pageViewsDaily.day, pageViewsDaily.path, pageViewsDaily.country], set: { views: sql`${pageViewsDaily.views} + 1` } });
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86400_000).toISOString().slice(0, 10);

export async function summary() {
  const db = requireDb();
  const since = daysAgo(29);
  const [byDay, topPaths, countries] = await Promise.all([
    db.select({ day: pageViewsDaily.day, n: sum(pageViewsDaily.views) }).from(pageViewsDaily).where(gte(pageViewsDaily.day, since)).groupBy(pageViewsDaily.day),
    db.select({ path: pageViewsDaily.path, n: sum(pageViewsDaily.views) }).from(pageViewsDaily).where(gte(pageViewsDaily.day, since)).groupBy(pageViewsDaily.path).orderBy(desc(sum(pageViewsDaily.views))).limit(5),
    db.select({ country: pageViewsDaily.country, n: sum(pageViewsDaily.views) }).from(pageViewsDaily).where(gte(pageViewsDaily.day, since)).groupBy(pageViewsDaily.country).orderBy(desc(sum(pageViewsDaily.views))).limit(4),
  ]);
  const map = new Map(byDay.map((r) => [r.day, Number(r.n)]));
  const series = Array.from({ length: 14 }, (_, i) => map.get(daysAgo(13 - i)) ?? 0);
  const total = (n: number) => Array.from({ length: n }, (_, i) => map.get(daysAgo(i)) ?? 0).reduce((a, b) => a + b, 0);
  return {
    series, total7: total(7), total30: total(30),
    topPaths: topPaths.map((r) => ({ path: r.path, n: Number(r.n) })),
    countries: countries.map((r) => ({ country: r.country, n: Number(r.n) })),
  };
}
