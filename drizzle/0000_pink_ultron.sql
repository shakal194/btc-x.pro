CREATE TABLE "algorithms" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "algorithms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"coinTickers" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "balances" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "balances_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"user_id" integer NOT NULL,
	"coinTicker" varchar(10) NOT NULL,
	"coinAmount" numeric(30, 8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deposits" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "deposits_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"user_id" integer NOT NULL,
	"coinTicker" varchar(10) NOT NULL,
	"amount" numeric(30, 8) NOT NULL,
	"enrolled" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "electricity_price" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "electricity_price_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"pricePerKWh" numeric(30, 8) NOT NULL,
	"recordDate" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "equipments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"algorithm_id" integer NOT NULL,
	"hashrate_unit" varchar NOT NULL,
	"hashrate" integer NOT NULL,
	"power" numeric NOT NULL,
	"purchasePrice" integer NOT NULL,
	"salePrice" integer NOT NULL,
	"shareCount" integer NOT NULL,
	"photoUrl" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "history_changes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "history_changes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"changeDate" timestamp DEFAULT now() NOT NULL,
	"fieldName" varchar(255) NOT NULL,
	"oldValue" varchar(255) NOT NULL,
	"newValue" varchar(255) NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mining_income" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mining_income_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"algorithm_id" integer NOT NULL,
	"coinsPerHashrate" numeric(30, 8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mining_rewards" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mining_rewards_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"recordDate" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"coinTicker" varchar(10) NOT NULL,
	"minedAmount" numeric(30, 8) NOT NULL,
	"electricityCost" numeric(30, 8) NOT NULL,
	"rewardAmount" numeric(30, 8) NOT NULL,
	"balanceAfter" numeric(30, 8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"transactionDate" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"equipment_id" integer NOT NULL,
	"shareCount" integer NOT NULL,
	"pricePerShare" numeric(10, 2) NOT NULL,
	"isPurchase" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"registration_date" timestamp DEFAULT now() NOT NULL,
	"status" varchar DEFAULT 'user' NOT NULL,
	"referral_code" integer NOT NULL,
	"invitee" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "withdrawals" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "withdrawals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"user_id" integer NOT NULL,
	"coinTicker" varchar(10) NOT NULL,
	"network" varchar(50) NOT NULL,
	"address" varchar(255) NOT NULL,
	"amount" numeric(30, 8) NOT NULL,
	"status" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "balances" ADD CONSTRAINT "balances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_algorithm_id_algorithms_id_fk" FOREIGN KEY ("algorithm_id") REFERENCES "public"."algorithms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "history_changes" ADD CONSTRAINT "history_changes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mining_income" ADD CONSTRAINT "mining_income_algorithm_id_algorithms_id_fk" FOREIGN KEY ("algorithm_id") REFERENCES "public"."algorithms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mining_rewards" ADD CONSTRAINT "mining_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_equipment_id_equipments_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;