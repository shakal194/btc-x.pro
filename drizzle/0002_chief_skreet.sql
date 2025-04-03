CREATE TABLE "transactions_refBonus" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_refBonus_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"recordDate" timestamp DEFAULT now() NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"user_id" integer NOT NULL,
	"referral_id" integer NOT NULL,
	"referral_percent" integer NOT NULL,
	"referral_bonus" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "invitee" TO "deleting_date";--> statement-breakpoint
ALTER TABLE "electricity_price" ALTER COLUMN "pricePerKWh" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "equipments" ALTER COLUMN "hashrate_unit" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "equipments" ALTER COLUMN "power" SET DATA TYPE numeric(10, 4);--> statement-breakpoint
ALTER TABLE "equipments" ALTER COLUMN "photoUrl" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "balances" ADD COLUMN "depositAddress" varchar(255);--> statement-breakpoint
ALTER TABLE "electricity_price" ADD COLUMN "referral_percent_default" integer;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "balanceShareCount" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "referrer_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "referral_percent" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "referral_bonus" integer DEFAULT 0;