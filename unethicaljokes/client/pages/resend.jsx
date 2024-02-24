import { useState } from "react";
import Router, {useRouter} from 'next/router';

const resend = () => {

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState("");

    const onFormSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/email/resend", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email})
            });

            const data = await res.json();

            !data.success ? setErrors(data.msg) : Router.push("/login");
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <>
        <form onSubmit={onFormSubmit}>
            <input type="email" name="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}  />
            <input type="submit" value="Resend" />
        </form>
        {errors ? <p>{errors}</p> : ""}
        </>
    )
};

export default resend;