'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { BarChart3, Loader2 } from 'lucide-react';
import type { AdminPostSummary } from './types';
import { getMonthlyPostCounts } from './utils';

export function DashboardPanel({
  isLoading,
  posts,
}: {
  isLoading: boolean;
  posts: AdminPostSummary[];
}) {
  const totalPosts = posts.length;
  const draftPosts = posts.filter((post) => post.draft).length;
  const publicPosts = totalPosts - draftPosts;
  const monthlyPosts = getMonthlyPostCounts(posts);
  const monthlyChartOption = createMonthlyChartOption(monthlyPosts);
  const statusChartOption = createStatusChartOption(publicPosts, draftPosts);

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-1 border-b border-[#121212]/10 pb-4 dark:border-white/10">
        <h2 className="text-xl font-medium">首页</h2>
        <p className="text-sm text-[#121212]/50 dark:text-white/50">
          内容概览和发布状态。
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-lg border border-[#121212]/10 px-4 py-6 text-sm text-[#121212]/60 dark:border-white/10 dark:text-white/60">
          <Loader2 className="size-4 animate-spin" />
          正在读取概览数据...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardMetricCard label="文章总数" value={totalPosts} />
            <DashboardMetricCard label="公开文章" value={publicPosts} />
            <DashboardMetricCard label="草稿文章" value={draftPosts} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-lg border border-[#121212]/10 p-5 dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium">发布趋势</h3>
                  <p className="mt-1 text-sm text-[#121212]/50 dark:text-white/50">
                    最近 6 个月文章数量。
                  </p>
                </div>
                <BarChart3 className="size-5 text-[#121212]/40 dark:text-white/40" />
              </div>
              <EChart className="mt-4 h-56" option={monthlyChartOption} />
            </div>

            <div className="rounded-lg border border-[#121212]/10 p-5 dark:border-white/10">
              <h3 className="font-medium">文章状态</h3>
              <p className="mt-1 text-sm text-[#121212]/50 dark:text-white/50">
                公开与草稿比例。
              </p>
              <EChart className="mt-4 h-48" option={statusChartOption} />
              <div className="mt-5 grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#121212]/60 dark:text-white/60">公开</span>
                  <span>{publicPosts} 篇</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#121212]/60 dark:text-white/60">草稿</span>
                  <span>{draftPosts} 篇</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function DashboardMetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[#121212]/10 p-5 dark:border-white/10">
      <p className="text-sm text-[#121212]/50 dark:text-white/50">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function EChart({
  className,
  option,
}: {
  className?: string;
  option: EChartsOption;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = echarts.init(chartRef.current, null, {
      renderer: 'svg',
    });

    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [option]);

  return <div className={className} ref={chartRef} />;
}

function createMonthlyChartOption(
  monthlyPosts: ReturnType<typeof getMonthlyPostCounts>,
): EChartsOption {
  return {
    animationDuration: 700,
    color: ['#121212'],
    grid: {
      bottom: 24,
      left: 28,
      right: 12,
      top: 24,
    },
    tooltip: {
      borderWidth: 0,
      formatter: '{b}: {c} 篇',
      trigger: 'axis',
    },
    xAxis: {
      axisLine: { lineStyle: { color: 'rgba(18,18,18,0.12)' } },
      axisTick: { show: false },
      data: monthlyPosts.map((item) => item.label),
      type: 'category',
    },
    yAxis: {
      axisLabel: { color: 'rgba(18,18,18,0.45)' },
      minInterval: 1,
      splitLine: { lineStyle: { color: 'rgba(18,18,18,0.08)' } },
      type: 'value',
    },
    series: [
      {
        barMaxWidth: 42,
        data: monthlyPosts.map((item) => item.count),
        itemStyle: {
          borderRadius: [8, 8, 2, 2],
        },
        type: 'bar',
      },
    ],
  };
}

function createStatusChartOption(
  publicPosts: number,
  draftPosts: number,
): EChartsOption {
  const total = publicPosts + draftPosts;

  return {
    animationDuration: 700,
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: '文章状态',
        type: 'pie',
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 15,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: total
          ? [
              { name: '公开', value: publicPosts },
              { name: '草稿', value: draftPosts },
            ]
          : [{ name: '暂无文章', value: 1 }],
      },
    ],
    tooltip: {
      formatter: total ? '{b}: {c} 篇 ({d}%)' : '暂无文章',
      trigger: 'item',
    },
  };
}
