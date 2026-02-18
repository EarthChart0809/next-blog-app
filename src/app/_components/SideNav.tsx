"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFish,
  faHome,
  faCalendarDays,
  faUsers,
  faFileLines,
  faRightFromBracket,
  faGear,
  faBook
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/_hooks/useAuth";
import { supabase } from "@/utils/supabase";

const navItems = [
  { href: "/", icon: faHome, title: "トップ" },
  { href: "/calendar", icon: faCalendarDays, title: "活動スケジュール" },
  { href: "/about", icon: faUsers, title: "部活紹介" },
  { href: "/join", icon: faFileLines, title: "体験入部" },
  { href: "/profile", icon: faGear, title: "設定" },
  { href: "/groups", icon: faBook, title: "登録者一覧" },
];

const SideNav = () => {
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
        {/* ロゴ */}
        <Link href="/profile" title="設定" className="mb-4">
          <FontAwesomeIcon icon={faGear} />
        </Link>
        <Link href="/" title="トップ">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link href="/calendar" title="活動スケジュール">
          <FontAwesomeIcon icon={faCalendarDays} />
        </Link>
        <Link href="/about" title="部活紹介">
          <FontAwesomeIcon icon={faUsers} />
        </Link>
        <Link href="/join" title="体験入部">
          <FontAwesomeIcon icon={faFileLines} />
        </Link>
        <Link href="/groups" title="登録者一覧">
          <FontAwesomeIcon icon={faBook} />
        </Link>

        {session ? (
          <button
            type="button"
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

      {/* =====================
            スマホ：下ナビ
      ===================== */}
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
            type="button"
            onClick={logout}
            title="Logout"
            aria-label="Logout"
            className="flex flex-col items-center text-xs"
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
};

export default SideNav;
