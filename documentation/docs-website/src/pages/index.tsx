import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import angularLogo from "../../static/img/frameworks/angular_logo.png";
import solidLogo from "../../static/img/frameworks/solid_logo.png";
import preactLogo from "../../static/img/frameworks/preact_logo.png";
import vuewLogo from "../../static/img/frameworks/vue_logo.png";
import reactLogo from "../../static/img/frameworks/react_logo.png";

function Logo() {
  const logo = <div><div className="img"></div></div>
  return (
    <div className="my-card">
      <div id='logo'>{logo}</div>
    </div>
  )
}

const frameworks = [
  { url: angularLogo, alt: "mute8-angular", color: "DD0031" },
  { url: preactLogo, alt: "mute8-preact", color: "762CFB" },
  { url: vuewLogo, alt: "mute8-vue", color: "41B883" },
  { url: reactLogo, alt: "mute8-react", color: "61DAFB" },
  { url: solidLogo, alt: "mute8-solid", color: "3864A5" },
]

function FrameworksSection() {
  const items = frameworks.map(logo => {
    return (
      <Link to={`/mute8/docs/${logo.alt}/intro`}>
        <img width="90px" src={logo.url} key={logo.alt} alt={logo.alt} />
      </Link>
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
