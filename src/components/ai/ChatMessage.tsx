/**
 * ChatMessage - Premium chat message display
 * Modern design with gradients and smooth styling
 */

import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType } from '@/types';
import { formatTimestamp } from '@/utils/formatters';
import { Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * Display a single chat message with premium styling
 */
export const ChatMessageComponent = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-up',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar with glow */}
      <div className="relative flex-shrink-0">
        {!isUser && (
          <div className="absolute inset-0 blur-md bg-primary/30 rounded-full" />
        )}
        <div
          className={cn(
            'relative w-9 h-9 rounded-xl flex items-center justify-center',
            isUser 
              ? 'bg-gradient-to-br from-primary to-secondary' 
              : 'bg-gradient-to-br from-muted to-muted/80 border border-border/50'
          )}
        >
          {isUser ? (
            <User className="h-4 w-4 text-primary-foreground" />
          ) : (
            <div className="relative">
              <Bot className="h-4 w-4 text-primary" />
              <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-accent" />
            </div>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'max-w-[80%] px-4 py-3',
          isUser ? 'chat-user' : 'chat-ai'
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-foreground prose-strong:text-primary prose-code:text-accent">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        <p
          className={cn(
            'text-[10px] mt-2 opacity-50',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {formatTimestamp(message.timestamp, 'HH:mm')}
        </p>
      </div>
    </div>
  );
};
