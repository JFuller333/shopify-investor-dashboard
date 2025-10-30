import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Professional investor dashboard for tracking project ROI, funding progress, and investment performance" />
        <meta name="author" content="InvestROI" />
        
        <meta property="og:title" content="InvestROI - Track Your Investment Returns" />
        <meta property="og:description" content="Professional investor dashboard for tracking project ROI, funding progress, and investment performance" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
