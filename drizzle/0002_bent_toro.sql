ALTER TABLE "alogrithms" RENAME TO "algorithms";--> statement-breakpoint
ALTER TABLE "equipments" DROP CONSTRAINT "equipments_alogrithm_id_alogrithms_id_fk";
--> statement-breakpoint
ALTER TABLE "mining_income" DROP CONSTRAINT "mining_income_algorithm_id_alogrithms_id_fk";
--> statement-breakpoint
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_alogrithm_id_algorithms_id_fk" FOREIGN KEY ("alogrithm_id") REFERENCES "public"."algorithms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mining_income" ADD CONSTRAINT "mining_income_algorithm_id_algorithms_id_fk" FOREIGN KEY ("algorithm_id") REFERENCES "public"."algorithms"("id") ON DELETE no action ON UPDATE no action;