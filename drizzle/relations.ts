import { relations } from "drizzle-orm/relations";
import { fceApplications, fceEducations } from "./schema";

export const fceEducationsRelations = relations(fceEducations, ({one}) => ({
	fceApplication: one(fceApplications, {
		fields: [fceEducations.applicationId],
		references: [fceApplications.id]
	}),
}));

export const fceApplicationsRelations = relations(fceApplications, ({many}) => ({
	fceEducations: many(fceEducations),
}));