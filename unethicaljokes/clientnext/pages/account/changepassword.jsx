import Banner from "../../components/account/Banner";
import ChangePasswordForm from "../../components/account/ChangePasswordForm";
import Rules from "../../components/account/Rules";
import styles from '../../styles/Account.module.css';

const changepassword = () => {
    return (
        <>
        <Banner name="Change Password" />
        <div className={styles.parts}>
            <ChangePasswordForm />
            <Rules />
        </div>
        </>
    )
}

export default changepassword;