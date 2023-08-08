'use client'

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useState, useRef } from "react";
import MessageBox from "./MessageBox";
import { useEffect } from "react";
import { post } from "@/app/http";
import { toast } from "react-hot-toast";
import { pusherClient } from "@/app/libs/pusher";
import { find } from 'lodash';

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({
  initialMessages
}) => {

  const [ messages, setMessages ] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null)
  const { conversationId } = useConversation()

  useEffect(() => {
    post(`/api/conversations/${conversationId}/seen`).catch(err => toast.error(err.message))
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId as string)
    bottomRef?.current?.scrollIntoView()

    const messageHandler = (newMessage: FullMessageType) => {
      post(`/api/conversations/${conversationId}/seen`).catch(err => toast.error(err.message))

      setMessages((current) => {
        if (find(current, {id: newMessage.id})) {
          return current
        }
        return [...current, newMessage]
      })

      bottomRef?.current?.scrollIntoView()
    }

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }
        return currentMessage;
      }))
    }

    pusherClient.bind('message:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler)
    return () => {
      pusherClient.unsubscribe(conversationId as string);
      pusherClient.unbind('message:new', messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId])

  return (
    <div className="flex-1 overflow-auto">
      {messages.map((message, i) => (
        <MessageBox isLast={i === messages.length - 1} key={message.id} data={message}/>
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  )
}


export default Body;