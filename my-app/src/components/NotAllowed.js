import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotLoggedIn(){
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/');
      };
    return (
        <>
        <p>Morate se ulogovati kao organizacija kako bi mogli da pristupite ovoj stranici</p>
        <form onSubmit={handleSubmit}>
            <button type="submit">Login</button>
        </form>
        </>
    );
}
