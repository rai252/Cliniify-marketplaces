export interface IBlogPost {
  id?: number;
  title: string;
  slug: string;
  subtitle?: string;
  image?: string | File | null;
  content: string;
  created_at?: string;
}

export interface IBlogPostAdd {
  title: string;
  subtitle?: string;
  image?: string | File;
  content: string;
}

export interface IBlogPostEdit {
  title: string;
  slug: string;
  subtitle?: string;
  image?: string | File | null;
  content: string;
}

export interface IBlogCount {
  total_blog_count: number;
  change_type: "increment" | "decrement";
  change_from_last_month: number;
  percentage_change: number;
}
