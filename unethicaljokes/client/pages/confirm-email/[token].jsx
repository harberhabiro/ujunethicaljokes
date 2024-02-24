import {useRouter} from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const verifyEmail = () => {
    const router = useRouter();
    const [error, setError] = useState("");

    useEffect(() => {
        if(!router.isReady) return;
        confirmEmail();
    }, [router.isReady]);

    const confirmEmail = async () => {
        try {
            const res = await fetch(`http://localhost:5000/email/verify/${router.query.token}`, {
                method: "POST"
            });
            
            const data = await res.json();

            !data.success ? setError(data.msg) : router.push("/dashboard");
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <>
        {error ? (<div><p>{error}</p> <p>To resend click the button below</p> <Link href="/resend">Resend email verification</Link> </div>) : ""}
        </>
    );
};

export default verifyEmail;