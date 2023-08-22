import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Phone Book App</title>
        <meta name="description" content="Phone book application with GraphQL and Nextjs" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
