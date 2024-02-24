import styles from '../../styles/Profile.module.css';
import UserPreview from './UserPreview';
import ChangeBox from './ChangeBox';
import ChangePasswordBox from './ChangePasswordBox';
import { useState } from 'react';

const Changes = () => {

    const [file, setFile] = useState(null);

    // console.log(file === null ? "" : file)

    return (
        <div className={styles.changes}>
            <UserPreview file={file !== null ? file : ""} />
            <ChangeBox icon="fa fa-user" title="Change Avatar" description="Enter please" setFile={setFile} />
            <ChangePasswordBox icon="fa fa-power-off" title="Change Password" />
        </div>
    )
}

export default Changes;