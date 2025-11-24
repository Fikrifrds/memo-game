import "./globals.css";

export const metadata = {
  title: "Memo Dami",
  description: "A fun memory matching game for everyone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
