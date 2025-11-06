import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Demo Project - Welcome</title>
        <meta name="description" content="A demo test project showcasing GitHub and Vercel deployment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.highlight}>Demo Project</span>
          </h1>
          
          <p className={styles.description}>
            A demonstration project showcasing GitHub integration and Vercel deployment
          </p>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h2>🚀 Vercel Deployment</h2>
              <p>
                This project is deployed on Vercel, providing fast, global CDN delivery
                and automatic HTTPS.
              </p>
            </div>

            <div className={styles.card}>
              <h2>📦 GitHub Integration</h2>
              <p>
                Version controlled with Git and hosted on GitHub for seamless
                collaboration and deployment.
              </p>
            </div>

            <div className={styles.card}>
              <h2>⚡ Next.js Framework</h2>
              <p>
                Built with Next.js for optimal performance, SEO, and developer
                experience.
              </p>
            </div>

            <div className={styles.card}>
              <h2>🎨 Modern Design</h2>
              <p>
                Responsive and mobile-friendly design that works on all devices
                and screen sizes.
              </p>
            </div>
          </div>

          <div className={styles.footer}>
            <p>
              <strong>Status:</strong> ✅ Successfully deployed and running
            </p>
            <p className={styles.links}>
              <a href="https://github.com/yourusername/demo" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
              {' • '}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                Powered by Vercel
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

