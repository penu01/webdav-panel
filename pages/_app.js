import '@styles/globals.css'
import '../quiz/styles/quiz.css'
import Head from 'next/head'
import { ThemeProvider } from '@context/ThemeContext'
import { SettingsProvider } from '@context/SettingsContext'

function Application({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Head>
          <title>WebDAV Panel</title>
          <meta name="description" content="A modern WebDAV client panel" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <Component {...pageProps} />
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default Application
