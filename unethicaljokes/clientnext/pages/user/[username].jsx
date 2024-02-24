import { useEffect, useState } from "react";
import Profile from "../../components/user/Profile";

const user = ({data}) => {

    // console.log(data)
    
    return (
        <div className="userParent">
            {!data.success ? "" : <Profile profile={data} />}
            <div style={{backgroundColor: "red"}}>
                hello
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const res = await fetch(`http://localhost:5000/profile/get-profile/${context.params.username}`);

    const data = await res.json();
    console.log(data.msg)
    return {props: {data}}
}

export default user;