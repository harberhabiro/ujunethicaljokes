import Image from 'next/image';
import styles from "../../styles/User.module.css";

const Profile = ({profile}) => {
    return (
        <div className={styles.userProfile}>
            <div className={styles.userProfilePic}>
                {!profile.msg.user_pic ? <Image src={'/images/defaultAvatarPic.jpg'} width={100} height={110} className={`${styles.picStyle}`} /> : <Image src={profile.user_pic} width={100} height={110} className={`${styles.picStyle}`} />}
            </div>
            <div className={styles.profileContent}>
                <div className={styles.profileContentHeading}>
                    <p className={styles.ProfileHeadingOne}>{profile.msg.user_name}</p>
                    <p className={styles.ProfileHeadingTwo}>Joined: {Date(profile.msg.user_created)}</p>
                </div>
                <div className="achievement">
                    <div className="achievementStatus">
                        <p>77</p>
                        <p>Weekly Rank</p>
                    </div>
                    <div className="achievementStatus">
                        <p>3076</p>
                        <p>Total Score</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;