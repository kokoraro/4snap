import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="twitter:image" content="/logo.svg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="4snap" />
        <meta property="og:image" content="/screenshots/4snap-bg.png" />
      </Head>
      <title>4snap</title>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
