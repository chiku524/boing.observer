"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useNetwork } from "@/context/network-context";
import { fetchChainHeight, fetchBlockByHeight } from "@/lib/rpc-methods";
import type { Block } from "@/lib/rpc-types";
import { getFriendlyRpcErrorMessage } from "@/lib/rpc-status";

const BLOCKS_TO_SAMPLE = 30;
const REFRESH_INTERVAL_MS = 30_000;

interface ChartPoint {
  height: number;
  blockTimeSec: number | null;
  txCount: number;
}

export function NetworkCharts() {
  const { network } = useNetwork();
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const h = await fetchChainHeight(network);
      const heights = Array.from(
        { length: BLOCKS_TO_SAMPLE },
        (_, i) => Math.max(0, h - i)
      );
      const blocks = await Promise.all(
        heights.map((height) => fetchBlockByHeight(network, height))
      );
      const valid = blocks.filter(
        (b): b is Block => b != null && "hash" in b && "header" in b
      );
      const sorted = [...valid].sort(
        (a, b) => (a.header?.height ?? 0) - (b.header?.height ?? 0)
      );

      const points: ChartPoint[] = sorted.map((b, i) => {
        const ts = b.header?.timestamp != null ? Number(b.header.timestamp) : 0;
        const prev = sorted[i - 1];
        const prevTs = prev?.header?.timestamp != null ? Number(prev.header.timestamp) : 0;
        const blockTimeSec =
          i > 0 && ts > 0 && prevTs > 0 ? ts - prevTs : null;
        return {
          height: b.header?.height ?? 0,
          blockTimeSec,
          txCount: b.transactions?.length ?? 0,
        };
      });

      setData(points);
    } catch (e) {
      setError(getFriendlyRpcErrorMessage(e, network, "stats"));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [network]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  if (error) {
    return (
      <section className="py-4" aria-label="Network charts">
        <div className="glass-card border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-200" role="alert">
          {error}
        </div>
      </section>
    );
  }

  const blockTimeData = data.filter((d) => d.blockTimeSec != null);

  return (
    <section className="py-4 space-y-6" aria-label="Network charts">
      <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
        Network metrics
      </h2>

      {loading ? (
        <div className="glass-card p-8 flex items-center justify-center text-[var(--text-muted)]">
          Loading charts…
        </div>
      ) : data.length === 0 ? (
        <div className="glass-card p-8 text-center text-[var(--text-muted)]">
          No block data available yet.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3">
              Block time (seconds)
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={blockTimeData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
                  <XAxis
                    dataKey="height"
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    tickFormatter={(v) => v.toLocaleString()}
                  />
                  <YAxis
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    tickFormatter={(v) => v.toFixed(1)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--boing-navy-deep)",
                      border: "1px solid var(--border-color)",
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "var(--text-primary)" }}
                    formatter={(value: number | undefined) => [value != null ? `${value.toFixed(2)}s` : "—", "Block time"]}
                    labelFormatter={(label) => `Block #${Number(label).toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="blockTimeSec"
                    stroke="var(--network-cyan)"
                    strokeWidth={2}
                    dot={{ fill: "var(--network-cyan)", r: 2 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3">
              Transactions per block
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...data].reverse()}
                  margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
                  <XAxis
                    dataKey="height"
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    tickFormatter={(v) => v.toLocaleString()}
                  />
                  <YAxis
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--boing-navy-deep)",
                      border: "1px solid var(--border-color)",
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "var(--text-primary)" }}
                    formatter={(value: number | undefined) => [value ?? 0, "Txns"]}
                    labelFormatter={(label) => `Block #${Number(label).toLocaleString()}`}
                  />
                  <Bar
                    dataKey="txCount"
                    fill="var(--network-cyan)"
                    radius={[2, 2, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
