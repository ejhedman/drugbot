import { AuthProvider } from '@/contexts/AuthContext';
import { SharedReportLayout } from '@/components/layout/SharedReportLayout';

interface SharedReportPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SharedReportPage({ params }: SharedReportPageProps) {
  const { slug } = await params;

  return (
    <AuthProvider>
      <SharedReportLayout reportSlug={slug} />
    </AuthProvider>
  );
} 