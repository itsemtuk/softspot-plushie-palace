
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Messaging = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">No messages yet.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Messaging;
