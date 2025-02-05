import { pgTable, pgPolicy, bigint, timestamp, text, uuid, varchar, index, check, smallint, date, jsonb, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const heartbeats = pgTable("heartbeats", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "heartbeats_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	source: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		serviceRoleCanInsertHeartbeats: pgPolicy("Service role can insert heartbeats", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`(auth.role() = 'service_role'::text)`  }),
		deleteOldHeartbeats: pgPolicy("Delete old heartbeats", { as: "permissive", for: "delete", to: ["public"] }),
	}
});

export const contactSubmissions = pgTable("contact_submissions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	name: varchar().notNull(),
	email: varchar().notNull(),
	phone: varchar(),
	wechat: varchar(),
	address: text(),
	zipcode: varchar(),
	message: text().notNull(),
	staus: varchar(),
}, (table) => {
	return {
		enableInsertForAllUsers: pgPolicy("Enable insert for all users", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`true`  }),
	}
});

export const fceApplications = pgTable("fce_applications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	status: text().default('draft').notNull(),
	currentStep: smallint("current_step").default(0).notNull(),
	name: text().notNull(),
	country: text().notNull(),
	streetAddress: text("street_address").notNull(),
	streetAddress2: text("street_address2"),
	city: text().notNull(),
	region: text().notNull(),
	zipCode: text("zip_code").notNull(),
	fax: text(),
	phone: text().notNull(),
	email: text().notNull(),
	purpose: text().notNull(),
	purposeOther: text("purpose_other"),
	pronouns: text().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	middleName: text("middle_name"),
	dateOfBirth: date("date_of_birth").notNull(),
	serviceType: jsonb("service_type").notNull(),
	deliveryMethod: text("delivery_method").notNull(),
	additionalServices: text("additional_services").array().default([""]),
	additionalServicesQuantity: jsonb("additional_services_quantity").default({"pdf_only":0,"extra_copy":0,"pdf_with_hard_copy":0}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	submittedAt: timestamp("submitted_at", { withTimezone: true, mode: 'string' }),
}, (table) => {
	return {
		idxFceApplicationsEmail: index("idx_fce_applications_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
		idxFceApplicationsStatus: index("idx_fce_applications_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
		anyoneCanUpdateDraftApplications: pgPolicy("Anyone can update draft applications", { as: "permissive", for: "update", to: ["public"], using: sql`(status = 'draft'::text)` }),
		anyoneCanViewApplicationsWithId: pgPolicy("Anyone can view applications with ID", { as: "permissive", for: "select", to: ["public"] }),
		anyoneCanCreateApplications: pgPolicy("Anyone can create applications", { as: "permissive", for: "insert", to: ["public"] }),
		fceApplicationsDeliveryMethodCheck: check("fce_applications_delivery_method_check", sql`delivery_method = ANY (ARRAY['no_delivery_needed'::text, 'usps_first_class_domestic'::text, 'usps_first_class_international'::text, 'usps_priority_domestic'::text, 'usps_express_domestic'::text, 'ups_express_domestic'::text, 'usps_express_international'::text, 'fedex_express_international'::text])`),
		fceApplicationsEmailCheck: check("fce_applications_email_check", sql`email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text`),
		fceApplicationsFaxCheck: check("fce_applications_fax_check", sql`fax ~ '^\d{3}-\d{3}-\d{4}$'::text`),
		fceApplicationsPhoneCheck: check("fce_applications_phone_check", sql`phone ~ '^\d{3}-\d{3}-\d{4}$'::text`),
		fceApplicationsPronounsCheck: check("fce_applications_pronouns_check", sql`pronouns = ANY (ARRAY['mr'::text, 'ms'::text, 'mx'::text])`),
		fceApplicationsPurposeCheck: check("fce_applications_purpose_check", sql`purpose = ANY (ARRAY['immigration'::text, 'employment'::text, 'education'::text, 'other'::text])`),
		fceApplicationsStatusCheck: check("fce_applications_status_check", sql`status = ANY (ARRAY['draft'::text, 'submitted'::text, 'processing'::text, 'completed'::text, 'cancelled'::text])`),
		fceApplicationsZipCodeCheck: check("fce_applications_zip_code_check", sql`zip_code ~ '^\d{5}(-\d{4})?$'::text`),
		validPurposeOther: check("valid_purpose_other", sql`((purpose = 'other'::text) AND (purpose_other IS NOT NULL)) OR ((purpose <> 'other'::text) AND (purpose_other IS NULL))`),
	}
});

export const fceEducations = pgTable("fce_educations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	applicationId: uuid("application_id").notNull(),
	countryOfStudy: text("country_of_study").notNull(),
	degreeObtained: text("degree_obtained").notNull(),
	schoolName: text("school_name").notNull(),
	studyStartDate: jsonb("study_start_date").notNull(),
	studyEndDate: jsonb("study_end_date").notNull(),
}, (table) => {
	return {
		idxFceEducationsApplication: index("idx_fce_educations_application").using("btree", table.applicationId.asc().nullsLast().op("uuid_ops")),
		fceEducationsApplicationIdFkey: foreignKey({
			columns: [table.applicationId],
			foreignColumns: [fceApplications.id],
			name: "fce_educations_application_id_fkey"
		}).onDelete("cascade"),
		anyoneCanManageEducations: pgPolicy("Anyone can manage educations", { as: "permissive", for: "all", to: ["public"], using: sql`true` }),
	}
});
