import Header from '../components/Header';
import { discord_url } from '../url';

const LandingPage = () => {
  const loggedIn = localStorage.getItem('loggedIn');

  if (loggedIn) {
    window.location.href = '/tasks';
  }

  return (
    <>
      <Header />
      <div className='container centered'>
        <a href={discord_url}>
          <button className='btn'>Log in with discord</button>
        </a>
      </div>
    </>
  );
};

export default LandingPage;
