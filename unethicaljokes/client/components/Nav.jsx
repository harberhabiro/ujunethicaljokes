import { useState } from "react";
import styles from "../styles/Nav.module.css";
import Link from 'next/link';

const Nav = () => {

    const [search, setSearch] = useState("");

    const onFormSubmit = e => e.preventDefault();

    return (
        <nav className={styles.navBar}>
            <h1 className={styles.logo}>Unethical Jokes</h1>
            <div className={styles.navCenter}>
                    <div className={styles.burger}>
                        <a href="#"><i class="fa fa-reorder"></i></a>
                    </div>
                    <div className={styles.textNav}>
                        <a href="#">Joke</a>
                        <a href="#">Leaderboard</a>
                        <a href="#">About Us</a>
                        <a href="#">Contact Us</a>
                    </div>
            </div>
            <div className={styles.searchBar}>
               <form >
                    <input type="search" name="search" placeholder="Search for jokes" />
                    <button><i class="fa fa-search"></i></button>
                </form> 
            </div>
            <div className={styles.navRight}>
                <Link href="/account/login" className={styles.navRightLink}>Login</Link>
                <Link href="/account/register" className={styles.navRightLink}>Register</Link>
            </div>
        </nav>
    )
};

export default Nav;