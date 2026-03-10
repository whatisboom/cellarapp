CREATE TABLE "beers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"untappd_id" integer,
	"brewery_id" uuid,
	"style" varchar(255),
	"abv" numeric(5, 2),
	"ibu" integer,
	"description" text,
	"label_url" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "beers_slug_unique" UNIQUE("slug"),
	CONSTRAINT "beers_untappd_id_unique" UNIQUE("untappd_id")
);
--> statement-breakpoint
CREATE TABLE "breweries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"untappd_id" integer,
	"city" varchar(255),
	"state" varchar(255),
	"country" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "breweries_slug_unique" UNIQUE("slug"),
	CONSTRAINT "breweries_untappd_id_unique" UNIQUE("untappd_id")
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"beer_id" uuid NOT NULL,
	"amount" integer DEFAULT 1 NOT NULL,
	"for_trade" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "amount_non_negative" CHECK ("inventory"."amount" >= 0),
	CONSTRAINT "for_trade_non_negative" CHECK ("inventory"."for_trade" >= 0),
	CONSTRAINT "for_trade_lte_amount" CHECK ("inventory"."for_trade" <= "inventory"."amount")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255),
	"avatar_url" varchar(500),
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"auth_provider" varchar(50) NOT NULL,
	"auth_provider_id" varchar(255) NOT NULL,
	"untappd_api_key" varchar(255),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"location" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "beers" ADD CONSTRAINT "beers_brewery_id_breweries_id_fk" FOREIGN KEY ("brewery_id") REFERENCES "public"."breweries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_beer_id_beers_id_fk" FOREIGN KEY ("beer_id") REFERENCES "public"."beers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_user_beer_idx" ON "inventory" USING btree ("user_id","beer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_auth_provider_idx" ON "users" USING btree ("auth_provider","auth_provider_id");