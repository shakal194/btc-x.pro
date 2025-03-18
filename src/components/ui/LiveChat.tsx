'use client';
import { LiveChatWidget } from '@livechat/widget-react';

export default function LiveChat() {
  return (
    <LiveChatWidget
      license='18749046'
      visibility='minimized' // Динамически меняем visibility
    />
  );
}
