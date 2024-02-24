import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import styles from '../../styles/MainLinks.module.css';
import accountStyles from '../../styles/Account.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from "react-google-recaptcha";

const emailverification = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [click, setClick] = useState(false);
    const [email, setEmail] = useState("");
    const recaptchaRef = useRef();

    useEffect(() => {
        if(!router.isReady) return;
        verifyEmail();
    }, [router.isReady]);

    const verifyEmail = async () => {
        try {
            const spinner = toast.loading("please wait");

            const res = await fetch(`http://localhost:5000/email/verify/${router.query.token}`, {
                method: "POST"
            });
            
            const data = await res.json();

            if(!data.success) {
                toast.update(spinner, { render: data.msg, type: "error", isLoading: false, autoClose: 3000})
                setError(data.msg)
            } else {
                toast.update(spinner, { render: "Verification successful", type: "success", isLoading: false, autoClose: 3000})
                setTimeout(() => router.push("/account/login"), 3000);
            }

            recaptchaRef.current.reset();
        } catch (err) {
            console.error(err.message);
        }
    }

    const onFormSubmit = async e => {
        e.preventDefault();
        try {
            const captcha = await recaptchaRef.current.executeAsync();
            console.log("hello")
            if(!captcha) return;

            const spinner = toast.loading("please wait");

            const res = await fetch(`http://localhost:5000/email/resend`, {
                method: "POST",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({email, captcha})
            });
            
            const data = await res.json();

            if(!data.success) {
                Array.isArray(data.msg) ? data.msg.map(err => toast.update(spinner, {render: err.msg, type: "error", isLoading: false, autoClose: 5000})) : toast.update(spinner, {render: data.msg, type: "error", isLoading: false, autoClose: 5000});
            } else {
                toast.update(spinner, { render: "Email has been sent, please check your inbox", type: "success", isLoading: false, autoClose: 5000})
            }
            
            recaptchaRef.current.reset();
        } catch (err) {
            console.error(err.message);
        }
    };
    

    return (
        <>
        <ReCAPTCHA
                ref={recaptchaRef}
                size='invisible'
                sitekey="6LdmcLsjAAAAADAU-CO1NF3m9T7P_InlX0HIEcX6"
        />
        <ToastContainer />
        {error !== "" ? <div className={styles.verify} style={{color: error ? "red" : "#4ff461", marginBottom: "1rem"}}>{error ? error : "Verification successful, please login"}</div> : ""}
        {click ? (
            <div className={accountStyles.parts}>
                <form onSubmit={onFormSubmit}>
                    <input type="email" name="email" placeholder="Please enter email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="submit" value="Resend" />
                </form>
            </div>
        ) : ""}
        {error !== "" && !click ? <span onClick={() => setClick(true)} style={{color: "purple", cursor: "pointer"}}>Resend email</span> : ""}
        </>
    )
}

export default emailverification;