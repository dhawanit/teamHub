--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)

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

--
-- Name: InvitationStatus; Type: TYPE; Schema: public; Owner: teamhub_user
--

CREATE TYPE public."InvitationStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE public."InvitationStatus" OWNER TO teamhub_user;

--
-- Name: TaskStatus; Type: TYPE; Schema: public; Owner: teamhub_user
--

CREATE TYPE public."TaskStatus" AS ENUM (
    'TODO',
    'INPROGRESS',
    'DONE'
);


ALTER TYPE public."TaskStatus" OWNER TO teamhub_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: teamhub_user
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    "taskId" text NOT NULL,
    "authorId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Comment" OWNER TO teamhub_user;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: teamhub_user
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "teamId" text,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Project" OWNER TO teamhub_user;

--
-- Name: Task; Type: TABLE; Schema: public; Owner: teamhub_user
--

CREATE TABLE public."Task" (
    id text NOT NULL,
    title text NOT NULL,
    "projectId" text NOT NULL,
    "assigneeId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text NOT NULL,
    description text,
    "dueDate" timestamp(3) without time zone,
    status public."TaskStatus" DEFAULT 'TODO'::public."TaskStatus" NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Task" OWNER TO teamhub_user;

--
-- Name: TaskHistory; Type: TABLE; Schema: public; Owner: teamhub_user
--

CREATE TABLE public."TaskHistory" (
    id text NOT NULL,
    "taskId" text NOT NULL,
    "changedBy" text NOT NULL,
    "fromStatus" public."TaskStatus",
    "toStatus" public."TaskStatus" NOT NULL,
    "changedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TaskHistory" OWNER TO teamhub_user;

--
-- Name: Team; Type: TABLE; Schema: public; Owner: teamhub_user
--

CREATE TABLE public."Team" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text NOT NULL
);


ALTER TABLE public."Team" OWNER TO teamhub_user;

--
-- Name: TeamMember; Type: TABLE; Schema: public; Owner: teamhub_user
--

CREATE TABLE public."TeamMember" (
    id text NOT NULL,
    "teamId" text NOT NULL,
    "userId" text NOT NULL,
    status public."InvitationStatus" DEFAULT 'PENDING'::public."InvitationStatus" NOT NULL
);


ALTER TABLE public."TeamMember" OWNER TO teamhub_user;

--
-- Name: User; Type: TABLE; Schema: public; Owner: teamhub_user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO teamhub_user;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: teamhub_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO teamhub_user;

--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: teamhub_user
--

COPY public."Comment" (id, "taskId", "authorId", content, "createdAt") FROM stdin;
f023105d-352e-42d4-b6d6-212945ecaf85	917a8038-f02e-448b-a674-951ca947f1fd	0876ad45-3e89-44cd-9ed6-c9817c85a2ab	Started working on this	2025-06-22 09:54:37.103
78ecb7e5-6e30-41e9-89ac-5b1fdedfbe2d	917a8038-f02e-448b-a674-951ca947f1fd	0876ad45-3e89-44cd-9ed6-c9817c85a2ab	Started working on this 001	2025-06-22 09:55:08.849
88d1ba20-ac4e-4b8c-9aab-56fc031a8a64	93709c0c-d945-413f-ac2e-e4d00067848e	28e970f7-9c18-42cb-8e69-f8906ac67e79	This is test comment on test Task 1	2025-06-23 20:37:59.882
44076d1b-9b79-4ac9-a23a-4674fe5fe59f	b1f3955b-701e-4873-bc6b-0b3637ada16d	28e970f7-9c18-42cb-8e69-f8906ac67e79	Test Comment for History Check	2025-06-23 22:04:27.279
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: teamhub_user
--

COPY public."Project" (id, name, description, "teamId", "createdBy", "createdAt", "updatedAt") FROM stdin;
750475c8-f6bb-4018-a3b2-fb22068872fe	Personal Project	This is not assigned to any team	\N	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	2025-06-22 07:08:40.086	2025-06-22 07:08:40.086
aa0c5671-c893-486e-bb8f-94861d89ada4	Team Project	Project for our team	5e16544a-b013-4500-978a-0759e01284ea	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	2025-06-22 07:10:02.009	2025-06-22 07:10:02.009
7ba7618c-bb27-4089-b8b1-2a5a2f211a97	First Team	This is the first Team created via Frontend	\N	28e970f7-9c18-42cb-8e69-f8906ac67e79	2025-06-22 18:14:41.84	2025-06-22 18:14:41.84
5eb6ba66-0876-4f22-9ed2-c37569d158b7	Test Project react Test	Test Project Description React Test	dbb9dc61-0a5e-4857-8bbe-8096a15ae504	28e970f7-9c18-42cb-8e69-f8906ac67e79	2025-06-24 06:49:28.141	2025-06-24 06:52:05.269
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: teamhub_user
--

COPY public."Task" (id, title, "projectId", "assigneeId", "createdAt", "createdBy", description, "dueDate", status, "updatedAt") FROM stdin;
e2e098c8-128f-47d3-bab4-aec49f383230	Initial Design	750475c8-f6bb-4018-a3b2-fb22068872fe	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	2025-06-22 08:46:49.011	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	Wireframe homepage	2025-06-30 23:59:00	INPROGRESS	2025-06-22 09:53:02.532
917a8038-f02e-448b-a674-951ca947f1fd	Initial Design 01	750475c8-f6bb-4018-a3b2-fb22068872fe	\N	2025-06-22 09:32:56.51	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	Wireframe homepage 02	2025-06-30 23:59:00	DONE	2025-06-22 10:03:16.612
93709c0c-d945-413f-ac2e-e4d00067848e	Test Task 1	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	\N	2025-06-23 18:48:15.338	28e970f7-9c18-42cb-8e69-f8906ac67e79	Test Task Description 1	2025-06-29 00:00:00	TODO	2025-06-23 18:48:15.338
ec530698-5030-468c-bdc5-3398dfa5153b	New Test Task	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	\N	2025-06-23 20:52:24.712	28e970f7-9c18-42cb-8e69-f8906ac67e79	\N	2025-06-24 00:00:00	TODO	2025-06-23 20:52:24.712
9e750837-f1da-4f7f-93db-5568bf9dc79e	Test Task 001	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	\N	2025-06-23 21:08:30.741	28e970f7-9c18-42cb-8e69-f8906ac67e79	Description of Test Task 001	2025-06-25 00:00:00	TODO	2025-06-23 21:08:30.741
2048b4aa-ed4d-4b98-809f-c3109135645e	Test Task 001	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	\N	2025-06-23 21:14:31.454	28e970f7-9c18-42cb-8e69-f8906ac67e79	\N	2025-06-24 00:00:00	TODO	2025-06-23 21:14:31.454
8fee76ce-cf6c-4fa5-a036-1486a106c85e	new Unassigned Task 002	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	\N	2025-06-23 21:19:06.376	28e970f7-9c18-42cb-8e69-f8906ac67e79	New Unassigned Task 002	2025-06-24 00:00:00	TODO	2025-06-23 21:19:06.376
682fdadb-fe3b-45a1-bc71-a844897bb6ae	new Unassigned Task 002	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	\N	2025-06-23 21:19:13.21	28e970f7-9c18-42cb-8e69-f8906ac67e79	New Unassigned Task 002	2025-06-24 00:00:00	TODO	2025-06-23 21:19:13.21
1ef7367f-cb84-4bbb-b4c5-ab1ccfab6b0f	new Unassigned Task 002	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	\N	2025-06-23 21:19:38.189	28e970f7-9c18-42cb-8e69-f8906ac67e79	New Unassigned Task 002	2025-06-24 00:00:00	TODO	2025-06-23 21:19:38.189
71fe5411-d9b2-474c-8c09-0cab27c153a3	new Unassigned Task 002	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	\N	2025-06-23 21:20:17.124	28e970f7-9c18-42cb-8e69-f8906ac67e79	New Unassigned Task 002	2025-06-24 00:00:00	TODO	2025-06-23 21:20:17.124
d538a5af-faa6-4bb9-a0f4-ea7547d5f6ed	new Unassigned Task 002	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	\N	2025-06-23 21:20:50.803	28e970f7-9c18-42cb-8e69-f8906ac67e79	New Unassigned Task 002	2025-06-24 00:00:00	TODO	2025-06-23 21:20:50.803
b1f3955b-701e-4873-bc6b-0b3637ada16d	Updated Task Title	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	28e970f7-9c18-42cb-8e69-f8906ac67e79	2025-06-23 21:23:27.731	28e970f7-9c18-42cb-8e69-f8906ac67e79	Updated description	2025-07-01 00:00:00	DONE	2025-06-23 22:57:25.155
56afd688-e2d5-468c-97bc-3e2e24004ec4	new Unassigned Task 002	7ba7618c-bb27-4089-b8b1-2a5a2f211a97	28e970f7-9c18-42cb-8e69-f8906ac67e79	2025-06-23 21:22:51.109	28e970f7-9c18-42cb-8e69-f8906ac67e79	New Unassigned Task 002	2025-06-24 00:00:00	INPROGRESS	2025-06-23 23:02:24.59
\.


--
-- Data for Name: TaskHistory; Type: TABLE DATA; Schema: public; Owner: teamhub_user
--

COPY public."TaskHistory" (id, "taskId", "changedBy", "fromStatus", "toStatus", "changedAt") FROM stdin;
4469effa-3ab0-4aad-9f99-fa13308ea08f	917a8038-f02e-448b-a674-951ca947f1fd	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	\N	TODO	2025-06-22 09:32:56.514
b97b0339-eece-4637-bbd5-0b354eb48860	e2e098c8-128f-47d3-bab4-aec49f383230	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	TODO	TODO	2025-06-22 09:33:02.075
ba770c29-ad14-443e-9323-fffc12ed9845	e2e098c8-128f-47d3-bab4-aec49f383230	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	TODO	INPROGRESS	2025-06-22 09:53:02.535
92b988bb-e88b-4d6b-b354-4305c38d0599	917a8038-f02e-448b-a674-951ca947f1fd	0876ad45-3e89-44cd-9ed6-c9817c85a2ab	TODO	TODO	2025-06-22 09:54:37.116
a477b771-88b2-4d42-bb73-1c38bd690d0c	917a8038-f02e-448b-a674-951ca947f1fd	0876ad45-3e89-44cd-9ed6-c9817c85a2ab	TODO	TODO	2025-06-22 09:55:08.861
4fcc79a5-39a9-405e-858f-2592b326c302	917a8038-f02e-448b-a674-951ca947f1fd	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	TODO	INPROGRESS	2025-06-22 10:02:51.363
4fd8f6a4-342b-4dc8-b854-68586dd8de4f	917a8038-f02e-448b-a674-951ca947f1fd	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	INPROGRESS	DONE	2025-06-22 10:03:16.624
71deb5d1-e89c-4f94-ba8e-6e469382c300	93709c0c-d945-413f-ac2e-e4d00067848e	28e970f7-9c18-42cb-8e69-f8906ac67e79	\N	TODO	2025-06-23 18:48:15.352
b67c8563-e4df-4533-b4e1-5c23c2fd36e4	93709c0c-d945-413f-ac2e-e4d00067848e	28e970f7-9c18-42cb-8e69-f8906ac67e79	TODO	TODO	2025-06-23 20:37:59.919
71ead1d0-1487-461f-ac84-0a85bc519ed3	ec530698-5030-468c-bdc5-3398dfa5153b	28e970f7-9c18-42cb-8e69-f8906ac67e79	\N	TODO	2025-06-23 20:52:24.716
e01ef9bb-c480-40de-b082-56f84c1c05bc	9e750837-f1da-4f7f-93db-5568bf9dc79e	28e970f7-9c18-42cb-8e69-f8906ac67e79	\N	TODO	2025-06-23 21:08:30.748
ea86704f-8f4c-424d-84a9-e08a89298927	2048b4aa-ed4d-4b98-809f-c3109135645e	28e970f7-9c18-42cb-8e69-f8906ac67e79	\N	TODO	2025-06-23 21:14:31.466
6a71d73a-a066-483f-8bf8-9cd3a4f2cbce	56afd688-e2d5-468c-97bc-3e2e24004ec4	28e970f7-9c18-42cb-8e69-f8906ac67e79	\N	TODO	2025-06-23 21:22:51.12
1979712e-9823-445f-9f40-e7ef90d315c0	b1f3955b-701e-4873-bc6b-0b3637ada16d	28e970f7-9c18-42cb-8e69-f8906ac67e79	\N	TODO	2025-06-23 21:23:27.735
b0a1feb1-307f-4756-8cd8-535513d15d9b	b1f3955b-701e-4873-bc6b-0b3637ada16d	28e970f7-9c18-42cb-8e69-f8906ac67e79	INPROGRESS	INPROGRESS	2025-06-23 22:04:27.292
\.


--
-- Data for Name: Team; Type: TABLE DATA; Schema: public; Owner: teamhub_user
--

COPY public."Team" (id, name, "createdAt", "createdBy") FROM stdin;
9c01f755-5cd3-4972-beb0-4be4062c7e44	Dhawanit Team	2025-06-22 05:25:48.458	9fc1ca8d-51a4-4486-9293-6ad3c42000b0
5e16544a-b013-4500-978a-0759e01284ea	Dhawanit 1 Team	2025-06-22 05:51:58.741	ea2927fd-82bb-4951-874d-db4b059067b9
009a5863-0363-46fa-afb4-237710423c16	New Dhawanit 2 Team	2025-06-22 07:23:18.531	d339c914-50ee-4916-b78a-f7dc1ecc8a21
dbb9dc61-0a5e-4857-8bbe-8096a15ae504	Dhawanit New Team	2025-06-22 19:53:46.458	28e970f7-9c18-42cb-8e69-f8906ac67e79
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: teamhub_user
--

COPY public."TeamMember" (id, "teamId", "userId", status) FROM stdin;
4997ed8a-9f38-4f69-982e-d3e8263c2327	9c01f755-5cd3-4972-beb0-4be4062c7e44	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	ACCEPTED
7477f345-3e79-4ee1-b2be-e05b6add5aa8	5e16544a-b013-4500-978a-0759e01284ea	ea2927fd-82bb-4951-874d-db4b059067b9	ACCEPTED
137c12d2-6dab-467e-90a6-3b968e351c59	5e16544a-b013-4500-978a-0759e01284ea	0876ad45-3e89-44cd-9ed6-c9817c85a2ab	PENDING
c2a18a90-abc3-4f00-b0c0-de017e72beb5	5e16544a-b013-4500-978a-0759e01284ea	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	ACCEPTED
6489195d-346b-4e44-a1b9-3f90255319d0	009a5863-0363-46fa-afb4-237710423c16	d339c914-50ee-4916-b78a-f7dc1ecc8a21	ACCEPTED
2065055a-878c-4ed3-8c58-a5d652b76491	009a5863-0363-46fa-afb4-237710423c16	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	ACCEPTED
f4961a2c-b27a-47ab-989c-7f22fd6e0903	009a5863-0363-46fa-afb4-237710423c16	0876ad45-3e89-44cd-9ed6-c9817c85a2ab	REJECTED
f53df302-92da-4def-b268-580b8266d812	009a5863-0363-46fa-afb4-237710423c16	ea2927fd-82bb-4951-874d-db4b059067b9	ACCEPTED
ff947ed9-e190-42c0-9dc4-ef9a1e56cc8c	dbb9dc61-0a5e-4857-8bbe-8096a15ae504	28e970f7-9c18-42cb-8e69-f8906ac67e79	ACCEPTED
c573be48-2fc9-43a6-ac9e-1dd8f5e9e5d6	dbb9dc61-0a5e-4857-8bbe-8096a15ae504	9fc1ca8d-51a4-4486-9293-6ad3c42000b0	PENDING
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: teamhub_user
--

COPY public."User" (id, name, email, password, "createdAt", "updatedAt") FROM stdin;
9fc1ca8d-51a4-4486-9293-6ad3c42000b0	Dhawanit	dhawanit@example.com	$2b$10$L33evy7v7dk4I/CY8nUOt.YOPbNhDqVov8G87ULfl89swU6yTE9km	2025-06-22 05:24:31.984	2025-06-22 05:24:31.984
ea2927fd-82bb-4951-874d-db4b059067b9	Dhawanit 1	dhawanit1@example.com	$2b$10$vzwJvyFfi2hfeOave1B1xuGzhxWOQIef08d6UB7g./6MH5gUDY032	2025-06-22 05:24:39.194	2025-06-22 05:24:39.194
0876ad45-3e89-44cd-9ed6-c9817c85a2ab	Dhawanit 2	dhawanit2@example.com	$2b$10$vK8OIRUNyUVFOIOGZwyHHewAtQut3JwMPLZaLzXS8YC6OX.KL4aFq	2025-06-22 05:24:47.756	2025-06-22 05:24:47.756
d339c914-50ee-4916-b78a-f7dc1ecc8a21	Dhawanit 3	dhawanit3@example.com	$2b$10$waxOByAuli.F88G.JlXGpuamgtRGrs4UL8gET2Cksdy8jGN4DSaIi	2025-06-22 05:24:57.816	2025-06-22 05:24:57.816
c910e6b2-a6e0-4600-9ade-430aa3ecc491	Dhawanit 4	dhawanit4@example.com	$2b$10$klcvfWCeEcr3wSHMJtKhX.RzfSoR88Y1mAyABO1bWzYszejesnDqm	2025-06-22 05:25:05.175	2025-06-22 05:25:05.175
f8997716-d0ed-4e2e-a538-116f4925208c	Dhawanit 5	dhawanit5@example.com	$2b$10$VxEZ47ze8UPVbGy9Lk5KmeH3NuLzFgJxxkqjD3l.RXk6QDnGO0iam	2025-06-22 05:25:11.904	2025-06-22 05:25:11.904
28e970f7-9c18-42cb-8e69-f8906ac67e79	Dhawanit Bhatnagar	dhawanit@gmail.com	$2b$10$63u1CgznO99UsHKQs4LCq.tt7t8KHo3AIg7B/lEaz/PBNOtsOBHnW	2025-06-22 14:14:11.098	2025-06-22 14:14:11.098
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: teamhub_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0d83dca4-bdea-47f0-ad65-e48961581572	62f136c836f377944a0634fdad2e5b6a9b841fe198e5f335288de21a7772cac6	2025-06-22 10:53:32.604014+05:30	20250622052323_add_project_model	\N	\N	2025-06-22 10:53:32.50976+05:30	1
4d16583a-6f9f-44fb-8741-88296ab7009e	a0ecda9c9558717b67a8ae11088cd39404df45e3263a4d832ca9ab6907eb8d25	2025-06-22 11:09:46.756285+05:30	20250622053946_add_invitation_status	\N	\N	2025-06-22 11:09:46.74844+05:30	1
f64e6c92-9ec1-4d6d-b023-04d91c393746	4a88b44618b5dfe1e9add786928085211c68d85458c8d66125ac7dc449c359e1	2025-06-22 12:32:35.831323+05:30	20250622070235_make_team_optional_in_project	\N	\N	2025-06-22 12:32:35.82321+05:30	1
ba627a6b-4905-404d-8c67-300dfd146aa5	8e77922e97ba1bf79c2736948fde05cafec32383b7489015a5f447df50f8e87d	2025-06-22 13:38:16.073301+05:30	20250622080816_add_task_module	\N	\N	2025-06-22 13:38:16.039731+05:30	1
\.


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: TaskHistory TaskHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."TaskHistory"
    ADD CONSTRAINT "TaskHistory_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: TeamMember TeamMember_pkey; Type: CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);


--
-- Name: Team Team_pkey; Type: CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Project_name_teamId_key; Type: INDEX; Schema: public; Owner: teamhub_user
--

CREATE UNIQUE INDEX "Project_name_teamId_key" ON public."Project" USING btree (name, "teamId");


--
-- Name: TeamMember_teamId_userId_key; Type: INDEX; Schema: public; Owner: teamhub_user
--

CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON public."TeamMember" USING btree ("teamId", "userId");


--
-- Name: Team_name_key; Type: INDEX; Schema: public; Owner: teamhub_user
--

CREATE UNIQUE INDEX "Team_name_key" ON public."Team" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: teamhub_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Comment Comment_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TaskHistory TaskHistory_changedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."TaskHistory"
    ADD CONSTRAINT "TaskHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TaskHistory TaskHistory_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."TaskHistory"
    ADD CONSTRAINT "TaskHistory_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Task Task_assigneeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Task Task_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Task Task_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeamMember TeamMember_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeamMember TeamMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Team Team_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: teamhub_user
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

