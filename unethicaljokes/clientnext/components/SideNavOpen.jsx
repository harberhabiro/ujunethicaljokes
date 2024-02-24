import styles from '../styles/SideNavOpen.module.css';
import Link from 'next/link';

const SideNavOpen = ({click, setClick}) => {
    return (
        <nav className={styles.sideNav} style={{transform: click ? "" : "translate(-100%)", transitionDelay: click ? ".25s" : ""}}>
            <span onClick={() => setClick(false)}><i className="fa fa-remove"></i></span>
            <p>Sections</p>
            <ul>
                <li>
                    <Link href="/" className={styles.links}><i className="fa fa-globe"></i>Joke</Link>
                </li>
                <li>
                    <Link href="/" className={styles.links}><i className="fa fa-globe"></i>Leaderboard</Link>
                </li>
                <li>
                    <Link href="/rules" className={styles.links}><i className="fa fa-globe"></i>Rules</Link>
                </li>
                <li>
                    <Link href="/annoucements" className={styles.links}><i className="fa fa-globe"></i>Annoucements</Link>
                </li>
            </ul>
            <div className={styles.account}>
                <p>Account</p>
                <Link href="/account/register" className={styles.accountLinks}>Register</Link>
                <Link href="/account/login" className={styles.accountLinks}>Login</Link>
                <Link href="/account/forgotpassword" className={styles.accountLinks}>Forgot Password</Link>
            </div>
            <p>Main Links</p>
            <Link className={styles.allLinks} href="/about">About</Link>
            <Link className={styles.allLinks} href="/FAQS">FAQS</Link>
            <Link className={styles.allLinks} href="/terms">Terms and condition</Link>
            <Link className={styles.allLinks} href="/privacy">Privacy Policy</Link>
            <Link className={styles.allLinks} href="/contact">Contact Us</Link>
        </nav>
    )
}

export default SideNavOpen;