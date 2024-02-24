import Banner from '../../components/account/Banner';
import LoginForm from '../../components/account/LoginForm';
import Rules from '../../components/account/Rules';
import styles from '../../styles/Account.module.css';

const login = () => {
    return (
        <>
        <Banner name={"Login"} />
        <div className={styles.parts}>
        <LoginForm />
        <Rules />
        </div>
        </>
    )
};

export default login;