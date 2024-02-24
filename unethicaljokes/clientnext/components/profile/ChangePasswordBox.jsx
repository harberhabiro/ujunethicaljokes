import { useRef, useState } from 'react';
import styles from '../../styles/Profile.module.css';
import Router, {useRouter} from 'next/router';

const ChangePasswordBox = ({icon, title, description}) => {

    const router = useRouter();

    return (
        <div className={`${styles.changeBoxes} ${styles.changeBox} ${styles.changePass}`} onClick={() => router.push('/account/changepassword') } >
            <i className={`${icon} ${styles.changeIcon}`}></i>
            <p className={styles.changeTitle}>{title}</p>
            <p className={styles.changeTxt}>{description}</p>
        </div>
    )
}

export default ChangePasswordBox;