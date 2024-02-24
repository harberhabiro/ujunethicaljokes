import Link from 'next/link';
import styles from '../styles/SideNav.module.css';

const SideNav = ({click}) => {
    return (
        <nav className={styles.sideNav} style={{transform: !click ? "" : "translate(-100%)", transitionDelay: !click ? ".25s" : ""}}>
            <ul>
                <li>
                    <Link href="/"><span><i className="fa fa-newspaper-o"></i></span></Link>
                </li>
                <li>
                    <Link href="/"><span><i className="fa fa-line-chart"></i></span></Link>
                </li>
                <li>
                    <Link href="/rules"><span><i className="fa fa-gavel"></i></span></Link>
                </li>
                <li>
                    <Link href="/annoucements"><span><i className="fa fa-calendar"></i></span></Link>
                </li>
            </ul>
        </nav>
    )
}

export default SideNav;