import styles from '../styles/MainLinks.module.css';

const FAQS = () => {
    return (
        <div className={styles.faqs}>
            <div className={styles.articleItem}>
                <h1 className={styles.articleHeading}>FAQ</h1>
            </div>
            <div className={styles.articleItem}>
                <h2 className={styles.articleHeading}>1. Can anyone submit a post?</h2>
                <p className={styles.articleText}>Yes anyone can post. But to prevent spamming there is a cap on posting rate. This restriction is valid for same for sickipedia premium and non-premium users.</p>
            </div>
            <div className={styles.articleItem}>
                <h2 className={styles.articleHeading}>2. Can posts be edited after they're published?</h2>
                <p className={styles.articleText}>Yes there's an edit option that lets you edit your post.</p>
            </div>
            <div className={styles.articleItem}>
                <h2 className={styles.articleHeading}>3. I have a suggestion, what should I do?</h2>
                <p className={styles.articleText}>You can send your suggestion to us at this email: contact@sickipedia.net.</p>
            </div>
            <div className={styles.articleItem}>
                <h2 className={styles.articleHeading}>4. My post has been taken down. What did I do wrong?</h2>
                <p className={styles.articleText}>If a moderator has not provided with a reason for taking the post down. You can contact them. Jokes are usually taken down to avoid reposts. In rare cases it can also be taken down if there was no attempt at humour.</p>
            </div>
            <div className={styles.articleItem}>
                <h2 className={styles.articleHeading}>5. Can usernames be changed?</h2>
                <p className={styles.articleText}>No it cannot be changed. Once you create an account with a username it is going to stay that way.</p>
            </div>
            <div className={styles.articleItem}>
                <h2 className={styles.articleHeading}>6. Someone posted your personal information in one of the post?</h2>
                <p className={styles.articleText}>You can report such posts so that we can take them down. Sickipedia doesn't allow private information to be posted on the site.</p>
            </div>
            <div className={styles.articleItem}>
                <h2 className={styles.articleHeading}>7. Can a user post content involving politics and politicians?</h2>
                <p className={styles.articleText}>Absolutely.</p>
            </div>
        </div>
    )
}

export default FAQS;