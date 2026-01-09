'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  Inbox,
  Mail,
  Send,
  Clock,
  User,
  RefreshCw,
  CheckCheck,
  Circle,
  ArrowLeft,
  Loader2,
  MailOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Email = {
  id: string;
  message_id: string;
  from_email: string;
  from_name: string | null;
  to_email: string;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  direction: 'inbound' | 'outbound';
  is_read: boolean;
  feedback_id: string | null;
  created_at: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function InboxPage() {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread' | 'inbound' | 'outbound'>('all');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [replyTo, setReplyTo] = useState<Email | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  const {
    data: emails = [],
    isLoading,
    refetch,
  } = useQuery<Email[]>({
    queryKey: ['inbox-emails', filter],
    queryFn: async () => {
      let query = supabase
        .from('email_threads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'unread') {
        query = query.eq('is_read', false).eq('direction', 'inbound');
      } else if (filter === 'inbound') {
        query = query.eq('direction', 'inbound');
      } else if (filter === 'outbound') {
        query = query.eq('direction', 'outbound');
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data as Email[];
    },
  });

  // Mark email as read
  const markAsRead = useMutation({
    mutationFn: async (emailId: string) => {
      const { error } = await supabase
        .from('email_threads')
        .update({ is_read: true })
        .eq('id', emailId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox-emails'] });
    },
  });

  // Send reply
  const sendReply = useMutation({
    mutationFn: async () => {
      if (!replyTo) throw new Error('No email to reply to');

      const response = await fetch('/api/feedback/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackId: replyTo.feedback_id || 'direct-email',
          to: replyTo.from_email,
          subject: replySubject,
          message: replyMessage,
          userName: replyTo.from_name || replyTo.from_email,
          originalMessage: replyTo.body_text || '',
          feedbackType: 'email',
          inReplyTo: replyTo.message_id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send reply');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Reply sent', description: 'Your reply has been sent successfully.' });
      setReplyTo(null);
      setReplySubject('');
      setReplyMessage('');
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Failed to send',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
    if (!email.is_read && email.direction === 'inbound') {
      markAsRead.mutate(email.id);
    }
  };

  const handleReply = (email: Email) => {
    setReplyTo(email);
    setReplySubject(`Re: ${email.subject || 'Your message'}`);
    setReplyMessage(
      `Hi ${email.from_name || 'there'},\n\n\n\nBest regards,\niTracksy Team`,
    );
  };

  const stats = {
    total: emails.length,
    unread: emails.filter((e) => !e.is_read && e.direction === 'inbound').length,
    inbound: emails.filter((e) => e.direction === 'inbound').length,
    outbound: emails.filter((e) => e.direction === 'outbound').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Circle className="h-4 w-4 text-blue-500 fill-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received</CardTitle>
            <Inbox className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inbound}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outbound}</div>
          </CardContent>
        </Card>
      </div>

      {/* Email List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              Email Inbox
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={filter}
                onValueChange={(v) => setFilter(v as typeof filter)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Emails</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="inbound">Received</SelectItem>
                  <SelectItem value="outbound">Sent</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading emails...</div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MailOpen className="mb-4 h-12 w-12" />
              <p>No emails found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>From / To</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="w-[150px]">Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.map((email) => (
                    <TableRow
                      key={email.id}
                      className={cn(
                        'cursor-pointer',
                        !email.is_read &&
                          email.direction === 'inbound' &&
                          'bg-blue-50 dark:bg-blue-900/10',
                      )}
                      onClick={() => handleSelectEmail(email)}
                    >
                      <TableCell>
                        {email.direction === 'inbound' ? (
                          email.is_read ? (
                            <MailOpen className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Mail className="h-4 w-4 text-blue-500" />
                          )
                        ) : (
                          <Send className="h-4 w-4 text-green-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <p
                              className={cn(
                                'text-sm',
                                !email.is_read &&
                                  email.direction === 'inbound' &&
                                  'font-semibold',
                              )}
                            >
                              {email.direction === 'inbound'
                                ? email.from_name || email.from_email
                                : email.to_email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {email.direction === 'inbound' ? email.from_email : 'To: ' + email.to_email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p
                          className={cn(
                            'truncate text-sm',
                            !email.is_read &&
                              email.direction === 'inbound' &&
                              'font-medium',
                          )}
                        >
                          {email.subject || '(No subject)'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(email.created_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {email.direction === 'inbound' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReply(email);
                            }}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Detail Dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-2xl">
          {selectedEmail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedEmail.direction === 'inbound' ? (
                    <Inbox className="h-5 w-5" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {selectedEmail.subject || '(No subject)'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {selectedEmail.direction === 'inbound'
                          ? selectedEmail.from_name || selectedEmail.from_email
                          : 'iTracksy Support'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedEmail.direction === 'inbound'
                          ? selectedEmail.from_email
                          : `To: ${selectedEmail.to_email}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <Clock className="mr-1 inline h-4 w-4" />
                    {formatDate(selectedEmail.created_at)}
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto rounded-lg border bg-white p-4 dark:bg-gray-900">
                  <p className="whitespace-pre-wrap text-sm">
                    {selectedEmail.body_text}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedEmail(null)}>
                  Close
                </Button>
                {selectedEmail.direction === 'inbound' && (
                  <Button onClick={() => handleReply(selectedEmail)}>
                    <Send className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={!!replyTo} onOpenChange={() => setReplyTo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Reply to {replyTo?.from_name || replyTo?.from_email}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Original Message
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {replyTo?.body_text}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyTo(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => sendReply.mutate()}
              disabled={sendReply.isPending || !replyMessage.trim()}
            >
              {sendReply.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
