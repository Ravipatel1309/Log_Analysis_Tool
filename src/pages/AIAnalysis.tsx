/**
 * AI Analysis Page - Premium conversational log analysis
 * ChatGPT-like interface with modern design
 */

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Trash2, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { APP_CONFIG } from '@/config/appConfig';
import { ChatMessage } from '@/types';
import { sendAIMessage, createUserMessage } from '@/services/aiService';
import { ChatMessageComponent } from '@/components/ai/ChatMessage';
import { TypingIndicator } from '@/components/ai/TypingIndicator';

/**
 * AI Analysis page with premium chat interface
 */
const AIAnalysis = () => {
  const { testcaseId } = useParams<{ testcaseId: string }>();
  const navigate = useNavigate();
  
  const currentTestcaseId = testcaseId || APP_CONFIG.defaultTestcaseId;

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Redirect if no testcaseId
  useEffect(() => {
    if (!testcaseId) {
      navigate(`/ai-analysis/${APP_CONFIG.defaultTestcaseId}`, { replace: true });
    }
  }, [testcaseId, navigate]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `👋 Hello! I'm your AI log analysis assistant for testcase **${currentTestcaseId}**.

I can help you:
- 🔍 Analyze error patterns
- 📊 Identify performance bottlenecks
- 🔗 Correlate related events
- 💡 Suggest fixes and optimizations

Try asking me something like:
- "What errors occurred in this testcase?"
- "Analyze the performance of this execution"
- "What warnings should I be concerned about?"`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [currentTestcaseId, messages.length]);

  // Handle sending a message
  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    // Create and add user message
    const userMessage = createUserMessage(trimmedInput);
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendAIMessage(trimmedInput, currentTestcaseId);
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Clear chat history
  const handleClear = () => {
    setMessages([]);
  };

  // Suggested prompts
  const suggestedPrompts = [
    { icon: '🔍', text: 'What errors occurred?' },
    { icon: '📊', text: 'Analyze performance' },
    { icon: '🔗', text: 'Find root cause' },
    { icon: '📋', text: 'Summarize execution' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header with gradient accent */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 blur-lg bg-primary/40 rounded-full" />
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="gradient-text">Log Analysis by AI</span>
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-accent" />
            Analyzing testcase:{' '}
            <span className="font-mono text-primary font-medium">{currentTestcaseId}</span>
          </p>
        </div>
        {messages.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="gap-2 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            <Trash2 className="h-4 w-4" />
            Clear Chat
          </Button>
        )}
      </div>

      {/* Chat Area with glass effect */}
      <div className="flex-1 glass border border-border/50 rounded-2xl overflow-hidden flex flex-col shadow-lg">
        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessageComponent key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        </ScrollArea>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              Quick prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <Button
                  key={prompt.text}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputValue(prompt.text);
                    textareaRef.current?.focus();
                  }}
                  className="text-xs gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <span>{prompt.icon}</span>
                  {prompt.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area with premium styling */}
        <div className="border-t border-border/50 p-4 bg-muted/20">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              placeholder="Ask about your logs... (Enter to send, Shift+Enter for new line)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[56px] max-h-[200px] resize-none bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 btn-primary-glow rounded-xl"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
