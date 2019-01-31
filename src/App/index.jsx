import React, { useState, useEffect } from 'react'
import socketIoClient from 'socket.io-client'
import logo from '../logo.svg'
import styles from './index.module.sass'

const ENDPOINT = '//localhost:4000'

const convert = k => (k - 273.15).toPrecision(3)

const App = () => {
  const [response, setResponse] = useState(null)

  useEffect(() => {
    const socket = socketIoClient(ENDPOINT)
    socket.on('api', response => setResponse(response))
  }, [])

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <img className={styles.appLogo} src={logo} alt='logo' />
        <p>{response ? `Temperature: ${convert(response.temp)} C Sky: ${response.sky}` : 'Loading...'}</p>
        <a
          className={styles.appLink}
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
