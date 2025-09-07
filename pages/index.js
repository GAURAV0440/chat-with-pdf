import Head from 'next/head';
import UploadForm from '../components/UploadForm';
import QuestionForm from '../components/QuestionForm';
import styles from '../styles/Home.module.css'; // ✅ import CSS

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>PDF Q&A App</title>
        <meta name="description" content="Ask questions based on PDF content" />
      </Head>

      <div className={styles.card}>
        <h1 className={styles.title}>📄 PDF Q&A Assistant</h1>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Step 1: Upload a PDF</h2>
          <UploadForm />
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Step 2: Ask a Question</h2>
          <QuestionForm />
        </div>

        <footer className={styles.footer}>
        </footer>
      </div>
    </div>
  );
}
