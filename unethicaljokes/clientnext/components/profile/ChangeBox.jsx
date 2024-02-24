import { useRef, useState } from 'react';
import styles from '../../styles/Profile.module.css';

const ChangeBox = ({icon, title, description, setFile}) => {

    const inputFile = useRef(null);

    const onFileChange = e => {
        if(e.target.files.length > 0) {
            const file = e.target.files;
            const fr = new FileReader();
            fr.onload = () => {
                setFile(fr.result)
            }
            fr.readAsDataURL(file[0]);
        }
    };

    return (
        <div className={`${styles.changeBoxes} ${styles.changeBox}`} onClick={() => inputFile.current.click()} >
            <input type="file" name="file" id="changeAvatar" ref={inputFile} style={{display: "none"}} onChange={e => onFileChange(e)} />
            <i className={`${icon} ${styles.changeIcon}`}></i>
            <p className={styles.changeTitle}>{title}</p>
            <p className={styles.changeTxt}>{description}</p>
        </div>
    )
}

export default ChangeBox;