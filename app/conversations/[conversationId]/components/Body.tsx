'use client'

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useState, useRef } from "react";
import MessageBox from "./MessageBox";
import { useEffect } from "react";
import { post } from "@/app/http";
import { toast } from "react-hot-toast";

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({
  initialMessages
}) => {

  const [ messages, SetMessages ] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null)
  const { conversationId } = useConversation()

  useEffect(() => {
    post(`/api/conversations/${conversationId}/seen`).catch(err => toast.error(err.message))
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