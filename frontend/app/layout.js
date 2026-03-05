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
    <html lang="en">
      <body className="noise">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
