import { StoryblokServerComponent } from '@storyblok/react/rsc'
import Image from 'next/image'

export default function Banner  ({ blok : {title, image, link} }){
  return (
    <div className="banner">
      <h1>{title}</h1>
        <Image src={image.filename} alt={title} width={100} height={100} />
      <a href={link.url}>{link.text}</a>
    </div>
  );
};