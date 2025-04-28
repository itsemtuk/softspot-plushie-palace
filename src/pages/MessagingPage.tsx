
import { Navbar } from "@/components/Navbar";
import { DirectMessaging } from "@/components/messaging/DirectMessaging";

const MessagingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <DirectMessaging />
      </main>
    </div>
  );
};

export default MessagingPage;
