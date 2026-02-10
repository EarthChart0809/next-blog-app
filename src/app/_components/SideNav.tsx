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
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/_hooks/useAuth";
import { supabase } from "@/utils/supabase";

const SideNav = () => {
  const router = useRouter();
  const { isLoading, session } = useAuth();

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (isLoading) return null;

  return (
    <nav className="fixed top-0 left-0 z-50 flex h-screen w-14 flex-col items-center gap-6 border-r border-black bg-white pt-4">
      {/* ロゴ */}
      <Link href="/" title="Home" className="mb-4">
        <FontAwesomeIcon icon={faFish} />
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
  );
};

export default SideNav;
