import { useState } from "react";
import Link from "next/link";
import {useRouter} from 'next/router';
import styles from "../../styles/Auth.module.css";
import { toast } from "react-toastify";

const register = () => {

    const router = useRouter();

    const [inputs, setInputs] = useState({name: "", email: "", password: "", passwordConfirmation: ""});
    const [check, setCheck] = useState(false);
    const [errors, setErrors] = useState("");

    const {name, email, password, passwordConfirmation} = inputs;

    const onChange = e => setInputs({...inputs, [e.target.name]: e.target.value});

    const onFormSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, email, password, passwordConfirmation})
            });

            const data = await res.json();

            console.log(data.msg)
            !data.success ? setErrors(data.msg) : router.push("/dashboard");
        } catch (err) {
            console.error(err.message);
        }
    };

    console.log(errors)

    return (
        <div className={styles.content}>
            <div className={styles.banner}>
                <h1>Register</h1>
            </div>   
            <div className={styles.parts}>
                <form onSubmit={onFormSubmit}>
                    
                    <input type="text" name="name" placeholder="Username" value={name} onChange={e => onChange(e)} required />
                    <br />
                    <input type="email" name="email" placeholder="Email" value={email} onChange={e => onChange(e)} required />
                    <br />
                    <input type={!check ? "password" : "text"} name="password" placeholder="Password" value={password} onChange={e => onChange(e)} required />
                    <br />
                    <input type={!check ? "password" : "text"} name="passwordConfirmation" placeholder="Confirm Password" value={passwordConfirmation} onChange={e => onChange(e)} required />
                    <br />
                    <label htmlFor="showpassword">Show password</label>
                    <input type="checkbox" name="showpassword" onClick={() => setCheck(!check)} /> 
                    <br />
                    <input type="submit" value="Register" />
                </form>
                <div className={styles.rules}>
                    <div className="main">
                        <p>Rules & guidlines</p>
                    </div>
                    <div className={styles.guides}>
                        <ol>
                            <li>Follow goverment, state laws</li>
                            <li>Don't do anything stupid</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default register;