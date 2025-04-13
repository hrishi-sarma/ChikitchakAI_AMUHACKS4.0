
export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  date: string;
  author: Author;
  category: string;
  tags: string[];
}
