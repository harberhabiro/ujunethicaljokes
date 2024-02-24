import { useState, useRef } from 'react';
import styles from '../../styles/Account.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Script from 'next/script';
import ReCAPTCHA from "react-google-recaptcha";

const LoginForm = () => {
    const router = useRouter();
    const [show, setShow] = useState({check1: false});
    const [inputs, setInputs] = useState({email: "", password: ""});
    const recaptchaRef = useRef();

    const {email, password} = inputs;

    const onChange = e => setInputs({...inputs, [e.target.name]: e.target.value});

    const onFormSubmit = async e => {
        e.preventDefault();
        try {
            const captcha = await recaptchaRef.current.executeAsync();

            if(!captcha) return;

            const spinner = toast.loading("please wait");

            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password, captcha})
            });
            const data = await res.json();

            if(!data.success) {
                Array.isArray(data.msg) ? data.msg.map(err => toast.update(spinner, {render: err.msg, type: "error", isLoading: false, autoClose: 5000})) : toast.update(spinner, {render: data.msg, type: "error", isLoading: false, autoClose: 5000});
            } else {
                toast.update(spinner, { render: "Login success", type: "success", isLoading: false, autoClose: 3000})
                router.push("/");
            }
            
            recaptchaRef.current.reset();
        } catch (err) {
           console.error(err.message);
        }
    };

    return (
        <form onSubmit={onFormSubmit}>
            <Script src="https://www.google.com/recaptcha/api.js" async defer strategy='beforeInteractive' />
            <ReCAPTCHA
                ref={recaptchaRef}
                size='invisible'
                sitekey="6LdmcLsjAAAAADAU-CO1NF3m9T7P_InlX0HIEcX6"
            />
            <ToastContainer />
            <input type="email" name="email" placeholder="Email" value={email} onChange={e => onChange(e)} required />
            <br />
            <div className={styles.formData}>
                <input type={!show.check1 ? "password" : "text"} name="password" placeholder="Password" value={password} onChange={e => onChange(e)} autoComplete='false' required />
                <button onClick={e => {e.preventDefault(); setShow({...show, check1: !show.check1})}}><i className={!show.check1 ? "fa fa-eye-slash" : "fa fa-eye"}></i></button>
            </div>
            <input type="submit" value="Login" className={styles.loginButton} />
            <div className={styles.loginLinks}>
                <Link href="/account/forgotpassword" className={styles.loginLink}>Forgot Password?</Link>
                <Link href="/account/register" className={styles.loginLink}>Don't have account, register now!</Link>
            </div>
        </form>
    )
};

export default LoginForm;