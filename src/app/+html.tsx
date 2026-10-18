import { ScrollViewStyleReset } from 'expo-router/html';
import { ReactNode } from 'react';

// Static, public metadata only. Never serialize private evidence or local saves here.
export default function Root({ children }: { children: ReactNode }) {
  return <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="Two players. One shared phone. Compare private clues and solve five free mysteries at the Bellweather Hotel. Start with The Last Reservation." />
      <meta name="theme-color" content="#101E29" />
      <ScrollViewStyleReset />
    </head>
    <body>{children}</body>
  </html>;
}
