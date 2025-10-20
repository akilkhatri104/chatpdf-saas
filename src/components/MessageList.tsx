import { cn } from "@/lib/utils";
import { Loader2, MessageSquare } from "lucide-react";
import React, { useEffect } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Response } from '@/components/ai-elements/response';
import { Message, MessageContent } from "./ai-elements/message";
import { Message as MessageType } from "ai";
import { stat } from "fs";


type Props = {
  messages: MessageType[];
  isLoading: boolean;
  status: 'submitted' | 'streaming' | 'ready' | 'error'
};

const MessageList = ({ messages, isLoading, status }: Props) => {
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages]);

  return isLoading ? (
    <div className="flex p-4 justify-center w-full min-h-full h-full">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  ) : (
    <Conversation>
      <ConversationContent>
        {
          messages.length === 0 ? (
            <ConversationEmptyState
              className="h-full" // Ensure empty state also fills the space
              icon={<MessageSquare className="size-12" />}
              title="No messages yet"
              description="Start a conversation to see messages here"
            />
          ) :
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts && message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
        {status === 'submitted' && <Loader2 className="animate-spin" />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
};

export default MessageList;
