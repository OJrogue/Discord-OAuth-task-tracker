import httpClient from '../httpClient';
import { url } from '../url';
import { discord_url } from '../url';
import { useState } from 'react';

const LoginPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    'An error occured please try again later'
  );

  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');

  if (!code) {
    window.location.href = '/';
  }

  (async () => {
    try {
      const resp = await httpClient.get(`${url}/auth?code=${code}`, {
        code,
      });

      localStorage.setItem('loggedIn', true);
      window.location.href = '/tasks';
    } catch (error) {
      setLoading(false);
      if (error.response.status === 401) {
        setMessage('Invalid login, please try again');
      }
    }
  })();

  return (
    <>
      {loading ? (
        <div className='loader'></div>
      ) : (
        <div className='error'>
          <p>{message}</p>

          <a href={discord_url}>
            <button className='btn_bigger'>Log in with discord</button>
          </a>
        </div>
      )}
    </>
  );
};

export default LoginPage;
