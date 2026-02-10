import "./globals.css";

export const metadata = {
  title: "Memo Sprout",
  description: "Grow your memory, one match at a time",
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
