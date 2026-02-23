"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalendarDays,
  faUsers,
  faFileLines,
  faRightFromBracket,
  faGear,
  faBook,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/_hooks/useAuth";
import { supabase } from "@/lib/supabase/client";

const navItems = [
  { href: "/entry", icon: faHome, title: "エントリー" },
  { href: "/calendar", icon: faCalendarDays, title: "活動スケジュール" },
  { href: "/about", icon: faUsers, title: "部活紹介" },
  { href: "/join", icon: faFileLines, title: "体験入部" },
  { href: "/profile", icon: faUserGear, title: "プロフィール" },
  { href: "/groups", icon: faBook, title: "登録者一覧" },
  { href: "/admin", icon: faGear, title: "管理者用機能" },
];

export default function SideNav() {
  const pathname = usePathname();
  // pathname が取得できない（サーバー側レンダリング等）や特定パスでは非表示
  if (!pathname) return null;
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup")
  )
    return null;

  const router = useRouter();
  const { isLoading, session } = useAuth();

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (isLoading) return null;

  return (
    <>
      <nav className="hidden md:fixed md:top-0 md:left-0 md:z-50 md:flex md:h-screen md:w-14 md:flex-col md:items-center md:gap-6 md:border-r md:border-black md:bg-white md:pt-4">

        {navItems.map((item) => (
          <Link key={item.href} href={item.href} title={item.title}>
            <FontAwesomeIcon icon={item.icon} />
          </Link>
        ))}

        {session ? (
          <button
            onClick={logout}
            title="Logout"
            aria-label="Logout"
            className="underline"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        ) : (
          <Link href="/login" className="underline">
            Login
          </Link>
        )}
      </nav>

      <nav className="fixed bottom-0 left-0 z-50 flex h-14 w-full items-center justify-around border-t border-black bg-white md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center text-xs"
            title={item.title}
          >
            <FontAwesomeIcon icon={item.icon} />
          </Link>
        ))}

        {session ? (
          <button
            onClick={logout}
            className="flex flex-col items-center text-xs"
            title="Logout"
            aria-label="Logout"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center text-xs"
            title="ログイン"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </Link>
        )}
      </nav>
    </>
  );
}
