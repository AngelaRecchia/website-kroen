import { storyblokEditable } from "@storyblok/react/rsc";

export default function StepList({ blok }) {
  const { steps = [] } = blok;

  if (!steps.length) return null;

  return (
    <ol {...storyblokEditable(blok)} className="steps">
      {steps.map((step) => (
        <li key={step._uid}>
          {step.title && <strong>{step.title}</strong>}
          {step.text && <span>{step.text}</span>}
        </li>
      ))}
    </ol>
  );
}
