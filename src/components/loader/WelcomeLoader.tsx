import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'
import styles from './WelcomeLoader.module.css'

const WelcomeLoader = () => {
  const { loaderVisible, setLoaderVisible } = useUIStore()

  useEffect(() => {
    if (!loaderVisible) return
    const timeout = window.setTimeout(() => {
      setLoaderVisible(false)
    }, 3600)

    return () => window.clearTimeout(timeout)
  }, [loaderVisible, setLoaderVisible])

  return (
    <AnimatePresence>
      {loaderVisible ? (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.pulse}
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className={styles.card}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.title}>Peuh Tameghe</h1>
            <p className={styles.subtitle}>« Pu su pepong »</p>
            <p className={styles.message}>
              La famille Tameghe s’ouvre pour partager l’histoire des Bamougoum, de nos ancêtres à
              chaque nouvelle génération.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default WelcomeLoader
