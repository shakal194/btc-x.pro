CREATE TABLE "users_address" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_address_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"user_id" integer NOT NULL,
	"coinTicker" varchar(10) NOT NULL,
	"depositAddress" varchar(255) NOT NULL,
	"depositId" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "balances" DROP CONSTRAINT "balances_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "balances" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "balances" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions_refBonus" ALTER COLUMN "referral_bonus" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "referral_bonus" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "users_address" ADD CONSTRAINT "users_address_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balances" DROP COLUMN "depositAddress";