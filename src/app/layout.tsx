import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: "Rebane's Discord Colored Text Generator",
  description: 'A tool to create colored text for Discord messages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}