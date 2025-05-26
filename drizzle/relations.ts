import { relations } from "drizzle-orm/relations";
import { aetCoreApplications, aetCorePayments, fceApplications, fceEducations, aetCoreEducations } from "./schema";

export const aetCorePaymentsRelations = relations(aetCorePayments, ({one}) => ({
	aetCoreApplication: one(aetCoreApplications, {
		fields: [aetCorePayments.applicationId],
		references: [aetCoreApplications.id]
	}),
}));

export const aetCoreApplicationsRelations = relations(aetCoreApplications, ({many}) => ({
	aetCorePayments: many(aetCorePayments),
	aetCoreEducations: many(aetCoreEducations),
}));

export const fceEducationsRelations = relations(fceEducations, ({one}) => ({
	fceApplication: one(fceApplications, {
		fields: [fceEducations.applicationId],
		references: [fceApplications.id]
	}),
}));

export const fceApplicationsRelations = relations(fceApplications, ({many}) => ({
	fceEducations: many(fceEducations),
}));

export const aetCoreEducationsRelations = relations(aetCoreEducations, ({one}) => ({
	aetCoreApplication: one(aetCoreApplications, {
		fields: [aetCoreEducations.applicationId],
		references: [aetCoreApplications.id]
	}),
}));