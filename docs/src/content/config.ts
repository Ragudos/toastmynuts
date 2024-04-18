import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const homepageCollections = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		rank: z.number()
	}),
});

export const collections = {
	homepage: homepageCollections,
};
