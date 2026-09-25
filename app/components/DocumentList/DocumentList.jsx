import { storyblokEditable } from "@storyblok/react/rsc";
import { storyblokLinkUrl } from "../../lib/storyblok-utils";
import "./DocumentList.scss";

export default function DocumentList({ blok }) {
  const { title = "Documenti", documents = [] } = blok;

  if (!documents.length) return null;

  return (
    <div {...storyblokEditable(blok)} className="block">
      {title && <h2 className="display t-h2">{title}</h2>}
      <ul className="doc-list">
        {documents.map((doc) => (
          <li key={doc._uid}>
            <a
              href={storyblokLinkUrl(doc.link) || doc.file?.filename}
              target="_blank"
              rel="noopener noreferrer"
            >
              {doc.label || doc.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
