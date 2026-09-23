import { redirect } from "next/navigation";

/** Preview URL legacy Storyblok → story Layout sito */
export default function LegacyHeaderPreviewRedirect() {
  redirect("/layout-components");
}
