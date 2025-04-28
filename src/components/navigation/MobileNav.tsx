
import { TopNav } from "./mobile/TopNav";
import { BottomNav } from "./mobile/BottomNav";

export function MobileNav() {
  return (
    <>
      <TopNav />
      <BottomNav />
      {/* Spacers for fixed navbars */}
      <div className="h-16" /> {/* Top spacer */}
      <div className="h-16 pb-safe" /> {/* Bottom spacer with safe area padding for notched phones */}
    </>
  );
}
