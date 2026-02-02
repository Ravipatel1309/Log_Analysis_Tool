/**
 * TypingIndicator - Premium AI thinking animation
 */

import { Bot, Sparkles } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* Bot Avatar with glow */}
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 blur-md bg-primary/30 rounded-full animate-pulse" />
        <div className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-muted to-muted/80 border border-border/50">
          <Bot className="h-4 w-4 text-primary" />
          <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-accent" />
        </div>
      </div>

      {/* Typing Animation */}
      <div className="chat-ai px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span 
            className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent animate-bounce" 
            style={{ animationDelay: '0ms' }} 
          />
          <span 
            className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent animate-bounce" 
            style={{ animationDelay: '150ms' }} 
          />
          <span 
            className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent animate-bounce" 
            style={{ animationDelay: '300ms' }} 
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">Analyzing...</p>
      </div>
    </div>
  );
};
