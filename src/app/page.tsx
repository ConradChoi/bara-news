import ComingSoon from "./coming-soon";
import HomePage from "./home-page";

export default function RootPage() {
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";
  return isComingSoon ? <ComingSoon /> : <HomePage />;
}
