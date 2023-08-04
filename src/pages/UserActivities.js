import React from 'react'
import { Link } from 'react-router-dom';
import { useUser } from '../context/Users.context';

export default function UserActivities() {

    const { userShortenUrl } = useUser();

    return (
        <div>
            <h1>Your Shorten URL's Are: {userShortenUrl.length}</h1>
            {userShortenUrl.map((item, i) => <li key={i}><Link style={{ color: "red" }} to={`${item}`}>{item}</Link></li>)}
        </div>
    )
}
