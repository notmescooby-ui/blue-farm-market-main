import { createFileRoute } from "@tanstack/react-router";
import { AccountDeletionPage } from "./account-deletion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Delete Your BlueFarm Account | Official Deletion Portal" },
      {
        name: "description",
        content:
          "Official BlueFarm account deletion request portal. Complies with Google Play account deletion requirement. One-click authenticated deletion, OTP verification, and manual request options for farmers and buyers.",
      },
      { property: "og:title", content: "Delete Your BlueFarm Account | BlueFarm" },
      {
        property: "og:description",
        content:
          "Official account deletion portal for BlueFarm users. Delete your account, profile, pond data, and sensor telemetry securely.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountDeletionPage,
});
