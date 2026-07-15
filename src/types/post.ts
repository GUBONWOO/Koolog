export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  coverColor: string;
  emoji: string;
  featured?: boolean;
}
