'use client';

import GinniChat from '@/components/GinniChat';
import { useGinniStore } from '@/store/ginni-store';

export default function GinniChatWrapper() {
  const { context, triggerOpen, isOpen, setIsOpen, setTriggerOpen } = useGinniStore();
  
  return (
    <GinniChat 
      autoOpenDelay={0}
      showNotification={false}
      context={context || undefined}
      triggerOpen={triggerOpen}
      onOpen={() => {
        setTriggerOpen(false);
      }}
      onClose={() => {
        setIsOpen(false);
      }}
    />
  );
}