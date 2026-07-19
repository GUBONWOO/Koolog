import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-32">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-72 animate-pulse border border-stone-100" />
            ))}
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
