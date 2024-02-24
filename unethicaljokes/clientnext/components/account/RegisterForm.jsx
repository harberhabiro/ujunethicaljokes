import { useState, useRef } from 'react';
import styles from '../../styles/Account.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from 'next/router';
// import Script from 'next/script';
import ReCAPTCHA from "react-google-recaptcha";

const RegisterForm = () => {
    const router = useRouter();
    const [show, setShow] = useState({check1: false, check2: false});
    const recaptchaRef = useRef();
    const [inputs, setInputs] = useState({name: "", email: "", password: "", passwordConfirmation: ""});

    const {name, email, password, passwordConfirmation} = inputs;

    const onChange = e => setInputs({...inputs, [e.target.name]: e.target.value});

    const onFormSubmit = async e => {
        e.preventDefault();

        try {
            const captcha = await recaptchaRef.current.executeAsync();

            if(!captcha) return;

            const spinner = toast.loading("please wait");

            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, email, password, passwordConfirmation, captcha})
            });

            const data = await res.json();

            if(!data.success) {
                Array.isArray(data.msg) ? data.msg.map(err => toast.update(spinner, {render: err.msg, type: "error", isLoading: false, autoClose: 5000})) : toast.update(spinner, {render: data.msg, type: "error", isLoading: false, autoClose: 5000});
            } else {
                toast.update(spinner, { render: "Register success, email verification has been sent", type: "success", isLoading: false, autoClose: 3000})
                router.push("/");
            }

            recaptchaRef.current.reset();
        } catch (err) {
           console.error(err);
        }
    };

    return (
        <>
        {/* <Script src="https://www.google.com/recaptcha/api.js" async defer strategy='beforeInteractive' /> */}
        <form onSubmit={onFormSubmit}>
            <ReCAPTCHA
                ref={recaptchaRef}
                size='invisible'
                sitekey="6LdmcLsjAAAAADAU-CO1NF3m9T7P_InlX0HIEcX6"
            />
            <ToastContainer />
            <input type="text" name="name" placeholder="Username" value={name} onChange={e => onChange(e)} pattern="^.{3,20}$" title="Username must be 3-20 characters long" required />
            <br />
            <input type="email" name="email" placeholder="Email" value={email} onChange={e => onChange(e)} required />
            <br />
            <div className={styles.formData}>
                <input type={!show.check1 ? "password" : "text"} name="password" placeholder="Password" value={password} onChange={e => onChange(e)} autoComplete='false' pattern="^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*).{8,}$" title="Password must be at least 8 characters long, 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol" required />
                <button onClick={e => {e.preventDefault(); setShow({...show, check1: !show.check1})}}><i className={!show.check1 ? "fa fa-eye-slash" : "fa fa-eye"}></i></button>
            </div>
            <div className={styles.formData}>
                <input type={!show.check2 ? "password" : "text"} name="passwordConfirmation" placeholder="Confirm password" value={passwordConfirmation} onChange={e => onChange(e)} autoComplete='false' pattern={`${password}`} title="Passwords must match" required />
                <button onClick={e => {e.preventDefault(); setShow({...show, check2: !show.check2})}}><i className={!show.check2 ? "fa fa-eye-slash" : "fa fa-eye"}></i></button>
            </div>
            <div className={styles.terms}>
                <p>Terms and condition</p>
                <p>By creating account you agree to the Unethical Jokes terms and condition</p>
            </div>
            <input type="submit" value="Register" />
        </form>
        </>
    )
};

export default RegisterForm;