import type { Metadata } from "next";
import { ViewportMode } from "./components/ViewportMode";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kulkaran Coaching Institute | Canada Based Coaching",
  description:
    "Canada-based coaching institute for offline Physics, Chemistry and Math, hybrid IELTS, and online French classes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ViewportMode />
        {children}
      </body>
    </html>
  );
}
