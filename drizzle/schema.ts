import { pgTable, pgPolicy, bigint, timestamp, text, uuid, varchar, index, check, smallint, date, jsonb, numeric, foreignKey, integer, boolean, serial, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const locales = pgEnum("_locales", ['en', 'zh'])
export const enumPagesVBlocksArchivePopulateBy = pgEnum("enum__pages_v_blocks_archive_populate_by", ['collection', 'selection'])
export const enumPagesVBlocksArchiveRelationTo = pgEnum("enum__pages_v_blocks_archive_relation_to", ['posts'])
export const enumPagesVBlocksContentColumnsLinkAppearance = pgEnum("enum__pages_v_blocks_content_columns_link_appearance", ['default', 'outline'])
export const enumPagesVBlocksContentColumnsLinkType = pgEnum("enum__pages_v_blocks_content_columns_link_type", ['reference', 'custom'])
export const enumPagesVBlocksContentColumnsSize = pgEnum("enum__pages_v_blocks_content_columns_size", ['oneThird', 'half', 'twoThirds', 'full'])
export const enumPagesVBlocksCtaLinksLinkAppearance = pgEnum("enum__pages_v_blocks_cta_links_link_appearance", ['default', 'outline'])
export const enumPagesVBlocksCtaLinksLinkType = pgEnum("enum__pages_v_blocks_cta_links_link_type", ['reference', 'custom'])
export const enumPagesVPublishedLocale = pgEnum("enum__pages_v_published_locale", ['en', 'zh'])
export const enumPagesVVersionHeroLinksLinkAppearance = pgEnum("enum__pages_v_version_hero_links_link_appearance", ['default', 'outline'])
export const enumPagesVVersionHeroLinksLinkType = pgEnum("enum__pages_v_version_hero_links_link_type", ['reference', 'custom'])
export const enumPagesVVersionHeroType = pgEnum("enum__pages_v_version_hero_type", ['none', 'highImpact', 'mediumImpact', 'lowImpact'])
export const enumPagesVVersionStatus = pgEnum("enum__pages_v_version_status", ['draft', 'published'])
export const enumPostsVPublishedLocale = pgEnum("enum__posts_v_published_locale", ['en', 'zh'])
export const enumPostsVVersionStatus = pgEnum("enum__posts_v_version_status", ['draft', 'published'])
export const enumFooterNavItemsLinkType = pgEnum("enum_footer_nav_items_link_type", ['reference', 'custom'])
export const enumFormsConfirmationType = pgEnum("enum_forms_confirmation_type", ['message', 'redirect'])
export const enumHeaderNavItemsLinkType = pgEnum("enum_header_nav_items_link_type", ['reference', 'custom'])
export const enumPagesBlocksArchivePopulateBy = pgEnum("enum_pages_blocks_archive_populate_by", ['collection', 'selection'])
export const enumPagesBlocksArchiveRelationTo = pgEnum("enum_pages_blocks_archive_relation_to", ['posts'])
export const enumPagesBlocksContentColumnsLinkAppearance = pgEnum("enum_pages_blocks_content_columns_link_appearance", ['default', 'outline'])
export const enumPagesBlocksContentColumnsLinkType = pgEnum("enum_pages_blocks_content_columns_link_type", ['reference', 'custom'])
export const enumPagesBlocksContentColumnsSize = pgEnum("enum_pages_blocks_content_columns_size", ['oneThird', 'half', 'twoThirds', 'full'])
export const enumPagesBlocksCtaLinksLinkAppearance = pgEnum("enum_pages_blocks_cta_links_link_appearance", ['default', 'outline'])
export const enumPagesBlocksCtaLinksLinkType = pgEnum("enum_pages_blocks_cta_links_link_type", ['reference', 'custom'])
export const enumPagesHeroLinksLinkAppearance = pgEnum("enum_pages_hero_links_link_appearance", ['default', 'outline'])
export const enumPagesHeroLinksLinkType = pgEnum("enum_pages_hero_links_link_type", ['reference', 'custom'])
export const enumPagesHeroType = pgEnum("enum_pages_hero_type", ['none', 'highImpact', 'mediumImpact', 'lowImpact'])
export const enumPagesStatus = pgEnum("enum_pages_status", ['draft', 'published'])
export const enumPostsStatus = pgEnum("enum_posts_status", ['draft', 'published'])
export const enumRedirectsToType = pgEnum("enum_redirects_to_type", ['reference', 'custom'])


export const heartbeats = pgTable("heartbeats", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "heartbeats_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	source: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		deleteOldHeartbeats: pgPolicy("Delete old heartbeats", { as: "permissive", for: "delete", to: ["public"], using: sql`(created_at < (now() - '30 days'::interval))` }),
		serviceRoleCanInsertHeartbeats: pgPolicy("Service role can insert heartbeats", { as: "permissive", for: "insert", to: ["public"] }),
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
	paymentStatus: text("payment_status").default('pending'),
	paymentId: text("payment_id"),
	paidAt: timestamp("paid_at", { withTimezone: true, mode: 'string' }),
	office: text(),
	dueAmount: numeric("due_amount", { precision: 6, scale:  2 }).default('NULL'),
}, (table) => {
	return {
		idxFceApplicationsEmail: index("idx_fce_applications_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
		idxFceApplicationsStatus: index("idx_fce_applications_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
		anyoneCanCreateApplications: pgPolicy("Anyone can create applications", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`true`  }),
		anyoneCanViewApplicationsWithId: pgPolicy("Anyone can view applications with ID", { as: "permissive", for: "select", to: ["public"] }),
		anyoneCanUpdateApplications: pgPolicy("Anyone can update applications", { as: "permissive", for: "update", to: ["public"] }),
		fceApplicationsDeliveryMethodCheck: check("fce_applications_delivery_method_check", sql`delivery_method = ANY (ARRAY['no_delivery_needed'::text, 'usps_first_class_domestic'::text, 'usps_first_class_international'::text, 'usps_priority_domestic'::text, 'usps_express_domestic'::text, 'ups_express_domestic'::text, 'usps_express_international'::text, 'fedex_express_international'::text])`),
		fceApplicationsEmailCheck: check("fce_applications_email_check", sql`email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text`),
		fceApplicationsFaxCheck: check("fce_applications_fax_check", sql`fax ~ '^\d{3}-\d{3}-\d{4}$'::text`),
		fceApplicationsPaymentStatusCheck: check("fce_applications_payment_status_check", sql`payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text, 'expired'::text, 'refunded'::text])`),
		fceApplicationsPaymentStatusCheck1: check("fce_applications_payment_status_check1", sql`payment_status = ANY (ARRAY['boston'::text, 'new york'::text, 'miami'::text, 'san francisco'::text, 'los angeles'::text, NULL::text])`),
		fceApplicationsPhoneCheck: check("fce_applications_phone_check", sql`phone ~ '^\d{3}-\d{3}-\d{4}$'::text`),
		fceApplicationsPronounsCheck: check("fce_applications_pronouns_check", sql`pronouns = ANY (ARRAY['mr'::text, 'ms'::text, 'mx'::text])`),
		fceApplicationsPurposeCheck: check("fce_applications_purpose_check", sql`purpose = ANY (ARRAY['evaluation-uscis'::text, 'evaluation-immigration'::text, 'evaluation-employment'::text, 'evaluation-education'::text, 'immigration'::text, 'employment'::text, 'education'::text, 'other'::text, 'translation'::text, 'evaluation'::text, 'interpretation'::text, 'visa'::text])`),
		fceApplicationsStatusCheck: check("fce_applications_status_check", sql`status = ANY (ARRAY['draft'::text, 'submitted'::text, 'processing'::text, 'completed'::text, 'cancelled'::text])`),
		fceApplicationsZipCodeCheck: check("fce_applications_zip_code_check", sql`zip_code ~ '^\d{5}(-\d{4})?$'::text`),
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

export const pagesHeroLinks = pgTable("pages_hero_links", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	linkType: enumPagesHeroLinksLinkType("link_type").default('reference'),
	linkNewTab: boolean("link_new_tab"),
	linkUrl: varchar("link_url"),
	linkLabel: varchar("link_label"),
	linkAppearance: enumPagesHeroLinksLinkAppearance("link_appearance").default('default'),
});

export const pagesBlocksCtaLinks = pgTable("pages_blocks_cta_links", {
	order: integer("_order").notNull(),
	parentId: varchar("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	linkType: enumPagesBlocksCtaLinksLinkType("link_type").default('reference'),
	linkNewTab: boolean("link_new_tab"),
	linkUrl: varchar("link_url"),
	linkLabel: varchar("link_label"),
	linkAppearance: enumPagesBlocksCtaLinksLinkAppearance("link_appearance").default('default'),
});

export const pagesBlocksCta = pgTable("pages_blocks_cta", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	richText: jsonb("rich_text"),
	blockName: varchar("block_name"),
});

export const pagesBlocksContentColumns = pgTable("pages_blocks_content_columns", {
	order: integer("_order").notNull(),
	parentId: varchar("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	size: enumPagesBlocksContentColumnsSize().default('oneThird'),
	richText: jsonb("rich_text"),
	enableLink: boolean("enable_link"),
	linkType: enumPagesBlocksContentColumnsLinkType("link_type").default('reference'),
	linkNewTab: boolean("link_new_tab"),
	linkUrl: varchar("link_url"),
	linkLabel: varchar("link_label"),
	linkAppearance: enumPagesBlocksContentColumnsLinkAppearance("link_appearance").default('default'),
});

export const pagesBlocksContent = pgTable("pages_blocks_content", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	blockName: varchar("block_name"),
});

export const pagesBlocksMediaBlock = pgTable("pages_blocks_media_block", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	mediaId: integer("media_id"),
	blockName: varchar("block_name"),
});

export const pagesBlocksArchive = pgTable("pages_blocks_archive", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	introContent: jsonb("intro_content"),
	populateBy: enumPagesBlocksArchivePopulateBy("populate_by").default('collection'),
	relationTo: enumPagesBlocksArchiveRelationTo("relation_to").default('posts'),
	limit: numeric().default('10'),
	blockName: varchar("block_name"),
});

export const pagesBlocksFormBlock = pgTable("pages_blocks_form_block", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	formId: integer("form_id"),
	enableIntro: boolean("enable_intro"),
	introContent: jsonb("intro_content"),
	blockName: varchar("block_name"),
});

export const pages = pgTable("pages", {
	id: serial().primaryKey().notNull(),
	title: varchar(),
	heroType: enumPagesHeroType("hero_type").default('lowImpact'),
	heroRichText: jsonb("hero_rich_text"),
	heroMediaId: integer("hero_media_id"),
	publishedAt: timestamp("published_at", { precision: 3, withTimezone: true, mode: 'string' }),
	slug: varchar(),
	slugLock: boolean("slug_lock").default(true),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	status: enumPagesStatus("_status").default('draft'),
});

export const pagesLocales = pgTable("pages_locales", {
	metaTitle: varchar("meta_title"),
	metaImageId: integer("meta_image_id"),
	metaDescription: varchar("meta_description"),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: integer("_parent_id").notNull(),
});

export const pagesRels = pgTable("pages_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	pagesId: integer("pages_id"),
	categoriesId: integer("categories_id"),
	postsId: integer("posts_id"),
});

export const pagesVVersionHeroLinks = pgTable("_pages_v_version_hero_links", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: serial().primaryKey().notNull(),
	linkType: enumPagesVVersionHeroLinksLinkType("link_type").default('reference'),
	linkNewTab: boolean("link_new_tab"),
	linkUrl: varchar("link_url"),
	linkLabel: varchar("link_label"),
	linkAppearance: enumPagesVVersionHeroLinksLinkAppearance("link_appearance").default('default'),
	uuid: varchar("_uuid"),
});

export const pagesVBlocksCtaLinks = pgTable("_pages_v_blocks_cta_links", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: serial().primaryKey().notNull(),
	linkType: enumPagesVBlocksCtaLinksLinkType("link_type").default('reference'),
	linkNewTab: boolean("link_new_tab"),
	linkUrl: varchar("link_url"),
	linkLabel: varchar("link_label"),
	linkAppearance: enumPagesVBlocksCtaLinksLinkAppearance("link_appearance").default('default'),
	uuid: varchar("_uuid"),
});

export const pagesVBlocksCta = pgTable("_pages_v_blocks_cta", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: serial().primaryKey().notNull(),
	richText: jsonb("rich_text"),
	uuid: varchar("_uuid"),
	blockName: varchar("block_name"),
});

export const pagesVBlocksContentColumns = pgTable("_pages_v_blocks_content_columns", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: serial().primaryKey().notNull(),
	size: enumPagesVBlocksContentColumnsSize().default('oneThird'),
	richText: jsonb("rich_text"),
	enableLink: boolean("enable_link"),
	linkType: enumPagesVBlocksContentColumnsLinkType("link_type").default('reference'),
	linkNewTab: boolean("link_new_tab"),
	linkUrl: varchar("link_url"),
	linkLabel: varchar("link_label"),
	linkAppearance: enumPagesVBlocksContentColumnsLinkAppearance("link_appearance").default('default'),
	uuid: varchar("_uuid"),
});

export const pagesVBlocksContent = pgTable("_pages_v_blocks_content", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: serial().primaryKey().notNull(),
	uuid: varchar("_uuid"),
	blockName: varchar("block_name"),
});

export const pagesVBlocksMediaBlock = pgTable("_pages_v_blocks_media_block", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: serial().primaryKey().notNull(),
	mediaId: integer("media_id"),
	uuid: varchar("_uuid"),
	blockName: varchar("block_name"),
});

export const pagesVBlocksArchive = pgTable("_pages_v_blocks_archive", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: serial().primaryKey().notNull(),
	introContent: jsonb("intro_content"),
	populateBy: enumPagesVBlocksArchivePopulateBy("populate_by").default('collection'),
	relationTo: enumPagesVBlocksArchiveRelationTo("relation_to").default('posts'),
	limit: numeric().default('10'),
	uuid: varchar("_uuid"),
	blockName: varchar("block_name"),
});

export const pagesVBlocksFormBlock = pgTable("_pages_v_blocks_form_block", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: serial().primaryKey().notNull(),
	formId: integer("form_id"),
	enableIntro: boolean("enable_intro"),
	introContent: jsonb("intro_content"),
	uuid: varchar("_uuid"),
	blockName: varchar("block_name"),
});

export const pagesV = pgTable("_pages_v", {
	id: serial().primaryKey().notNull(),
	parentId: integer("parent_id"),
	versionTitle: varchar("version_title"),
	versionHeroType: enumPagesVVersionHeroType("version_hero_type").default('lowImpact'),
	versionHeroRichText: jsonb("version_hero_rich_text"),
	versionHeroMediaId: integer("version_hero_media_id"),
	versionPublishedAt: timestamp("version_published_at", { precision: 3, withTimezone: true, mode: 'string' }),
	versionSlug: varchar("version_slug"),
	versionSlugLock: boolean("version_slug_lock").default(true),
	versionUpdatedAt: timestamp("version_updated_at", { precision: 3, withTimezone: true, mode: 'string' }),
	versionCreatedAt: timestamp("version_created_at", { precision: 3, withTimezone: true, mode: 'string' }),
	versionStatus: enumPagesVVersionStatus("version__status").default('draft'),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	snapshot: boolean(),
	publishedLocale: enumPagesVPublishedLocale("published_locale"),
	latest: boolean(),
	autosave: boolean(),
});

export const pagesVLocales = pgTable("_pages_v_locales", {
	versionMetaTitle: varchar("version_meta_title"),
	versionMetaImageId: integer("version_meta_image_id"),
	versionMetaDescription: varchar("version_meta_description"),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: integer("_parent_id").notNull(),
});

export const pagesVRels = pgTable("_pages_v_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	pagesId: integer("pages_id"),
	categoriesId: integer("categories_id"),
	postsId: integer("posts_id"),
});

export const postsPopulatedAuthors = pgTable("posts_populated_authors", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	name: varchar(),
});

export const posts = pgTable("posts", {
	id: serial().primaryKey().notNull(),
	title: varchar(),
	content: jsonb(),
	publishedAt: timestamp("published_at", { precision: 3, withTimezone: true, mode: 'string' }),
	slug: varchar(),
	slugLock: boolean("slug_lock").default(true),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	status: enumPostsStatus("_status").default('draft'),
});

export const postsLocales = pgTable("posts_locales", {
	metaTitle: varchar("meta_title"),
	metaImageId: integer("meta_image_id"),
	metaDescription: varchar("meta_description"),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: integer("_parent_id").notNull(),
});

export const postsRels = pgTable("posts_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	postsId: integer("posts_id"),
	categoriesId: integer("categories_id"),
	usersId: integer("users_id"),
});

export const postsVVersionPopulatedAuthors = pgTable("_posts_v_version_populated_authors", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: serial().primaryKey().notNull(),
	uuid: varchar("_uuid"),
	name: varchar(),
});

export const postsV = pgTable("_posts_v", {
	id: serial().primaryKey().notNull(),
	parentId: integer("parent_id"),
	versionTitle: varchar("version_title"),
	versionContent: jsonb("version_content"),
	versionPublishedAt: timestamp("version_published_at", { precision: 3, withTimezone: true, mode: 'string' }),
	versionSlug: varchar("version_slug"),
	versionSlugLock: boolean("version_slug_lock").default(true),
	versionUpdatedAt: timestamp("version_updated_at", { precision: 3, withTimezone: true, mode: 'string' }),
	versionCreatedAt: timestamp("version_created_at", { precision: 3, withTimezone: true, mode: 'string' }),
	versionStatus: enumPostsVVersionStatus("version__status").default('draft'),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	snapshot: boolean(),
	publishedLocale: enumPostsVPublishedLocale("published_locale"),
	latest: boolean(),
	autosave: boolean(),
});

export const postsVLocales = pgTable("_posts_v_locales", {
	versionMetaTitle: varchar("version_meta_title"),
	versionMetaImageId: integer("version_meta_image_id"),
	versionMetaDescription: varchar("version_meta_description"),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: integer("_parent_id").notNull(),
});

export const postsVRels = pgTable("_posts_v_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	postsId: integer("posts_id"),
	categoriesId: integer("categories_id"),
	usersId: integer("users_id"),
});

export const media = pgTable("media", {
	id: serial().primaryKey().notNull(),
	alt: varchar(),
	caption: jsonb(),
	prefix: varchar().default('media'),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	url: varchar(),
	thumbnailURL: varchar("thumbnail_u_r_l"),
	filename: varchar(),
	mimeType: varchar("mime_type"),
	filesize: numeric(),
	width: numeric(),
	height: numeric(),
	focalX: numeric("focal_x"),
	focalY: numeric("focal_y"),
	sizesThumbnailUrl: varchar("sizes_thumbnail_url"),
	sizesThumbnailWidth: numeric("sizes_thumbnail_width"),
	sizesThumbnailHeight: numeric("sizes_thumbnail_height"),
	sizesThumbnailMimeType: varchar("sizes_thumbnail_mime_type"),
	sizesThumbnailFilesize: numeric("sizes_thumbnail_filesize"),
	sizesThumbnailFilename: varchar("sizes_thumbnail_filename"),
	sizesSquareUrl: varchar("sizes_square_url"),
	sizesSquareWidth: numeric("sizes_square_width"),
	sizesSquareHeight: numeric("sizes_square_height"),
	sizesSquareMimeType: varchar("sizes_square_mime_type"),
	sizesSquareFilesize: numeric("sizes_square_filesize"),
	sizesSquareFilename: varchar("sizes_square_filename"),
	sizesSmallUrl: varchar("sizes_small_url"),
	sizesSmallWidth: numeric("sizes_small_width"),
	sizesSmallHeight: numeric("sizes_small_height"),
	sizesSmallMimeType: varchar("sizes_small_mime_type"),
	sizesSmallFilesize: numeric("sizes_small_filesize"),
	sizesSmallFilename: varchar("sizes_small_filename"),
	sizesMediumUrl: varchar("sizes_medium_url"),
	sizesMediumWidth: numeric("sizes_medium_width"),
	sizesMediumHeight: numeric("sizes_medium_height"),
	sizesMediumMimeType: varchar("sizes_medium_mime_type"),
	sizesMediumFilesize: numeric("sizes_medium_filesize"),
	sizesMediumFilename: varchar("sizes_medium_filename"),
	sizesLargeUrl: varchar("sizes_large_url"),
	sizesLargeWidth: numeric("sizes_large_width"),
	sizesLargeHeight: numeric("sizes_large_height"),
	sizesLargeMimeType: varchar("sizes_large_mime_type"),
	sizesLargeFilesize: numeric("sizes_large_filesize"),
	sizesLargeFilename: varchar("sizes_large_filename"),
	sizesXlargeUrl: varchar("sizes_xlarge_url"),
	sizesXlargeWidth: numeric("sizes_xlarge_width"),
	sizesXlargeHeight: numeric("sizes_xlarge_height"),
	sizesXlargeMimeType: varchar("sizes_xlarge_mime_type"),
	sizesXlargeFilesize: numeric("sizes_xlarge_filesize"),
	sizesXlargeFilename: varchar("sizes_xlarge_filename"),
	sizesOgUrl: varchar("sizes_og_url"),
	sizesOgWidth: numeric("sizes_og_width"),
	sizesOgHeight: numeric("sizes_og_height"),
	sizesOgMimeType: varchar("sizes_og_mime_type"),
	sizesOgFilesize: numeric("sizes_og_filesize"),
	sizesOgFilename: varchar("sizes_og_filename"),
});

export const categoriesBreadcrumbs = pgTable("categories_breadcrumbs", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	locale: locales("_locale").notNull(),
	id: varchar().primaryKey().notNull(),
	docId: integer("doc_id"),
	url: varchar(),
	label: varchar(),
});

export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	title: varchar().notNull(),
	parentId: integer("parent_id"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	email: varchar().notNull(),
	resetPasswordToken: varchar("reset_password_token"),
	resetPasswordExpiration: timestamp("reset_password_expiration", { precision: 3, withTimezone: true, mode: 'string' }),
	salt: varchar(),
	hash: varchar(),
	loginAttempts: numeric("login_attempts").default('0'),
	lockUntil: timestamp("lock_until", { precision: 3, withTimezone: true, mode: 'string' }),
});

export const redirects = pgTable("redirects", {
	id: serial().primaryKey().notNull(),
	from: varchar().notNull(),
	toType: enumRedirectsToType("to_type").default('reference'),
	toUrl: varchar("to_url"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const redirectsRels = pgTable("redirects_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	pagesId: integer("pages_id"),
	postsId: integer("posts_id"),
});

export const formsBlocksCheckbox = pgTable("forms_blocks_checkbox", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	width: numeric(),
	required: boolean(),
	defaultValue: boolean("default_value"),
	blockName: varchar("block_name"),
});

export const formsBlocksCheckboxLocales = pgTable("forms_blocks_checkbox_locales", {
	label: varchar(),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const formsBlocksCountry = pgTable("forms_blocks_country", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	width: numeric(),
	required: boolean(),
	blockName: varchar("block_name"),
});

export const formsBlocksCountryLocales = pgTable("forms_blocks_country_locales", {
	label: varchar(),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const formsBlocksEmail = pgTable("forms_blocks_email", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	width: numeric(),
	required: boolean(),
	blockName: varchar("block_name"),
});

export const formsBlocksEmailLocales = pgTable("forms_blocks_email_locales", {
	label: varchar(),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const formsBlocksMessage = pgTable("forms_blocks_message", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	blockName: varchar("block_name"),
});

export const formsBlocksMessageLocales = pgTable("forms_blocks_message_locales", {
	message: jsonb(),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const formsBlocksNumber = pgTable("forms_blocks_number", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	width: numeric(),
	defaultValue: numeric("default_value"),
	required: boolean(),
	blockName: varchar("block_name"),
});

export const formsBlocksNumberLocales = pgTable("forms_blocks_number_locales", {
	label: varchar(),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const formsBlocksSelectOptions = pgTable("forms_blocks_select_options", {
	order: integer("_order").notNull(),
	parentId: varchar("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	value: varchar().notNull(),
});

export const formsBlocksSelectOptionsLocales = pgTable("forms_blocks_select_options_locales", {
	label: varchar().notNull(),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const formsBlocksSelect = pgTable("forms_blocks_select", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	width: numeric(),
	required: boolean(),
	blockName: varchar("block_name"),
});

export const formsBlocksSelectLocales = pgTable("forms_blocks_select_locales", {
	label: varchar(),
	defaultValue: varchar("default_value"),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const formsBlocksState = pgTable("forms_blocks_state", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	width: numeric(),
	required: boolean(),
	blockName: varchar("block_name"),
});

export const formsBlocksStateLocales = pgTable("forms_blocks_state_locales", {
	label: varchar(),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const formsBlocksText = pgTable("forms_blocks_text", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	width: numeric(),
	required: boolean(),
	blockName: varchar("block_name"),
});

export const formsBlocksTextLocales = pgTable("forms_blocks_text_locales", {
	label: varchar(),
	defaultValue: varchar("default_value"),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const formsBlocksTextarea = pgTable("forms_blocks_textarea", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	path: text("_path").notNull(),
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	width: numeric(),
	required: boolean(),
	blockName: varchar("block_name"),
});

export const formsBlocksTextareaLocales = pgTable("forms_blocks_textarea_locales", {
	label: varchar(),
	defaultValue: varchar("default_value"),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const formsEmails = pgTable("forms_emails", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	emailTo: varchar("email_to"),
	cc: varchar(),
	bcc: varchar(),
	replyTo: varchar("reply_to"),
	emailFrom: varchar("email_from"),
});

export const formsEmailsLocales = pgTable("forms_emails_locales", {
	subject: varchar().default('You\'\'ve received a new message.').notNull(),
	message: jsonb(),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: varchar("_parent_id").notNull(),
});

export const forms = pgTable("forms", {
	id: serial().primaryKey().notNull(),
	title: varchar().notNull(),
	confirmationType: enumFormsConfirmationType("confirmation_type").default('message'),
	redirectUrl: varchar("redirect_url"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const formsLocales = pgTable("forms_locales", {
	submitButtonLabel: varchar("submit_button_label"),
	confirmationMessage: jsonb("confirmation_message"),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: integer("_parent_id").notNull(),
});

export const formSubmissionsSubmissionData = pgTable("form_submissions_submission_data", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	field: varchar().notNull(),
	value: varchar().notNull(),
});

export const formSubmissions = pgTable("form_submissions", {
	id: serial().primaryKey().notNull(),
	formId: integer("form_id").notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const searchCategories = pgTable("search_categories", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	relationTo: varchar("relation_to"),
	title: varchar(),
});

export const search = pgTable("search", {
	id: serial().primaryKey().notNull(),
	priority: numeric(),
	slug: varchar(),
	metaTitle: varchar("meta_title"),
	metaDescription: varchar("meta_description"),
	metaImageId: integer("meta_image_id"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const searchLocales = pgTable("search_locales", {
	title: varchar(),
	id: serial().primaryKey().notNull(),
	locale: locales("_locale").notNull(),
	parentId: integer("_parent_id").notNull(),
});

export const searchRels = pgTable("search_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	postsId: integer("posts_id"),
});

export const payloadLockedDocuments = pgTable("payload_locked_documents", {
	id: serial().primaryKey().notNull(),
	globalSlug: varchar("global_slug"),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const payloadLockedDocumentsRels = pgTable("payload_locked_documents_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	pagesId: integer("pages_id"),
	postsId: integer("posts_id"),
	mediaId: integer("media_id"),
	categoriesId: integer("categories_id"),
	usersId: integer("users_id"),
	redirectsId: integer("redirects_id"),
	formsId: integer("forms_id"),
	formSubmissionsId: integer("form_submissions_id"),
	searchId: integer("search_id"),
});

export const payloadPreferences = pgTable("payload_preferences", {
	id: serial().primaryKey().notNull(),
	key: varchar(),
	value: jsonb(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const payloadPreferencesRels = pgTable("payload_preferences_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	usersId: integer("users_id"),
});

export const payloadMigrations = pgTable("payload_migrations", {
	id: serial().primaryKey().notNull(),
	name: varchar(),
	batch: numeric(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const headerNavItems = pgTable("header_nav_items", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	linkType: enumHeaderNavItemsLinkType("link_type").default('reference'),
	linkNewTab: boolean("link_new_tab"),
	linkUrl: varchar("link_url"),
	linkLabel: varchar("link_label").notNull(),
});

export const header = pgTable("header", {
	id: serial().primaryKey().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }),
});

export const headerRels = pgTable("header_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	pagesId: integer("pages_id"),
});

export const footerNavItems = pgTable("footer_nav_items", {
	order: integer("_order").notNull(),
	parentId: integer("_parent_id").notNull(),
	id: varchar().primaryKey().notNull(),
	linkType: enumFooterNavItemsLinkType("link_type").default('reference'),
	linkNewTab: boolean("link_new_tab"),
	linkUrl: varchar("link_url"),
	linkLabel: varchar("link_label").notNull(),
});

export const footer = pgTable("footer", {
	id: serial().primaryKey().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { precision: 3, withTimezone: true, mode: 'string' }),
});

export const footerRels = pgTable("footer_rels", {
	id: serial().primaryKey().notNull(),
	order: integer(),
	parentId: integer("parent_id").notNull(),
	path: varchar().notNull(),
	pagesId: integer("pages_id"),
});

export const fceExternalOrders = pgTable("fce_external_orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	middleName: text("middle_name"),
	lastName: text("last_name").notNull(),
	purpose: text().notNull(),
	dueAmount: numeric("due_amount", { precision: 6, scale:  2 }).default('NULL'),
	office: text().notNull(),
	paidAt: timestamp("paid_at", { withTimezone: true, mode: 'string' }).notNull(),
	notes: text(),
	status: text().default('processing').notNull(),
	paymentStatus: text("payment_status").default('completed'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		anyoneCanManageFceExternalOrders: pgPolicy("Anyone can manage fce external orders", { as: "permissive", for: "all", to: ["public"], using: sql`true` }),
	}
});

export const aetCoreApplications = pgTable("aet_core_applications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	purpose: text(),
	source: text(),
	status: text().default('draft').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		aetCoreApplicationsEmailCheck: check("aet_core_applications_email_check", sql`email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'::text`),
		aetCoreApplicationsStatusCheck: check("aet_core_applications_status_check", sql`status = ANY (ARRAY['draft'::text, 'submitted'::text, 'processing'::text, 'completed'::text, 'cancelled'::text])`),
	}
});
