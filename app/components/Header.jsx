import { storyblokEditable } from "@storyblok/react/rsc";

import HeaderNav from "./HeaderNav";

import { resolveHeaderLinksFromBlok } from "../lib/nav-links";



export default function Header({ blok }) {

  const links = resolveHeaderLinksFromBlok(blok);



  return (

    <header {...storyblokEditable(blok)} className="relative pb-4">

      <HeaderNav links={links} />

    </header>

  );

}

