'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, User, ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ChatMessage = {
  id: string;
  content: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
  subject?: string;
  attachments?: { url: string; type: string; name: string }[];
};

export type ChatBoxProps = {
  messages: ChatMessage[];
  onSendMessage: (message: string, attachments?: File[]) => void;
  isSending?: boolean;
  disabled?: boolean;
  placeholder?: string;
  emptyStateIcon?: React.ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  headerContent?: React.ReactNode;
  className?: string;
  showAttachments?: boolean;
};

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function ChatBox({
  messages,
  onSendMessage,
  isSending = false,
  disabled = false,
  placeholder = 'Type a message... (Enter to send, Shift+Enter for new line)',
  emptyStateIcon,
  emptyStateTitle = 'No messages',
  emptyStateDescription = 'Start a conversation',
  headerContent,
  className,
  showAttachments = true,
}: ChatBoxProps) {
  const [messageText, setMessageText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (messageText.trim() || attachedFiles.length > 0) {
      onSendMessage(
        messageText,
        attachedFiles.length > 0 ? attachedFiles : undefined,
      );
      setMessageText('');
      setAttachedFiles([]);
      setPreviewUrls((prev) => {
        prev.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachedFiles((prev) => [...prev, ...files]);
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn('flex flex-1 flex-col', className)}>
      {/* Header */}
      {headerContent && (
        <div className="flex items-center justify-between border-b p-4">
          {headerContent}
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            {emptyStateIcon || <User className="mb-4 h-16 w-16" />}
            <p className="text-lg">{emptyStateTitle}</p>
            <p className="text-sm">{emptyStateDescription}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.direction === 'outbound'
                    ? 'justify-end'
                    : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-2',
                    message.direction === 'outbound'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 dark:bg-gray-800',
                  )}
                >
                  {message.subject && (
                    <p
                      className={cn(
                        'mb-1 text-xs font-medium',
                        message.direction === 'outbound'
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground',
                      )}
                    >
                      {message.subject}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </p>
                  {/* Render attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx}>
                          {attachment.type.startsWith('image/') ? (
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="max-h-48 rounded-lg"
                            />
                          ) : (
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                'text-sm underline',
                                message.direction === 'outbound'
                                  ? 'text-primary-foreground'
                                  : 'text-primary',
                              )}
                            >
                              {attachment.name}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p
                    className={cn(
                      'mt-1 text-right text-xs',
                      message.direction === 'outbound'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground',
                    )}
                  >
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Reply Input */}
      {!disabled ? (
        <div className="border-t p-4">
          {/* Attachment previews */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="relative">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={previewUrls[idx]}
                      alt={file.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 items-center rounded-lg bg-gray-100 px-3 dark:bg-gray-800">
                      <span className="max-w-24 truncate text-xs">
                        {file.name}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            {showAttachments && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-auto min-h-[80px]"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending}
                >
                  <ImagePlus className="h-5 w-5" />
                </Button>
              </>
            )}
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="min-h-[80px] resize-none"
              disabled={isSending}
            />
            <Button
              onClick={handleSend}
              disabled={
                isSending || (!messageText.trim() && attachedFiles.length === 0)
              }
              className="h-auto"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-t p-4 text-center text-sm text-muted-foreground">
          Cannot send messages
        </div>
      )}
    </div>
  );
}

export default ChatBox;
