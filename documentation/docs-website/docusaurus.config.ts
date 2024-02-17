import { themes as prismThemes, PrismTheme } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const myCodeTheme: PrismTheme = {
  plain: {
    color: "#6699cc",
    backgroundColor: "#161618",
  },
  styles: [
    {
      types: ["prolog"],
      style: {
        color: "rgb(0, 0, 128)",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "rgb(120, 120, 120)",
      },
    },
    {
      types: ["builtin", "changed", "interpolation-punctuation"],
      style: {
        color: "rgb(86, 156, 214)",
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "rgb(210, 0, 56)",
      },
    },
    {
      types: ["number", "inserted"],
      style: {
        color: "rgb(157, 205, 124)",
      },
    },
    {
      types: ["constant"],
      style: {
        color: "rgb(100, 102, 149)",
      },
    },
    {
      types: ["attr-name", "variable"],
      style: {
        color: "rgb(156, 220, 254)",
      },
    },
    {
      types: ["deleted", "string", "attr-value", "template-punctuation"],
      style: {
        color: "rgb(206, 145, 120)",
      },
    },
    {
      types: ["string"],
      style: {
        color: "rgb(157, 205, 124)",
      },
    },
    {
      types: ["selector"],
      style: {
        color: "rgb(215, 186, 125)",
      },
    },
    {
      // Fix tag color
      types: ["tag"],
      style: {
        color: "rgb(78, 201, 176)",
      },
    },
    {
      // Fix tag color for HTML
      types: ["tag"],
      languages: ["markup"],
      style: {
        color: "rgb(86, 156, 214)",
      },
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "rgb(212, 212, 212)",
      },
    },
    {
      // Fix punctuation color for HTML
      types: ["punctuation"],
      languages: ["markup"],
      style: {
        color: "#808080",
      },
    },
    {
      types: ["function"],
      style: {
        color: "rgb(220, 220, 170)",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "rgb(78, 201, 176)",
      },
    },
    {
      types: ["char"],
      style: {
        color: "rgb(209, 105, 105)",
      },
    },
  ],
}

const myCodeThemeLight = JSON.parse(JSON.stringify(myCodeTheme))
myCodeThemeLight.plain.background = "#333333"

const repoUrl = "https://github.com/PawelJastrzebski/mute8"
const packageNames = [
  "mute8",
  "mute8-angular",
  "mute8-preact",
  "mute8-vue",
  "mute8-react",
  "mute8-solid",
  "mute8-plugins",
]

const docsListItems = packageNames.map(name => {
  return {
    type: 'doc',
    label: name,
    docId: `${name}/intro`,
  }
})

const npmListItems = packageNames.map(name => {
  return {
    label: name,
    href: `https://www.npmjs.com/package/${name}`,
  }
})


const config: Config = {
  title: 'mute8 - JS State Container',
  tagline: 'mute8, mute8-react, mute8-plugins',
  favicon: 'img/favicon.ico',

  // production url 
  url: 'https://paweljastrzebski.github.io',
  baseUrl: '/mute8/',

  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'wildbirds.studio', // Usually your GitHub org/user name.
  projectName: 'mute8', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Remove this to remove the "edit this page" links.
          editUrl: repoUrl,
        },
        blog: {
          showReadingTime: true,
          // Remove this to remove the "edit this page" links.
          editUrl: repoUrl,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/mute8-social-card.png',
    navbar: {
      title: "",
      logo: {
        alt: 'mute8 Logo',
        src: 'img/logo-light.svg',
        srcDark: 'img/logo-dark.svg'
      },
      items: [
        {
          to: '/',
          label: 'Home',
          position: 'left',
          activeBaseRegex: '/home',
        },
        {
          type: 'doc',
          docId: 'project/getting-started',
          position: 'left',
          label: 'Project',
        },
        {
          type: 'dropdown',
          label: 'Docs',
          position: 'left',
          items: docsListItems
        },
        {
          type: 'dropdown',
          label: 'npm',
          position: 'right',
          items: npmListItems,
        },
        {
          href: 'https://github.com/PawelJastrzebski/mute8',
          position: 'right',
          className: 'header-github-link',
        },
        // {
        //   type: 'search',
        //   position: 'right',
        // },
        //  {to: '/blog', label: 'Blog', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       {
      //         label: 'Tutorial',
      //         to: '/docs/intro',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'Community',
      //     items: [
      //       {
      //         label: 'Stack Overflow',
      //         href: 'https://stackoverflow.com/questions/tagged/docusaurus',
      //       },
      //       {
      //         label: 'Discord',
      //         href: 'https://discordapp.com/invite/docusaurus',
      //       },
      //       {
      //         label: 'Twitter',
      //         href: 'https://twitter.com/docusaurus',
      //       },
      //     ],
      //   },
      //   {
      //     title: 'More',
      //     items: [
      //       {
      //         label: 'Blog',
      //         to: '/blog',
      //       },
      //       {
      //         label: 'GitHub',
      //         href: 'https://github.com/facebook/docusaurus',
      //       },
      //     ],
      //   },
      // ],
      copyright: `© ${new Date().getFullYear()} Mute8. Built with Docusaurus.`,
    },
    prism: {
      theme: myCodeThemeLight,
      darkTheme: myCodeTheme,
      // darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
