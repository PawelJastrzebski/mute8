import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';

function Logo() {
  const logo = <div></div>
  return (
    <div className="my-card">
      <div id='logo'>{logo}</div>
    </div>
  )
}

function HeroSection() {
  const location = useLocation();
  return (
    <div id='hero-section'>
      <div className="logo-section">
        <div className="logo"></div>
      </div>
      <div className="text-section">
        <div className="text">
          <h2>Simple yet Powerful</h2>
          <p>
            When it comes to coding, remember that "less is more." Build applications swiftly with a streamlined state flow, avoiding unnecessary boilerplate code.
          </p>
          <Link to={"/mute8/docs/intro"}>
            <button className='my-button'>Read More</button>
          </Link>
        </div>
      </div>

    </div>
  )

}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      noFooter={true}
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <Logo />
      <HeroSection />
      <main>
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
