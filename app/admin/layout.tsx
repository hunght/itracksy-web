import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Tabs defaultValue="/admin" className="mb-6 w-full">
        <TabsList>
          <TabsTrigger value="/leads" asChild>
            <Link href="/admin/leads">Leads List</Link>
          </TabsTrigger>
          <TabsTrigger value="/admin/marketing-campaigns" asChild>
            <Link href="/admin/marketing-campaigns">Marketing Campaigns</Link>
          </TabsTrigger>
          <TabsTrigger value="/admin/email-events" asChild>
            <Link href="/admin/email-events">Email Analytics</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}
