import { AuthProvider } from '@/contexts/AuthContext';
import { SharedReportLayout } from '@/components/layout/SharedReportLayout';

interface SharedReportPageProps {
  params: {
    slug: string;
  };
}

export default function SharedReportPage({ params }: SharedReportPageProps) {
  return (
    <AuthProvider>
      <SharedReportLayout reportSlug={params.slug} />
    </AuthProvider>
  );
} 