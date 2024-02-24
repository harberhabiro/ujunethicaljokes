import { useState, useRef } from 'react';
// import styles from '../../styles/Account.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPasswordForm = () => {
    const recaptchaRef = useRef();
    const [inputs, setInputs] = useState({email: ""});

    const {email} = inputs;

    const onChange = e => setInputs({...inputs, [e.target.name]: e.target.value});

    const onFormSubmit = async e => {
        e.preventDefault();
        try {
            const captcha = await recaptchaRef.current.executeAsync();

            if(!captcha) return;

            const spinner = toast.loading("please wait");

            const res = await fetch("http://localhost:5000/changes/forgot-password", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, captcha})
            });

            const data = await res.json();

            if(!data.success) {
                Array.isArray(data.msg) ? data.msg.map(err => toast.update(spinner, {render: err.msg, type: "error", isLoading: false, autoClose: 5000})) : toast.update(spinner, {render: data.msg, type: "error", isLoading: false, autoClose: 5000});
            } else {
                toast.update(spinner, { render: "Email has been sent to reset the password, please check your inbox", type: "success", isLoading: false, autoClose: 5000})
            }

            recaptchaRef.current.reset();
        } catch (err) {
           console.error(err.message);
        }
    };

    return (
        <form onSubmit={onFormSubmit}>
            <ReCAPTCHA
                ref={recaptchaRef}
                size='invisible'
                sitekey="6LdmcLsjAAAAADAU-CO1NF3m9T7P_InlX0HIEcX6"
            />
            <ToastContainer />
            <input type="email" name="email" placeholder="Email" value={email} onChange={e => onChange(e)} required />
            <br />
            <input type="submit" value="Reset Password" />
        </form>
    )
};

export default ForgotPasswordForm;