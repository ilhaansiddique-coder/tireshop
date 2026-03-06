import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";

export const metadata = {
  title: {
    default: "Däckcentrum — Premium Tyre Specialists",
    template: "%s | Däckcentrum",
  },
  description:
    "Helsingborg's trusted tyre specialist. Browse thousands of premium tyres, book fitting, wheel alignment, rim renovation and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inject theme before React hydrates to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="font-body min-h-screen bg-base-100 text-base-content antialiased">
        <Navbar />
        <main className="pt-[60px]">{children}</main>
        <CartDrawer />
      </body>
    </html>
  );
}
