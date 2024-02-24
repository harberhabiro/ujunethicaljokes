import Navbar from "./Navbar";
import Meta from "./Meta";
import styles from '../styles/Layout.module.css';
import SideNav from "./SideNav";
import SideNavOpen from "./SideNavOpen";
import { useState } from "react";
import BottomNav from "./BottomNav";

const Layout = ({children}) => {

    const [click, setClick] = useState(false);

    return (
        <>
        <Meta />
        <Navbar click={click} setClick={setClick} />
        <SideNav click={click} />
        <SideNavOpen click={click} setClick={setClick} />
        <BottomNav />
        <div className={styles.content}>{children}</div>
        </>
    );
};

export default Layout;