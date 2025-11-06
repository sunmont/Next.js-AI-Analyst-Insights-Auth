import { DashboardClient } from './dashboard-client';
import { analyticsApi } from '@/lib/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Default query for initial data
const defaultQuery = {
  dateRange: {
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
    to: new Date(),
  },
  metrics: ['revenue', 'users', 'sessions', 'conversion'],
};

export default async function DashboardPage() {
  // Check authentication on server
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session) {
    redirect('/auth/signin');
  }
  
  // Server-side data fetching for initial load
  const initialData = await analyticsApi.getMetrics(defaultQuery);

  return <DashboardClient initialData={initialData} />;
}