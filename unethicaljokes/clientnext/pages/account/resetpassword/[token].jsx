import Banner from '../../../components/account/Banner';
import ResetPasswordForm from '../../../components/account/ResetPasswordForm';
import Rules from '../../../components/account/Rules';
import styles from '../../../styles/Account.module.css';

const forgotpassword = () => { //change the forgot form fetch
    return (
        <>
        <Banner name="Reset Password" />
        <div className={styles.parts}>
            <ResetPasswordForm />
            <Rules />
        </div>
        </>
    )
}

export default forgotpassword;