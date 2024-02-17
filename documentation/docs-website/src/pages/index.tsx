import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';

function Logo() {
  const logo = <div><div className="img"></div></div>
  return (
    <div className="my-card">
      <div id='logo'>{logo}</div>
    </div>
  )
}

const frameworks = [
  { url: "https://angular.io/assets/images/logos/angular/angular.svg", alt: "angular", color: "DD0031" },
  { url: "https://raw.githubusercontent.com/prplx/svg-logos/master/svg/preact.svg", alt: "preact", color: "762CFB" },
  { url: "https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg", alt: "vue", color: "41B883" },
  { url: "https://raw.githubusercontent.com/prplx/svg-logos/master/svg/react.svg", alt: "react", color: "61DAFB" },
  { url: "https://raw.githubusercontent.com/prplx/svg-logos/master/svg/solidjs-icon.svg", alt: "solidjs", color: "3864A5" },
]

function FrameworksSection() {
  const items = frameworks.map(logo => {
    return (
      <img style={{ filter: `drop-shadow(2px 2px 0.7rem #${logo.color})` }} width="90px" src={logo.url} key={logo.alt} alt={logo.alt} />
    )
  })

  return <div id='frameworks-section'>
    <h2>Versatile</h2>
    <div className="items">{items}</div>
  </div>
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
          <Link to={"/mute8/docs/project/getting-started"}>
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
      noFooter={false}>
      <Logo />
      <HeroSection />
      <FrameworksSection />
    </Layout>
  );
}
