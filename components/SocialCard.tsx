import Link from "next/link";
import GlassSurface from "./GlassSurface";

interface Props {
  socialurl: string;
  socialsite: string
}

const SocialCard = ({socialurl, socialsite}: Props) => { //this is for props so like its a glorifeid f string in python
  return (
    <Link href={socialurl} className="p-10">
        <GlassSurface
            displace={20}
            distortionScale={-150}
            redOffset={5}
            greenOffset={15}
            blueOffset={25}
            brightness={10}
            opacity={1}
            mixBlendMode="color"
            borderRadius={50}
            
                    height={60}
                    width={160}
        >

  <p className="text-xl text-cream-white transition-all ease-in-out duration-500 hover:text-highlight-this hover:text-2xl hover:text-shadow-lg/50">{socialsite}</p>

</GlassSurface>
    </Link>
  )
}

export default SocialCard