import Header from '../components/Header';

const LandingPage = () => {
  const loggedIn = localStorage.getItem('loggedIn');

  if (loggedIn) {
    window.location.href = '/tasks';
  }

  return (
    <>
      <Header />
      <div className='container centered'>
        <a href='https://discord.com/api/oauth2/authorize?client_id=969922012199931904&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify'>
          <button className='btn'>Log in with discord</button>
        </a>
      </div>
    </>
  );
};

export default LandingPage;
