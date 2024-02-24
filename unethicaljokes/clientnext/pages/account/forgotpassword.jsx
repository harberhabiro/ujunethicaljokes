import Banner from '../../components/account/Banner';
import ForgotPasswordForm from '../../components/account/ForgotPasswordForm';
import Rules from '../../components/account/Rules';
import styles from '../../styles/Account.module.css';

const forgotpassword = () => { //change the forgot form fetch
    return (
        <>
        <Banner name="Forgot Password" />
        <div className={styles.parts}>
            <ForgotPasswordForm />
            <Rules />
        </div>
        </>
    )
}

export default forgotpassword;