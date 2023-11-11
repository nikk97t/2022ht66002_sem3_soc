CREATE TABLE public.tbl_users (
	userid text NOT NULL,
	username text NOT NULL,
	useremail text NOT NULL,
	userpassword text NOT NULL,
	CONSTRAINT tbl_users_pk PRIMARY KEY (userid)
);


CREATE TABLE public.tbl_podcasts (
	podcastid text NOT NULL,
	podcaststreamid text NOT NULL,
	podcasttitle text NOT NULL,
	podcastpublisher text NOT NULL,
	podcastgenre text NOT NULL,
	podcastreleasedat timestamp NULL DEFAULT now()
);

INSERT INTO public.tbl_podcasts
(podcastid, podcaststreamid, podcasttitle, podcastpublisher, podcastgenre, podcastreleasedat)
VALUES('c4b8ef21-70ae-43e1-bf65-cc22abb1e85e', 'c4b8ef21-70ae-43e1-bf65-cc22abb1e85e', 'Saree Stories: Weaving Tales of Tradition and Modernity', 'Aarav Sharma', 'Documentary', now());
INSERT INTO public.tbl_podcasts
(podcastid, podcaststreamid, podcasttitle, podcastpublisher, podcastgenre, podcastreleasedat)
VALUES('30b16163-cc37-47a8-ba08-5a809f5e30c2', '30b16163-cc37-47a8-ba08-5a809f5e30c2', 'Spices and Soul: Conversations in the Indian Kitchen', 'Diya Patel', 'Documentary', now());
INSERT INTO public.tbl_podcasts
(podcastid, podcaststreamid, podcasttitle, podcastpublisher, podcastgenre, podcastreleasedat)
VALUES('46e1e047-7ee6-4a9e-9213-c099b93744b6', '46e1e047-7ee6-4a9e-9213-c099b93744b6', 'Raga Rhythms: Exploring the Melodies of Indian Heritage', 'Krish Khanna', 'Documentary', now());
INSERT INTO public.tbl_podcasts
(podcastid, podcaststreamid, podcasttitle, podcastpublisher, podcastgenre, podcastreleasedat)
VALUES('2386cbd3-47a7-4204-9e85-713dea6636d0', '2386cbd3-47a7-4204-9e85-713dea6636d0', 'Chai Chronicles: Brews, Banter, and Bharat', 'Zara Khan', 'Documentary', now());
INSERT INTO public.tbl_podcasts
(podcastid, podcaststreamid, podcasttitle, podcastpublisher, podcastgenre, podcastreleasedat)
VALUES('330714da-0dc3-438d-88a8-b73365decbdf', '330714da-0dc3-438d-88a8-b73365decbdf', 'Namaste Narratives: Cultural Journeys Across India', 'Zalak Kapoor', 'Documentary', now());