'use client';

import { LiveChatWidget, EventHandlerPayload } from '@livechat/widget-react';

export default function LiveChat() {
  function handleNewEvent(event: EventHandlerPayload<'onNewEvent'>) {
    console.log('LiveChatWidget.onNewEvent', event);
  }

  return (
    <LiveChatWidget
      license='18749046'
      visibility='maximized'
      onNewEvent={handleNewEvent}
    />
  );
}
