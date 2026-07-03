import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcExclude: ["README.md"],
  base: '/arcade-party-2-docs/',
  
  title: "Arcade Party 2 Documentation",
  description: "Technical and player documentation about the workings of Arcade Party 2. The player documentation has information about the mini games and the technical documentation is intended for developers looking to contribute to Arcade Party 2.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: {
		'/players/': [
			{
				text: 'Player Overview',
				items: [
					{ text: 'Getting started', link: '/players/index' }
				]
			}
		],
	    '/develop/': [
			{
				text: 'Developer Documentation',
				link: '/develop/',
				items: [
					{
						text: 'Basics',
						link: '/develop/basics/',
						items: [
							{ text: "General information", link: '/develop/basics/general' },
							{ text: "Terminology", link: '/develop/basics/terminology' },
							{ text: "Minigames", link: '/develop/basics/minigames' },
						],
					},
					{ text: 'Project setup', link: '/develop/project-setup' },
					{
						text: 'Developing Minigames',
						link: '/develop/developing-minigames/',
						items: [
							{ text: "Creating a minigame", link: '/develop/developing-minigames/create-a-minigame' },
							{ text: "Minigame factory", link: '/develop/developing-minigames/minigame-factory' },
							{ text: "Minigame setup script", link: '/develop/developing-minigames/minigame-setup-script' },
							{ text: "Minigame logic", link: '/develop/developing-minigames/minigame-logic' },
							{ text: "Team minigames", link: '/develop/developing-minigames/team-minigames' },
							{ text: "Using translations", link: '/develop/developing-minigames/translations' },
						]
					},
					{ text: 'Running the server', link: '/develop/running-the-server' },
					{ text: 'Running with Docker', link: '/develop/running-with-docker' },
					{
						text: 'Miscellaneous',
						link: '/develop/misc/',
						items: [
							{ text: 'Configuration data container', link: '/develop/misc/configuration-data-container'}
						]
					}
				]
			}
	    ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LCLPYT/arcade-party-2-docs' }
    ]
  }
})
