import type { Metadata } from "next";
import "./globals.css";
import SideNav from "@/app/_components/SideNav";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "NextBlogApp",
  description: "Built to learn Next.js and modern web development.",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <html lang="ja">
      <body>
        <SideNav />
        <div className="md:pl-14">
          <main className="mx-auto mt-2 max-w-2xl px-4">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
