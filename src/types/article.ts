export type Category = 'IT' | '교육' | '문화예술' | '종교' | '상생'

export interface Article {
  slug: string
  title: string
  category: Category
  author: string
  publishedAt: string
  published: boolean
  docId: string
  thumbnail: string
  summary: string
  content?: string
}

export type ArticleListItem = Omit<Article, 'content' | 'docId'>
