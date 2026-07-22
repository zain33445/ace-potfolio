import AdminDashboard from './AdminDashboard';

export const metadata = {
  title: 'Admin | ACE',
  robots: 'noindex,nofollow' as const,
};

export default function Page() {
  return <AdminDashboard />;
}
