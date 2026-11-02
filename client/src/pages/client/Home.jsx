
import Contact from '../../components/client/Contact.jsx';
import Hero from '../../components/client/Hero';
import MainAbout from '../../components/client/mainAbout.jsx';
import MainBlog from '../../components/client/mainBlog.jsx';
import Reviews from '../../components/client/Reviews.jsx';
import Team from '../../components/client/teamMember.jsx';
import Ticker from '../../components/client/subComponent/Ticker.jsx';


const Home = () => {
  return (
    <div className="bg-[#020602] min-h-screen text-white overflow-hidden">
      
      <main>
        <Hero />
        <Ticker />
        <MainAbout />
        <Reviews />
        <MainBlog />
        <Team />
        <Contact />
      </main>
      
    </div>
  );
};

export default Home;