import { randomBytes } from "crypto";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

export default function MyDocument({ nonce }: { nonce: string }) {
  return (
    <Html lang="en">
      <Head nonce={nonce}>
        <link rel="icon" href="/assets/favicon.svg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
    const nonce = randomBytes(8).toString("base64");
    const myDocumentProps = await Document.getInitialProps(ctx)

    const CSP = `
      default-src 'none' ;
      script-src-elem 'self';
      script-src-attr 'self';
      script-src 'self' ${
        process.env.NODE_ENV === "development" ? "'unsafe-eval'" : `'nonce-${nonce}'`
      };
      connect-src 'self' ${process.env.API_URL};
      style-src 'self' ${
        process.env.NODE_ENV === "development"
          ? "'unsafe-inline'"
          : `'nonce-${nonce}'`
      };
      font-src 'self';
      img-src 'self';
    `;

    if (ctx.res !== undefined) {
      ctx.res.setHeader(
        "Content-Security-Policy",
        CSP.replace(/\s{2,}/g, " ").trim()
      );
    }

    return {
      ...myDocumentProps,
      nonce,
    };
}
