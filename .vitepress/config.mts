import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcExclude: ["README.md"],
  
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
					text: 'Developer Overview', 
					items: [
						{ text: 'Project setup', link: '/develop/project-setup' },
						{ text: 'Arcade Party modes', link: '/develop/modes' },
						{ text: 'Mini games', link: '/develop/mini-games' }
					]
				}
	    ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LCLPYT/arcade-party-2-docs' }
    ]
  }
})
