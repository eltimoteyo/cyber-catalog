export const dynamic = 'force-dynamic';

export default function Layout({ 
  children
}: { 
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
