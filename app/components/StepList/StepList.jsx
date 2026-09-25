import { storyblokEditable } from "@storyblok/react/rsc";
import { storyblokRichTextToHtml } from "../../lib/storyblok-richtext";
import "./StepList.scss";

export default function StepList({ blok }) {
  const { steps = [] } = blok;

  if (!steps.length) return null;

  return (
    <ol {...storyblokEditable(blok)} className="steps">
      {steps.map((step) => (
        <li key={step._uid}>
          <div className="step-body">
            {step.title && <strong>{step.title}</strong>}
            {typeof step.text === "string"
              ? step.text && <span>{step.text}</span>
              : (() => {
                  const html = storyblokRichTextToHtml(step.text);
                  return html ? (
                    <span dangerouslySetInnerHTML={{ __html: html }} />
                  ) : null;
                })()}
          </div>
        </li>
      ))}
    </ol>
  );
}
