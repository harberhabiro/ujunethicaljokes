import styles from '../styles/BottomNav.module.css';
import Link from 'next/link';

const BottomNav = () => {
    return (
        <div className={styles.bottomNav}>
            <div className={styles.mainLinks}>
                <div className={styles.links}>
                    <Link href="/account/login" className={styles.link}>Login</Link>
                </div>
                <div className={styles.links}>
                    <Link href="/account/register" className={styles.link}>Register</Link>
                </div>
            </div>
        </div>
    )
}

export default BottomNav;