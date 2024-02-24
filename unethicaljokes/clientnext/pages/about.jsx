import styles from '../styles/MainLinks.module.css';

const about = () => {
    return (
        <div className={styles.about}>
            <div className={styles.articleItem}>
                <h2 className={styles.articleHeading}>About Us</h2>
                <p className={styles.articleText}>
                Unethical Jokes is an online joke encyclopedia which is home to many jokes. Unethical Jokes is dedicated to providing people with humor based around the latest news, events, celebrities, politics and so many other categories.
                </p>
            </div>
            <div className={styles.articleItem}>
                <p className={styles.articleText}>
                Basically it's a joke wiki which provides a nice, clean interface for submitting jokes, voting them up or down, rewarding the contributors with a digital token/coin/currency and then spending some time perusing the f-up topic of any choice.
                </p>
            </div>
        </div>
    )
}

export default about;