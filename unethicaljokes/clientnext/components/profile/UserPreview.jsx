import styles from '../../styles/Profile.module.css';
import Image from 'next/image';

const UserPreview = ({file}) => {

    // console.log(file)

    return (
        <div className={styles.changeBoxes}>
            {file ? <Image className={styles.changeAvatarImg} width={100} height={100} src={`${file}`} alt="Avatar" /> : <i className={`fa fa-user ${styles.changeAvatarIcon}`} ></i>}
        </div>
    )
}

export default UserPreview;