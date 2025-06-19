
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { MessengerInterface } from '@/components/messaging/MessengerInterface';

const Messages = () => {
  return (
    <MainLayout noPadding>
      <div className="h-screen bg-gray-50 dark:bg-gray-900">
        <MessengerInterface />
      </div>
    </MainLayout>
  );
};

export default Messages;
