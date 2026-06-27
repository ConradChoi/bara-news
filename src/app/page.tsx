import ComingSoon from "./coming-soon";
import HomePage from "./home-page";
import { getArticles } from "@/lib/cms";

export const revalidate = 60;

export default async function RootPage() {
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";
  if (isComingSoon) return <ComingSoon />;

  const articles = await getArticles();
  return <HomePage articles={articles} />;
}
