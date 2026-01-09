'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSupabaseBrowser } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MessageSquare,
  Bug,
  Lightbulb,
  HelpCircle,
  Mail,
  Calendar,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ReplyModal } from './components/reply-modal';
import { FeedbackDetailModal } from './components/feedback-detail-modal';

type Feedback = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  feedback_type: string;
  message: string;
  replied_at?: string | null;
};

const feedbackTypeConfig: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  general: {
    icon: MessageSquare,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    label: 'General',
  },
  bug: {
    icon: Bug,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    label: 'Bug Report',
  },
  feature: {
    icon: Lightbulb,
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    label: 'Feature Request',
  },
  other: {
    icon: HelpCircle,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    label: 'Other',
  },
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function FeedbackPage() {
  const supabase = useSupabaseBrowser();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );
  const [replyFeedback, setReplyFeedback] = useState<Feedback | null>(null);

  const {
    data: feedbackList = [],
    isLoading,
    refetch,
  } = useQuery<Feedback[]>({
    queryKey: ['feedback', typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (typeFilter !== 'all') {
        query = query.eq('feedback_type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Feedback[];
    },
  });

  // Filter by search query
  const filteredFeedback = feedbackList.filter((feedback) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      feedback.name?.toLowerCase().includes(query) ||
      feedback.email?.toLowerCase().includes(query) ||
      feedback.message?.toLowerCase().includes(query)
    );
  });

  // Stats
  const stats = {
    total: feedbackList.length,
    bug: feedbackList.filter((f) => f.feedback_type === 'bug').length,
    feature: feedbackList.filter((f) => f.feedback_type === 'feature').length,
    pending: feedbackList.filter((f) => !f.replied_at).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Feedback
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bug Reports</CardTitle>
            <Bug className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bug}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Feature Requests
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.feature}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reply
            </CardTitle>
            <Mail className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Feedback Management</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading feedback...
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No feedback found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((feedback) => {
                    const typeConfig =
                      feedbackTypeConfig[feedback.feedback_type] ||
                      feedbackTypeConfig.other;
                    const TypeIcon = typeConfig.icon;

                    return (
                      <TableRow key={feedback.id}>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(feedback.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {feedback.name?.replace('iTracksy:', '') || 'Anonymous'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {feedback.email || 'No email'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`gap-1 ${typeConfig.color}`}
                          >
                            <TypeIcon className="h-3 w-3" />
                            {typeConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <p className="truncate text-sm text-muted-foreground">
                            {feedback.message}
                          </p>
                        </TableCell>
                        <TableCell>
                          {feedback.replied_at ? (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            >
                              Replied
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                            >
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFeedback(feedback)}
                            >
                              View
                            </Button>
                            {feedback.email && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyFeedback(feedback)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          open={!!selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onReply={() => {
            setReplyFeedback(selectedFeedback);
            setSelectedFeedback(null);
          }}
        />
      )}

      {replyFeedback && (
        <ReplyModal
          feedback={replyFeedback}
          open={!!replyFeedback}
          onClose={() => setReplyFeedback(null)}
          onSuccess={() => {
            setReplyFeedback(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
