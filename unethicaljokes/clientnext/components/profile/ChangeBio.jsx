import { useState } from 'react';
import styles from '../../styles/MainLinks.module.css';
import profileStyles from '../../styles/Profile.module.css';

const ChangeBio = () => {

    const [bio, setBio] = useState("");

    const onFormSubmit = async e => {
        e.preventDefault();
        try {
            
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className={styles.changeBio}>
            <p className={styles.articleHeading}>About Your Profile</p>
            <form onSubmit={onFormSubmit} style={{marginTop: "36px"}}>
                <textarea className={profileStyles.bioTxt} name="description" value={bio} onChange={e => setBio(e.target.value)} placeholder="Write a little description of yourself"  maxLength="500" required></textarea>
                <input type="submit" value="Update Profile" className={profileStyles.bioBtn} />
            </form>
        </div>
    )
}

export default ChangeBio;