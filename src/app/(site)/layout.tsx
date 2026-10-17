import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import Shell from "@/components/Shell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Loader />
      <Cursor />
      <Shell>{children}</Shell>
    </>
  );
}
