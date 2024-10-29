import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Navigation } from "~/app/navigation";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <div className="flex justify-center w-full">
        <div className="w-[90%] max-w-screen-sm">
          <Navigation />
          {children}
        </div>
        </div>
      </body>
    </html>
  );
}
