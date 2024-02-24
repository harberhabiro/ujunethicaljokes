import Banner from "../../components/account/Banner";
import RegisterForm from "../../components/account/RegisterForm";
import Rules from "../../components/account/Rules";
import styles from '../../styles/Account.module.css';

const register = () => {
    return (
        <div>
            <Banner name={"Register"} />
            <div className={styles.parts}>
                <RegisterForm />
                <Rules />
            </div>
        </div>
    )
}

export default register;