import styles from '../../styles/Account.module.css';

const Banner = ({name}) => {
    return (
        <div className={styles.banner}>
            <h1>{name}</h1>
        </div>
    )
};

export default Banner;