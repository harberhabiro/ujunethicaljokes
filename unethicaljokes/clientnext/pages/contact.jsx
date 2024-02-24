import styles from '../styles/MainLinks.module.css';

const contact = () => {
    return (
        <div className={styles.contact}>
            <h1 className={styles.articleHeading}>Get in Touch</h1>
            <div className={styles.articleItem}>
                <div className={styles.articleText}>
                    Unethical Jokes is an online joke encyclopedia which is home to over many jokes. If you have any questions about our products or services, please email us at contact@sickipedia.net
                </div>
            </div>
        </div>
    )
}

export default contact;