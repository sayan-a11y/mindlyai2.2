import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mindly AI 2.2 — Your Smart AI Assistant',
  description: 'Fast, private, all-in-one AI assistant. Mindly 2.2 Fast, Pro, Coding, and Think.',
  icons: {
    icon: '/favicon.png',
    apple: '/mindly-icon-192.png',
  },
  openGraph: {
    title: 'Mindly AI 2.2 — Your Smart AI Assistant',
    description: 'Fast, private, all-in-one AI assistant.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mindly AI 2.2 — Your Smart AI Assistant',
    description: 'Fast, private, all-in-one AI assistant.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('mindly_settings_v2');
                  var theme = 'light';
                  if (saved) {
                    var parsed = JSON.parse(saved);
                    if (parsed && parsed.theme) {
                      theme = parsed.theme;
                    }
                  }
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  var docEl = document.documentElement;
                  if (isDark) {
                    docEl.classList.add('dark');
                    docEl.style.colorScheme = 'dark';
                    docEl.style.backgroundColor = '#0F0F10';
                  } else {
                    docEl.classList.remove('dark');
                    docEl.style.colorScheme = 'light';
                    docEl.style.backgroundColor = '#FFFFFF';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased font-sans text-neutral-900 bg-white dark:bg-[#0F0F10] dark:text-[#F5F5F5] selection:bg-neutral-200 dark:selection:bg-neutral-800 min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
