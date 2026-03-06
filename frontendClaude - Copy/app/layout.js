import "./globals.css";
import AppShell from "./components/AppShell";

export const metadata = {
  title: "TireStore - Premium Tyres",
  description: "Find the perfect tyres for your vehicle. Wide selection, competitive prices.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="noise bg-base-100 text-base-content">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
