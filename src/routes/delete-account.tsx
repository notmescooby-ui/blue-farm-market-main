import { createFileRoute } from "@tanstack/react-router";
import { AccountDeletionPage } from "./account-deletion";

export const Route = createFileRoute("/delete-account")({
  head: () => ({
    meta: [
      { title: "Delete Your BlueFarm Account | Official Deletion Portal" },
      {
        name: "description",
        content:
          "Official BlueFarm account deletion request portal. Complies with Google Play account deletion requirement. One-click authenticated deletion, OTP verification, and manual request options.",
      },
      { property: "og:title", content: "Delete Your BlueFarm Account | BlueFarm" },
      {
        property: "og:description",
        content:
          "Official account deletion portal for BlueFarm aquaculture farmers and buyers. Delete account and personal data securely.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountDeletionPage,
});
