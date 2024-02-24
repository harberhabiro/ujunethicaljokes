import { useState } from "react";
import Link from "next/link";
import {useRouter} from 'next/router';
import styles from "../../styles/Auth.module.css";

const login = () => {
    //change validation to client side validation instead of server side
    const router = useRouter();

    const [inputs, setInputs] = useState({email: "", password: ""}); //probably add a confirm password
    const [errors, setErrors] = useState("");

    const {name, email, password} = inputs;

    const onChange = e => setInputs({...inputs, [e.target.name]: e.target.value});

    const onFormSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password})
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
                <h1>Login</h1>
            </div>   
            <div className={styles.parts}>
                <form onSubmit={onFormSubmit}>
                    <input type="email" name="email" placeholder="Email" value={email} onChange={e => onChange(e)} required />
                    {/* {errors.email ? <p>{errors.email.msg}</p> : ""} */}
                    <br />
                    <input type="password" name="password" placeholder="Password" value={password} onChange={e => onChange(e)} required />
                    {/* {errors.password ? <p>{errors.password.msg}</p> : ""} */}
                    <br />
                    <input type="submit" value="Login" />
                </form>
                <div className={styles.rules}>
                    <div className="main">
                        <p>Rules & guidlines</p>
                    </div>
                    <div className="rules">
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

export default login;