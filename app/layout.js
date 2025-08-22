export const metadata = {
  title: "Founder-Led Personal Brand",
  description: "Private landing page",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
