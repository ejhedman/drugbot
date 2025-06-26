import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';

export default function Home() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
