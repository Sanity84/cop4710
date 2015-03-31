# DB is still a work in progress
# Users, role dictates access control, valid values are
# admin, rso, student
CREATE TABLE users (
	`id` int(11) auto_increment,
	`firstname` varchar(20) NOT NULL,
	`lastname` varchar(20) NOT NULL,
	`username` varchar(30) NOT NULL,
	`password` varchar(255) NOT NULL,
	`email` varchar(40) NOT NULL,
	`role` varchar(10) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE (`email`)
);

# Universities
CREATE TABLE universities (
	`id` int(11) auto_increment,
	`name` varchar(30) NOT NULL,
	`location` varchar(255) NOT NULL,
	`userid` int(11) NOT NULL,
	`description` text,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

# RSOs, I don't even know what RSO stands for
CREATE TABLE rsos (
	`id` int(11) auto_increment,
	`name` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`universityid` int(11) NOT NULL,
	`userid` int(11) NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`universityid`) REFERENCES `universities`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

# Events
CREATE TABLE events (
	`id` int(11) auto_increment,
	`location` varchar(255) NOT NULL,
	`type` varchar(20) NOT NULL,
	`visibility` varchar(10) NOT NULL,
	`date` DATETIME NOT NULL,
	`description` text NOT NULL,
	`contactphone` varchar(20),
	`contactemail` varchar(60),
	`rsoid` int(11) NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`rsoid`) REFERENCES `rsos`(`id`)
);

# Comments
CREATE TABLE comments (
	`body` text NOT NULL,
	`created` timestamp DEFAULT CURRENT_TIMESTAMP,
	`userid` int(11) NOT NULL,
	`eventid` int(11) NOT NULL,
	PRIMARY KEY (`userid`, `eventid`)
);

# Image paths and names
CREATE TABLE images (
	`id` int(11) auto_increment,
	`path` varchar(255) NOT NULL,
	`name` varchar(255),
	`created` timestamp DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
);

# User images
CREATE TABLE image_users (
	`imageid` int(11) NOT NULL,
	`userid` int(11) NOT NULL,
	PRIMARY KEY (`imageid`, `userid`),
	FOREIGN KEY (`imageid`) REFERENCES `images`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

# University images
CREATE TABLE image_universities (
	`imageid` int(11) NOT NULL,
	`universityid` int(11) NOT NULL,
	PRIMARY KEY (`imageid`, `universityid`),
	FOREIGN KEY (`imageid`) REFERENCES `images`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`universityid`) REFERENCES `universities`(`id`) ON DELETE CASCADE
);

# RSO images
CREATE TABLE image_rsos (
	`imageid` int(11) NOT NULL,
	`rsoid` int(11) NOT NULL,
	PRIMARY KEY (`imageid`, `rsoid`),
	FOREIGN KEY (`imageid`) REFERENCES `images`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`rsoid`) REFERENCES `rsos`(`id`) ON DELETE CASCADE
);

# Event images
CREATE TABLE image_events (
	`imageid` int(11) NOT NULL,
	`eventid` int(11) NOT NULL,
	PRIMARY KEY (`imageid`, `eventid`),
	FOREIGN KEY (`imageid`) REFERENCES `images`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`eventid`) REFERENCES `events`(`id`) ON DELETE CASCADE
);

# Students belong to a specific university
CREATE TABLE university_users (
	`universityid` int(11) NOT NULL,
	`userid` int(11) NOT NULL,
	PRIMARY KEY (`universityid`, `userid`),
	FOREIGN KEY (`universityid`) REFERENCES `universities`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

# students who are following a rso
CREATE TABLE rso_users (
	`rsoid` int(11) NOT NULL,
	`userid` int(11) NOT NULL,
	PRIMARY KEY (`rsoid`, `userid`),
	FOREIGN KEY (`rsoid`) REFERENCES `rsos`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE rsorequest (
	`id` int(11) auto_increment,
	`name` varchar(255),
	`created` timestamp DEFAULT CURRENT_TIMESTAMP,
	`universityid` int(11) NOT NULL,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`universityid`) REFERENCES `universities`(`id`) ON DELETE CASCADE
);

CREATE TABLE rsorequest_users (
	`rsorequest` int(11) NOT NULL,
	`userid` int(11) NOT NULL,
	`leader` boolean DEFAULT 0,
	PRIMARY KEY (`rsorequest`, `userid`)
);

