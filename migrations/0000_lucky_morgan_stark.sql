CREATE TABLE "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"category" text NOT NULL,
	"image_url" text,
	"available" integer DEFAULT 1 NOT NULL,
	"prep_time" integer NOT NULL,
	"total_rating" numeric DEFAULT '0' NOT NULL,
	"total_reviews" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"cuisine" text NOT NULL,
	"price_range" text NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"image_url" text,
	"opening_hours" text NOT NULL,
	"rating" numeric DEFAULT '0' NOT NULL,
	"total_reviews" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer NOT NULL,
	"menu_item_id" integer,
	"rating" integer NOT NULL,
	"comment" text,
	"customer_name" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"booking_id" integer
);
--> statement-breakpoint
CREATE TABLE "table_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"time" text NOT NULL,
	"party_size" integer NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text NOT NULL,
	"special_requests" text,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist_signups" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"restaurant_name" text NOT NULL,
	"size" integer NOT NULL
);
