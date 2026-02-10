"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/app/_hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Header: React.FC = () => {
  const router = useRouter();
  const { isLoading, session } = useAuth();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <>
      {/* 右上メニューアイコン */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 text-black hover:opacity-70"
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      {/* メニューパネル */}
      {open && (
        <div className="fixed top-14 right-4 z-40 w-48 border border-black bg-white text-sm">
          <nav className="flex flex-col">
            <Link href="/" className="px-4 py-2 hover:bg-gray-100">
              Home
            </Link>
            <Link href="/about" className="px-4 py-2 hover:bg-gray-100">
              部活紹介
            </Link>
            <Link href="/schedule" className="px-4 py-2 hover:bg-gray-100">
              活動スケジュール
            </Link>

            {!isLoading &&
              (session ? (
                <button
                  onClick={logout}
                  className="px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" className="px-4 py-2 hover:bg-gray-100">
                  Login
                </Link>
              ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
