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
      <Head nonce={nonce} />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
    const nonce = randomBytes(8).toString("base64");
    const initialProps = await Document.getInitialProps(ctx)

    const CSP = `
      default-src 'none' ;
      script-src-elem 'self';
      script-src-attr 'self';
      script-src 'self' ${
        process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""
      };
      connect-src 'self' http://127.0.0.1:8090;
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
      ...initialProps,
      nonce,
    };
}