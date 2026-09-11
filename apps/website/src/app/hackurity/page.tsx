import { redirect } from "next/navigation";

// Hackurity is now the site's landing page. Keep this path working for old
// links and bookmarks by forwarding it to the root.
export default function HackurityRedirect() {
  redirect("/");
}
