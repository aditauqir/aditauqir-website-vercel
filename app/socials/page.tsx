import localFont from "next/font/local";
import GlassSurface from "@/components/GlassSurface";
import Link from "next/link";
import { li } from "motion/react-m";
import SocialCard from "@/components/SocialCard";

const standerd_regular = localFont({
    src: "../fonts/StanderdfreeRegular-X3KK2.otf",
})

const socialz = [
    {'socialsite': 'LinkedIn', 'socialurl': 'https://www.linkedin.com/in/aditauqir/'},
    {'socialsite': 'GitHub', 'socialurl': 'https://github.com/aditauqir'},
    {'socialsite': 'YouTube', 'socialurl': 'https://www.youtube.com/watch?v=xvFZjo5PgG0&list=RDxvFZjo5PgG0&start_radio=1'},
]

function socials(){
    return(
        <main className={standerd_regular.className}>
            <div className="grid justify-items-center pt-10">
                <ul className="socialz">
                    {socialz.map((socialsite) => ( 
                        <li key={socialsite.socialurl}> <SocialCard {...socialsite}/></li>
                       )  )}          
                </ul>
            </div>
        </main>
    )
}

export default socials;