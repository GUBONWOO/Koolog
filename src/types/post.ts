export type Category = '요리' | '공부' | '잡동사니' | '비밀폴더';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  emoji: string;
  date: string;
  createdAt: string;
}
