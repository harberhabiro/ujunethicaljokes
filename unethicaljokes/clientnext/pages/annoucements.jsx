import Banner from '../components/account/Banner';
import styles from '../styles/MainLinks.module.css';

const annoucements = () => {
    return (
        <>
        <Banner name="Annoucements" />
        <div className={styles.annoucements}>
            <div className={styles.accounceItem}>
                <p className={styles.announceText}>If you get any error, email us at contact@sickipedia.net</p>
            </div>
        </div>
        </>
    )
}

export default annoucements;