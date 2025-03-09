'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteConfig } from '@/config/site'; // Import siteConfig

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useSupabaseBrowser } from '@/lib/supabase/client';

// Add this new type for our feedback data
type Feedback = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  feedback_type: string;
  message: string;
};

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');

  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();
  // Query for fetching feedback
  const {
    data: feedbackList = [],
    isLoading,
    isError,
  } = useQuery<Feedback[]>({
    queryKey: ['feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Feedback[];
    },
  });

  // Mutation for submitting feedback
  const { mutate: submitFeedback, isPending: isSubmitting } = useMutation({
    mutationFn: async (newFeedback: Omit<Feedback, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('feedback').insert(newFeedback);
      if (error) throw error;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    submitFeedback(
      { name: `iTracksy:${name}`, email, feedback_type: feedbackType, message },
      {
        onSuccess: () => {
          // Reset form
          setName('');
          setEmail('');
          setFeedbackType('');
          setMessage('');
          // Invalidate and refetch the feedback query
          queryClient.invalidateQueries({ queryKey: ['feedback'] });
          toast({
            title: 'Feedback Submitted',
            description: 'Thank you for your feedback!',
          });
        },
        onError: (error) => {
          console.error('Error submitting feedback:', error);
          toast({
            title: 'Submission Error',
            description:
              'There was an error submitting your feedback. Please try again.',
            variant: 'destructive',
          });
        },
      },
    );
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto mb-10 max-w-2xl">
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>
            We value your input. Please share your thoughts with us.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedbackType">Feedback Type</Label>
              <Select
                value={feedbackType}
                onValueChange={setFeedbackType}
                required
              >
                <SelectTrigger id="feedbackType">
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Feedback</Label>
              <Textarea
                id="message"
                placeholder="Please enter your feedback here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-4">
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => window.open(siteConfig.links.discord, '_blank')}
            >
              Join our Discord
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Submitted Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {feedbackList.length === 0 ? (
            <p>No feedback submitted yet.</p>
          ) : (
            <ul className="space-y-4">
              {feedbackList.map((feedback) => (
                <li key={feedback.id} className="border-b pb-4">
                  <h3 className="font-semibold">{feedback.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(feedback.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{feedback.email}</p>
                  <p className="mt-1">
                    <span className="font-medium">Type:</span>{' '}
                    {feedback.feedback_type}
                  </p>
                  <p className="mt-1">{feedback.message}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
