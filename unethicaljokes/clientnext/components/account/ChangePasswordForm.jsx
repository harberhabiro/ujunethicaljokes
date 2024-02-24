import { toast, ToastContainer } from 'react-toastify';
import { useState, useRef } from 'react';
import styles from '../../styles/Account.module.css';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from "react-google-recaptcha";

const ChangePasswordForm = () => {
    const recaptchaRef = useRef();
    const [show, setShow] = useState({check1: false, check2: false, check3: false});
    const [inputs, setInputs] = useState({currentPassword: "", password: "", passwordConfirmation: ""});

    const {currentPassword, password, passwordConfirmation} = inputs;

    const onChange = e => setInputs({...inputs, [e.target.name]: e.target.value});

    const onFormSubmit = async e => {
        e.preventDefault();
        try {
            const captcha = await recaptchaRef.current.executeAsync();

            if(!captcha) return;

            const spinner = toast.loading("please wait");

            const res = await fetch(`http://localhost:5000/changes/password-change`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({currentPassword, password, passwordConfirmation, captcha})
            });

            const data = await res.json();

            if(!data.success) {
                Array.isArray(data.msg) ? data.msg.map(err => toast.update(spinner, {render: err.msg, type: "error", isLoading: false, autoClose: 5000})) : toast.update(spinner, {render: data.msg, type: "error", isLoading: false, autoClose: 5000});
            } else {
                toast.update(spinner, { render: "Password has been changed", type: "success", isLoading: false, autoClose: 5000})
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
            <div className={styles.formData}>
                <input type={!show.check1 ? "password" : "text"} name="currentPassword" placeholder="Current Password" value={currentPassword} onChange={e => onChange(e)} autoComplete='false' required />
                <button onClick={e => {e.preventDefault(); setShow({...show, check1: !show.check1})}}><i className={!show.check1 ? "fa fa-eye-slash" : "fa fa-eye"}></i></button>
            </div>
            <div className={styles.formData}>
                <input type={!show.check2 ? "password" : "text"} name="password" placeholder="Password" value={password} onChange={e => onChange(e)} autoComplete='false' pattern="^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*).{8,}$" title="Password must be at least 8 characters long, 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol" required />
                <button onClick={e => {e.preventDefault(); setShow({...show, check2: !show.check2})}}><i className={!show.check2 ? "fa fa-eye-slash" : "fa fa-eye"}></i></button>
            </div>
            <div className={styles.formData}>
                <input type={!show.check3 ? "password" : "text"} name="passwordConfirmation" placeholder="Confirm New Password" value={passwordConfirmation} onChange={e => onChange(e)} autoComplete='false' pattern={`${password}`} title="Passwords must match" required />
                <button onClick={e => {e.preventDefault(); setShow({...show, check3: !show.check3})}}><i className={!show.check3 ? "fa fa-eye-slash" : "fa fa-eye"}></i></button>
            </div>
            <input type="submit" value="Change Password" />
        </form>
    )
}

export default ChangePasswordForm;