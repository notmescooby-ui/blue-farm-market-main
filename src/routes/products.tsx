import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "./marketplace";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products Notice | BlueFarm Account Deletion Portal" },
      {
        name: "description",
        content:
          "The BlueFarm aquaculture products are managed exclusively through the BlueFarm mobile application. This site is dedicated solely to account and data deletion requests.",
      },
      { property: "og:title", content: "Products Notice | BlueFarm Account Deletion Portal" },
      {
        property: "og:description",
        content:
          "This website is dedicated solely to BlueFarm account and data deletion requests.",
      },
    ],
  }),
  component: MarketplacePage,
});
