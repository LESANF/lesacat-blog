export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: Category;
  content?: string;
  slug: string;
  description?: string;
  tags?: string[];
}

export type Category = "DEV" | "DAILY" | "STUDY";

export interface CategoryFilter {
  category: Category;
  active: boolean;
}
