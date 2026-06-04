ALTER TABLE "records" RENAME COLUMN "subdomain_id" TO "subdomain";--> statement-breakpoint
ALTER TABLE "subdomains" DROP CONSTRAINT "subdomains_name_unique";--> statement-breakpoint
ALTER TABLE "records" DROP CONSTRAINT "records_subdomain_id_subdomains_id_fk";
--> statement-breakpoint
ALTER TABLE "subdomains" ADD PRIMARY KEY ("name");--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_subdomain_subdomains_name_fk" FOREIGN KEY ("subdomain") REFERENCES "public"."subdomains"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "subdomains" DROP COLUMN "id";