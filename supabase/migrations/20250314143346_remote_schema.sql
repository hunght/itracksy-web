
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."beta_invites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lead_id" "uuid",
    "email" "text" NOT NULL,
    "name" "text" NOT NULL,
    "invite_message" "text" NOT NULL,
    "sent_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" DEFAULT 'sent'::"text" NOT NULL,
    "opened_at" timestamp with time zone,
    "clicked_at" timestamp with time zone,
    "registered_at" timestamp with time zone,
    "delivered_at" timestamp without time zone,
    CONSTRAINT "beta_invites_status_check" CHECK (("status" = ANY (ARRAY['sent'::"text", 'opened'::"text", 'clicked'::"text", 'registered'::"text"])))
);

ALTER TABLE "public"."beta_invites" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."email_events" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email_id" "text" NOT NULL,
    "recipient_email" "text" NOT NULL,
    "event_type" "text" NOT NULL,
    "subject" "text",
    "email_type" "text",
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."email_events" OWNER TO "postgres";

COMMENT ON TABLE "public"."email_events" IS 'Stores email tracking events from Resend webhooks';

COMMENT ON COLUMN "public"."email_events"."email_id" IS 'Unique ID of the email from Resend';

COMMENT ON COLUMN "public"."email_events"."recipient_email" IS 'Email address of the recipient';

COMMENT ON COLUMN "public"."email_events"."event_type" IS 'Type of event (sent, delivered, opened, clicked, bounced, etc.)';

COMMENT ON COLUMN "public"."email_events"."subject" IS 'Subject of the email';

COMMENT ON COLUMN "public"."email_events"."email_type" IS 'Type of email (welcome, beta_invite, etc.)';

COMMENT ON COLUMN "public"."email_events"."metadata" IS 'Additional metadata about the event (click URL, user agent, etc.)';

CREATE TABLE IF NOT EXISTS "public"."feedback" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "feedback_type" "text" NOT NULL,
    "message" "text" NOT NULL,
    CONSTRAINT "feedback_feedback_type_check" CHECK (("feedback_type" = ANY (ARRAY['general'::"text", 'bug'::"text", 'feature'::"text", 'other'::"text"])))
);

ALTER TABLE "public"."feedback" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."leads" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "message" "text" NOT NULL
);

ALTER TABLE "public"."leads" OWNER TO "postgres";

ALTER TABLE ONLY "public"."beta_invites"
    ADD CONSTRAINT "beta_invites_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."email_events"
    ADD CONSTRAINT "email_events_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");

CREATE INDEX "email_events_email_type_idx" ON "public"."email_events" USING "btree" ("email_type");

CREATE INDEX "email_events_event_type_idx" ON "public"."email_events" USING "btree" ("event_type");

CREATE INDEX "email_events_recipient_email_idx" ON "public"."email_events" USING "btree" ("recipient_email");

ALTER TABLE ONLY "public"."beta_invites"
    ADD CONSTRAINT "beta_invites_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;

CREATE POLICY "Allow anonymous insert" ON "public"."feedback" FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated insert" ON "public"."beta_invites" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Allow authenticated read" ON "public"."beta_invites" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Allow authenticated read" ON "public"."feedback" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));

CREATE POLICY "Service role can manage all email events" ON "public"."email_events" TO "service_role" USING (true);

CREATE POLICY "Users can view their own email events" ON "public"."email_events" FOR SELECT USING ((("auth"."uid"())::"text" = "recipient_email"));

ALTER TABLE "public"."beta_invites" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."email_events" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."feedback" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."beta_invites" TO "anon";
GRANT ALL ON TABLE "public"."beta_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."beta_invites" TO "service_role";

GRANT ALL ON TABLE "public"."email_events" TO "anon";
GRANT ALL ON TABLE "public"."email_events" TO "authenticated";
GRANT ALL ON TABLE "public"."email_events" TO "service_role";

GRANT ALL ON TABLE "public"."feedback" TO "anon";
GRANT ALL ON TABLE "public"."feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."feedback" TO "service_role";

GRANT ALL ON TABLE "public"."leads" TO "anon";
GRANT ALL ON TABLE "public"."leads" TO "authenticated";
GRANT ALL ON TABLE "public"."leads" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
