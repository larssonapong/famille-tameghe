import { Outlet } from 'react-router-dom'
import styles from './MainLayout.module.css'

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        {/* Support both children and nested routes */}
        {children ?? <Outlet />}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Famille Tameghe · Bamougoum · Made by Larsson Apong</p>
      </footer>
    </div>
  )
}

export default MainLayout
