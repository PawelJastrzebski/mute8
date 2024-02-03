import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const repoUrl = "https://github.com/PawelJastrzebski/mute8"

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
          editUrl:repoUrl,
        },
        blog: {
          showReadingTime: true,
          // Remove this to remove the "edit this page" links.
          editUrl:repoUrl,
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
          type: 'docSidebar',
          sidebarId: 'home',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'dropdown',
          label: ' ',
          position: 'left',
          className: "short-dropdown",
          items: [
            {
              type: 'doc',
              label: 'mute8',
              docId: 'mute8/intro',
            },
            {
              type: 'doc',
              label: 'mute8-react',
              docId: 'mute8-react/intro',
            },
            {
              type: 'doc',
              label: 'mute8-plugins',
              docId: 'mute8-plugins/intro',
            },
          ]
        },
        {
          type: 'dropdown',
          label: 'npm',
          position: 'right',
          items: [
            {
              label: 'mute8',
              href: 'https://www.npmjs.com/package/mute8',
            },
            {
              label: 'mute8-react',
              href: 'https://www.npmjs.com/package/mute8-react',
            },
            {
              label: 'mute8-plugins',
              href: 'https://www.npmjs.com/package/mute8-plugins',
            },
          ],
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
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
