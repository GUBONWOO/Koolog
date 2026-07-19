import { Category } from '@/types/post';

export const CATEGORIES = ['전체', '요리', '공부', '잡동사니', '비밀폴더'] as const;

export const categoryStyle: Record<Category, { color: string; cover: string }> = {
  요리: { color: 'bg-orange-100 text-orange-600', cover: 'from-orange-200 to-yellow-300' },
  공부: { color: 'bg-blue-100 text-blue-600', cover: 'from-blue-200 to-sky-300' },
  잡동사니: { color: 'bg-stone-100 text-stone-600', cover: 'from-stone-200 to-gray-300' },
  비밀폴더: { color: 'bg-purple-100 text-purple-600', cover: 'from-purple-200 to-violet-300' },
};
