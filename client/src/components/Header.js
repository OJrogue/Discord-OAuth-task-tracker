import httpClient from '../httpClient';
import { url } from '../url';
import { useState } from 'react';

const Header = ({ user }) => {
  const [logbtn, showLogbtn] = useState(false);
  const [logOutLoad, setLogOutLoad] = useState(false);

  const logout = () => {
    (async () => {
      try {
        setLogOutLoad(true);
        const resp = await httpClient.get(`${url}/logout`);
        localStorage.removeItem('loggedIn');
        window.location.href = '/';
      } catch (error) {
        if (error.response.status === 401) {
          alert('Something went wrong please try again');
        }
      }
    })();
  };

  return (
    <header className='header'>
      <div className='header_div'>
        <h1 className='title'>
          <a href='/'>Task Tracker</a>
        </h1>
        {user ? (
          <div>
            <div className='user' onClick={() => showLogbtn(!logbtn)}>
              <img
                className='icon'
                alt='user_icon'
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
              ></img>
              {user.username}
            </div>
            {logbtn && (
              <div className='logout' onClick={() => logout()}>
                {logOutLoad ? <div className='loader_m' /> : 'Logout'}
              </div>
            )}
          </div>
        ) : (
          <a href='https://discord.com/api/oauth2/authorize?client_id=969922012199931904&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify'>
            <button className='btn'>Log in</button>
          </a>
        )}
      </div>
    </header>
  );
};

Header.defaultProps = {
  user: false,
};

export default Header;
