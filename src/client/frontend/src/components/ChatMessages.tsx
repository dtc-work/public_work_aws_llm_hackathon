import React, { useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';


// 型定義
interface Message {
  type: "user" | "server";
  content: string;
  avatar_type: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // メッセージの更新時にスクロールを自動で一番下まで移動
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="chat-container" ref={chatContainerRef}>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type}-message`}>
            {message.type === "server" && (
              <div className="ai-bubble">
                <img src={message.avatar_type} alt="AI" className="ai-image" />
                <p className="ai-message-bubble"><ReactMarkdown>{message.content}</ReactMarkdown></p>
              </div>
            )}
            {message.type === "user" && (
              <div className="user-bubble">
                <p className="user-message-bubble">{message.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
