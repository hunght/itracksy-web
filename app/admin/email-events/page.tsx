'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Loader2 } from 'lucide-react';

// Define the email event type
type EmailEvent = {
  id: string;
  email_id: string;
  recipient_email: string;
  event_type: string;
  subject: string;
  email_type: string;
  created_at: string;
  metadata: Record<string, any>;
};

// Define the email stats type
type EmailStats = {
  totalSent: number;
  eventStats: Array<{
    event_type: string;
    count: number;
  }>;
  rates: {
    openRate: number;
    clickRate: number;
    clickThroughRate: number;
  };
};

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];
const EVENT_TYPES = [
  'sent',
  'delivered',
  'opened',
  'clicked',
  'bounced',
  'complained',
];
const EVENT_LABELS: Record<string, string> = {
  sent: 'Sent',
  delivered: 'Delivered',
  opened: 'Opened',
  clicked: 'Clicked',
  bounced: 'Bounced',
  complained: 'Complained',
};

export default function EmailEventsPage() {
  const [emailType, setEmailType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch email statistics
  const {
    data: emailStats,
    isLoading: isLoadingStats,
    isError: isStatsError,
    refetch: refetchStats,
  } = useQuery<EmailStats>({
    queryKey: ['emailStats', emailType, dateRange],
    queryFn: async () => {
      let url = '/api/email-stats';
      const params = new URLSearchParams();

      if (emailType && emailType !== 'all')
        params.append('emailType', emailType);
      if (dateRange?.from)
        params.append('startDate', format(dateRange.from, 'yyyy-MM-dd'));
      if (dateRange?.to)
        params.append('endDate', format(dateRange.to, 'yyyy-MM-dd'));

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch email statistics');
      return response.json();
    },
    enabled: true,
  });

  // Fetch recent email events
  const {
    data: recentEvents = [],
    isLoading: isLoadingEvents,
    isError: isEventsError,
  } = useQuery<EmailEvent[]>({
    queryKey: ['emailEvents', emailType, dateRange, activeTab],
    queryFn: async () => {
      let url = '/api/email-events';
      const params = new URLSearchParams();

      if (emailType && emailType !== 'all')
        params.append('emailType', emailType);
      if (dateRange?.from)
        params.append('startDate', format(dateRange.from, 'yyyy-MM-dd'));
      if (dateRange?.to)
        params.append('endDate', format(dateRange.to, 'yyyy-MM-dd'));
      params.append('limit', '100');

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch email events');
      return response.json();
    },
    enabled: activeTab === 'events',
  });

  // Effect to refetch stats when filters change
  useEffect(() => {
    refetchStats();
  }, [emailType, dateRange, refetchStats]);

  // Prepare chart data
  const chartData =
    emailStats?.eventStats?.map((stat) => ({
      name: EVENT_LABELS[stat.event_type] || stat.event_type,
      value: stat.count,
      count: stat.count,
    })) || [];

  // Prepare pie chart data
  const pieData =
    emailStats?.eventStats
      ?.filter((stat) =>
        ['opened', 'clicked', 'bounced'].includes(stat.event_type),
      )
      .map((stat) => ({
        name: EVENT_LABELS[stat.event_type] || stat.event_type,
        value: stat.count,
      })) || [];

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Email Analytics</CardTitle>
          <div className="flex space-x-4">
            <div className="w-48">
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Email Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Email Types</SelectItem>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() +
                        type.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Event List</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {isLoadingStats ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : isStatsError ? (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-red-500">Error loading email statistics</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                          {emailStats?.totalSent || 0}
                        </div>
                        <p className="text-xs text-gray-500">
                          Total Emails Sent
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                          {emailStats?.rates.openRate.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-500">Open Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                          {emailStats?.rates.clickRate.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-500">Click Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                          {emailStats?.rates.clickThroughRate.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-500">
                          Click-Through Rate
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Email Events Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={chartData}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Engagement Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                  `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="events">
              {isLoadingEvents ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : isEventsError ? (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-red-500">Error loading email events</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Event Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Email Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Recipient
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Subject
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {recentEvents.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            No email events found
                          </td>
                        </tr>
                      ) : (
                        recentEvents.map((event) => (
                          <tr key={event.id}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  event.event_type === 'clicked'
                                    ? 'bg-green-100 text-green-800'
                                    : event.event_type === 'opened'
                                      ? 'bg-blue-100 text-blue-800'
                                      : event.event_type === 'delivered'
                                        ? 'bg-indigo-100 text-indigo-800'
                                        : event.event_type === 'sent'
                                          ? 'bg-gray-100 text-gray-800'
                                          : event.event_type === 'bounced'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {EVENT_LABELS[event.event_type] ||
                                  event.event_type}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {event.email_type}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {event.recipient_email}
                            </td>
                            <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">
                              {event.subject}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                              {new Date(event.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
