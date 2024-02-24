import { useState } from "react";
import styles from "../styles/Navbar.module.css";
import Link from 'next/link';

const Navbar = ({click, setClick}) => { //come back to finish the search part

    const [search, setSearch] = useState("");

    const onFormSubmit = e => e.preventDefault();

    return (
        <nav className={styles.navBar}>
            <h1 className={styles.logo}>Unethical Jokes</h1>
            <div className={styles.navCenter}>
                    <div className={styles.burger}>
                        <Link href="#" className={styles.burgerLink} onClick={() => setClick(!click)}><i className="fa fa-reorder"></i></Link>
                    </div>
                    <div className={styles.textNav}>
                        <Link className={styles.textNavLinks} href="#">Joke</Link>
                        <Link className={styles.textNavLinks} href="#">Leaderboard</Link>
                        <Link className={styles.textNavLinks} href="/about">About Us</Link>
                        <Link className={styles.textNavLinks} href="/contact">Contact Us</Link>
                    </div>
            </div>
            <div className={styles.searchBar}>
               <form >
                    <input type="text" name="search" placeholder="Search for jokes" />
                    <button><i className="fa fa-search"></i></button>
                </form> 
            </div>
            <div className={styles.navRight}>
                <Link href="/account/login" className={styles.navRightLink}>Login</Link>
                <Link href="/account/register" className={styles.navRightLink}>Register</Link>
            </div>
        </nav>
    )
};

export default Navbar;