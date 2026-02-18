//default boilerplate layout define a common layout here
import './globals.css';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import localFont from 'next/font/local';
import LiquidChrome from '@/components/LiquidChrome';
import TextCursor from '@/components/TextCursor';
import BlurText from '@/components/BlurText';
import Link from 'next/link';
import GradualBlur from '@/components/GradualBlur';
import HomeOnly from '@/components/HomeOnly';
import HomeHero from '@/components/HomeHero';

export const metadata: Metadata ={ //app name and desc for browser
  title: "Adi Tauqir",
  description: "Personal Porfolio"
}

const lexaenddeca_font= localFont(
    {
        src: "./fonts/LexendDeca-VariableFont_wght.ttf", 
        weight: '300',
    }
)

const stack_sans_font = localFont({
    src: "./fonts/StackSansNotch-VariableFont_wght.ttf",
})

const handleAnimationComplete = () => {
  //for the blur text react component
  console.log('Animation completed!');

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className='m-0'>
        <div className={lexaenddeca_font.className}>

          <div className='fixed inset-0 top-0 z-[-2]'>
            
          <LiquidChrome
            baseColor={[0.1, 0, 0.1]}
            speed={0.3}
            amplitude={0.1}
            interactive={true}
          />
        </div>

<div className='absolute inset-0 z-[0]'>      
<TextCursor
  text="🍉"
  delay={0.01}
  spacing={80}
  followMouseDirection={true}
  randomFloat={true}
  exitDuration={0.3}
  removalInterval={20}
  maxPoints={2}
/></div>
<main>    
  <div className={stack_sans_font.className}>
        <div className='relative'>
        <Link href="/"><h1 className='grid grid-flow-col justify-items-center text-[4rem] text-cream-white top-10 static pb-20 pt-70'>
        <BlurText text= 'Adi Tauqir' delay= {100} animateBy='letters' direction='bottom' threshold={0.1}/></h1></Link>
        <HomeOnly>
          <HomeHero />
        </HomeOnly>
        </div>
        </div>   <Navbar/>
          {children} 
        </main>
        </div>
        </body>
    </html>
  )
}