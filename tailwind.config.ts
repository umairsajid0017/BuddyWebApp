import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ["var(--font-geist-sans)", ...fontFamily.sans]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
					900: 'hsl(var(--primary-900))',
					800: 'hsl(var(--primary-800))',
					700: 'hsl(var(--primary-700))',
					600: 'hsl(var(--primary-600))',
					500: 'hsl(var(--primary-500))',
					400: 'hsl(var(--primary-400))',
					300: 'hsl(var(--primary-300))',
					200: 'hsl(var(--primary-200))',
					100: 'hsl(var(--primary-100))',
				},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
				  900: 'hsl(var(--secondary-900))',
				  800: 'hsl(var(--secondary-800))',
				  700: 'hsl(var(--secondary-700))',
				  600: 'hsl(var(--secondary-600))',
				  500: 'hsl(var(--secondary-500))',
				  400: 'hsl(var(--secondary-400))',
				  300: 'hsl(var(--secondary-300))',
				  200: 'hsl(var(--secondary-200))',
				  100: 'hsl(var(--secondary-100))',
  			},
			text: {
				DEFAULT: 'hsl(var(--text))',
				foreground: 'hsl(var(--text-foreground))',
				900: 'hsl(var(--text-900))',
				800: 'hsl(var(--text-800))',
				700: 'hsl(var(--text-700))',
				600: 'hsl(var(--text-600))',
				500: 'hsl(var(--text-500))',
				400: 'hsl(var(--text-400))',
				300: 'hsl(var(--text-300))',
				200: 'hsl(var(--text-200))',
				100: 'hsl(var(--text-100))',
			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
		  keyframes: {
			"caret-blink": {
			  "0%,70%,100%": { opacity: "1" },
			  "20%,50%": { opacity: "0" },
			},
		  },
		  animation: {
			"caret-blink": "caret-blink 1.25s ease-out infinite",
		  },
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
