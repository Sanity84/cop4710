-- phpMyAdmin SQL Dump
-- version 4.3.11.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 16, 2015 at 12:04 PM
-- Server version: 5.6.23
-- PHP Version: 5.5.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `collegeevent`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `body` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userid` int(11) NOT NULL,
  `eventid` int(11) NOT NULL,
  `rating` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`body`, `created`, `userid`, `eventid`, `rating`) VALUES
('Come and enjoy learning! There will be no pizza here.', '2015-04-16 05:38:52', 24, 13, 5),
('It''s fun to run!', '2015-04-12 01:31:07', 43, 9, 4),
('Running is the best!', '2015-04-12 01:31:21', 44, 9, 5),
('We knit those fancy hats that are all the rage! Come and watch or better yet knit a hat!', '2015-04-16 03:10:40', 44, 12, 5);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL,
  `location_name` varchar(255) NOT NULL,
  `type` varchar(20) NOT NULL,
  `visibility` varchar(10) NOT NULL,
  `date` datetime NOT NULL,
  `description` text NOT NULL,
  `contactphone` varchar(30) DEFAULT NULL,
  `contactemail` varchar(60) DEFAULT NULL,
  `rsoid` int(11) DEFAULT NULL,
  `universityid` int(11) NOT NULL,
  `name` varchar(140) NOT NULL,
  `location_lat` double DEFAULT NULL,
  `location_lng` double DEFAULT NULL,
  `total_ratings` int(6) NOT NULL DEFAULT '0',
  `times_rated` int(6) NOT NULL DEFAULT '0',
  `rating` double NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `location_name`, `type`, `visibility`, `date`, `description`, `contactphone`, `contactemail`, `rsoid`, `universityid`, `name`, `location_lat`, `location_lng`, `total_ratings`, `times_rated`, `rating`) VALUES
(8, 'Student Union UCF Campus', 'social', 'public', '2015-05-01 04:00:00', '<p><span style="color: #333333; font-family: ''Helvetica Neue'', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 22.5px;">Experience&nbsp;UCF''s Clothesline Project display&nbsp;in the Student Union Atrium and join UCF Victim Services to decorate a shirt on April 1, 8, 15, 22, 29 from 10am-2pm on the Student Union Patio.The Clothesline Project is a program started on Cape Cod, MA, in 1990 to address the issue of violence against women. It is a vehicle for women affected by violence to express their emotions by decorating a shirt. They then hang the shirt on a clothesline to be viewed by others as testimony to the problem of violence against women. With the support of many, it has since spread world-wide.</span></p>', NULL, NULL, 4, 2, 'The Clothesline Project', 28.601914, -81.200521, 0, 0, 0),
(9, 'Lake Claire Recreational Area', 'social', 'public', '2015-04-30 04:00:00', '<p><span style="color: #333333; font-family: ''Helvetica Neue'', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 22.5px;">Shack n&rsquo; Dash is a 5k run/shack building event hosted by the University of Central Florida Campus Chapter of Habitat for Humanity. The 5k is more than just a race, local vendors and UCF student organizations will compete with each other to build the ultimate shack out of cardboard, promoting their business or club.</span><br style="box-sizing: border-box; color: #333333; font-family: ''Helvetica Neue'', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 22.5px;" /><a style="box-sizing: border-box; color: #428bca; text-decoration: none; font-family: ''Helvetica Neue'', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 22.5px; background: transparent;" href="https://www.facebook.com/events/331867417002603" target="_blank" rel="nofollow">https://www.facebook.com/events/331867417002603</a><br style="box-sizing: border-box; color: #333333; font-family: ''Helvetica Neue'', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 22.5px;" /><a style="box-sizing: border-box; color: #428bca; text-decoration: none; font-family: ''Helvetica Neue'', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 22.5px; background: transparent;" href="http://www.active.com/orlando-fl/running/races/shack-n-dash-5k-2015" target="" rel="nofollow">http://www.active.com/orlando-fl/running/races/shack-n-dash-5k-2015</a></p>', NULL, NULL, 4, 2, 'Shack N'' Dash Habitat 5k Run', 28.603934, -81.203525, 9, 2, 4.666666666666667),
(10, 'Full Sail Orlando Campus', 'social', 'public', '2015-04-20 04:00:00', '<p>Join us as we throw darts at a circle! We are raising money to buy art supplies!</p>', NULL, NULL, 28, 7, 'Arts for darts', 28.596647, -81.301853, 0, 0, 0),
(11, 'Harris Engineering', 'social', 'student', '2015-04-22 04:00:00', '<p>Come meet and greet UCF student engineers and see what they have been working on!</p>', '1234', 'someone@luls.com', 4, 2, 'Meet and greet', 28.600609, -81.197882, 0, 0, 0),
(12, 'Student Union', 'social', 'rso', '2015-04-16 14:00:00', '<h2>Knitting Circle with Friends!</h2>\n<p>Come join us as we sit in a circle and knit things because we can!</p>', NULL, NULL, 15, 2, 'Knitting Circle', 28.6019, -81.200307, 5, 1, 5),
(13, 'Education Building', 'social', 'student', '2015-04-20 13:00:00', '<p>Come join us as we learn about learning! Teachers and anyone is welcome!</p>', NULL, NULL, NULL, 2, 'Learning for all', 28.600242, -81.204051, 5, 1, 5),
(14, 'Library', 'social', 'public', '2015-04-16 14:00:00', '<p>Come join us for reading!</p>', NULL, NULL, NULL, 2, 'Reading Time!', 28.600195, -81.201423, 0, 0, 0),
(15, 'Full sail campus', 'social', 'student', '2015-04-16 14:30:00', '<p style="margin: 0px; padding: 0px 0px 18px; font-size: 12px; line-height: 18px; color: #4d4b39; font-family: Arial, Helvetica, sans-serif;">The lights dim and the crowd goes wild &ndash; it&rsquo;s show time, and there&rsquo;s no shortage of action going on behind the scenes, from running audio and lighting to shooting the event on video.&nbsp;<br style="margin: 0px; padding: 0px;" /><br style="margin: 0px; padding: 0px;" />In the Show Production program, you&rsquo;ll learn all about the production details of live events, as you handle the same gear that&rsquo;s used in the industry every day. You&rsquo;ll do this in our on-campus live sound environments, where you&rsquo;ll cut your teeth and put your skills to the test in multiple performance settings.</p>\n<p style="margin: 0px; padding: 0px 0px 18px; font-size: 12px; line-height: 18px; color: #4d4b39; font-family: Arial, Helvetica, sans-serif;">From mixing the sound on stage at the front-of-house console, to executing a multi-camera shoot of the show, to recording and mixing the event in our production suites, it&rsquo;s your chance to learn by doing in a fast-paced, exciting work space.</p>', NULL, NULL, 28, 7, 'Live Event Production', 28.596026, -81.302175, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE IF NOT EXISTS `images` (
  `id` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `universityid` int(11) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rsos`
--

CREATE TABLE IF NOT EXISTS `rsos` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `universityid` int(11) NOT NULL,
  `type` varchar(30) NOT NULL,
  `leaderid` int(11) NOT NULL,
  `pending` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rsos`
--

INSERT INTO `rsos` (`id`, `name`, `description`, `universityid`, `type`, `leaderid`, `pending`) VALUES
(4, 'Web app developers', 'A club for students to talk and learn all about web app development', 2, 'club', 43, 0),
(15, 'Knitting for Knights', 'A club for students to talk and learn all about knitting', 2, 'club', 44, 0),
(27, 'Dog lovers', 'Those who love dogs!', 2, 'club', 45, 0),
(28, 'Art Nerds', 'Arts for nerds', 7, 'club', 64, 0);

-- --------------------------------------------------------

--
-- Table structure for table `rso_users`
--

CREATE TABLE IF NOT EXISTS `rso_users` (
  `rsoid` int(11) NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rso_users`
--

INSERT INTO `rso_users` (`rsoid`, `userid`) VALUES
(4, 43),
(15, 43),
(4, 44),
(15, 44),
(4, 45),
(15, 45),
(27, 45),
(4, 46),
(15, 46),
(27, 46),
(4, 47),
(15, 47),
(27, 47),
(4, 48),
(15, 48),
(27, 48),
(15, 53),
(27, 53),
(27, 54),
(4, 57),
(15, 57),
(4, 63),
(28, 64),
(28, 65),
(28, 66),
(28, 67),
(28, 68),
(28, 69);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL,
  `session` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expire` datetime NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=457 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `session`, `created`, `expire`, `userid`) VALUES
(246, '6178ddf63c48ba02837a163a5a36a5a22d4bdd0efa1134740920a4f8b1d8464b', '2015-04-01 21:49:23', '2015-05-01 17:49:23', 46),
(248, 'a13f550e810bda2681f8646e503feaeed81b7721116ff8372ebdca17fec794f3', '2015-04-01 21:50:32', '2015-05-01 17:50:32', 48),
(302, 'cf59180a1ad4ab834f87ce1742e8e1a0284310e1e1d065417225f323bb46bf2a', '2015-04-02 15:01:38', '2015-05-02 11:01:38', 50),
(305, '78d96867b7843a5d282744ce2f24a08749bf1b87bc4c781f5029282b618789f6', '2015-04-02 15:41:10', '2015-05-02 11:41:10', 51),
(327, '22d0a9907bb5553981222977302aa24c571c8cfe0db6f26e3ae81d18a812b3ec', '2015-04-03 18:34:17', '2015-05-03 14:34:17', 32),
(365, '897b85f0b6245833e2e6b90092240b44231d689c33e6aa0d31e21623cfaa0f26', '2015-04-09 03:20:56', '2015-05-08 23:20:56', 61),
(366, '292a1e38dd303d30d17fce1c4e8a362fb62eb39c1d81e3555d585fac9eef5281', '2015-04-09 03:26:46', '2015-05-08 23:26:46', 62),
(413, '888070e62b403dfac36fcc23584bf18abfd09fae15d98bf335d0b9e47190fd04', '2015-04-14 18:07:28', '2015-05-14 14:07:28', 45);

-- --------------------------------------------------------

--
-- Table structure for table `universities`
--

CREATE TABLE IF NOT EXISTS `universities` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `location` varchar(255) NOT NULL,
  `userid` int(11) NOT NULL,
  `description` text,
  `email_domain` varchar(30) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `universities`
--

INSERT INTO `universities` (`id`, `name`, `location`, `userid`, `description`, `email_domain`) VALUES
(2, 'University of Central Florida', '4000 Central Florida Blvd, Orlando, FL 32816', 24, 'The University of Central Florida, founded in 1963, is the second-largest university in the nation. Located in Orlando, Florida, UCF and its 12 colleges provide opportunities to 61,000 students, offering 210 degree programs from UCF’s main campus, hospitality campus, health sciences campus and its 10 regional locations.', '@knights.ucf.edu'),
(5, 'Rollins College', '1000 Holt Avenue, Winter Park, FL 32789', 36, 'Founded in 1885 by New England Congregationalists who sought to bring their style of liberal arts education to the Florida frontier, Rollins is a four-year, coeducational institution and the first recognized college in Florida.', '@student.rollins.edu'),
(7, 'Full Sail University', 'Winter Park, FL', 56, 'An arts college for students who enjoy doing artsy things.', '@fullsail.edu'),
(8, 'University of South Florida', 'South Florida', 31, '<p><span style="color: #666666; font-family: Arial, sans-serif; font-size: 13.0080003738403px; line-height: 19.5120010375977px;">The University of South Florida is a high-impact, global research university located in beautiful Tampa Bay on Florida''s spectacular west coast. It is one of the largest public universities in the nation, and among the top 50 universities, public or private, for federal research expenditures. The university is one of only four Florida public universities classified by the Carnegie Foundation for the Advancement of Teaching in the top tier of research universities, a distinction attained by only 2.3 percent of all universities.</span></p>', '@student.usf.edu');

-- --------------------------------------------------------

--
-- Table structure for table `university_users`
--

CREATE TABLE IF NOT EXISTS `university_users` (
  `universityid` int(11) NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `university_users`
--

INSERT INTO `university_users` (`universityid`, `userid`) VALUES
(2, 24),
(8, 31),
(5, 36),
(2, 43),
(2, 44),
(2, 45),
(2, 46),
(2, 47),
(2, 48),
(2, 53),
(2, 54),
(7, 56),
(2, 57),
(2, 58),
(5, 60),
(7, 61),
(2, 62),
(2, 63),
(7, 64),
(7, 65),
(7, 66),
(7, 67),
(7, 68),
(7, 69),
(8, 70),
(2, 71);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(40) NOT NULL,
  `role` varchar(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `password`, `email`, `role`) VALUES
(24, 'John C.', 'Hitt', 'johnc', '$2y$10$/I6m9vE3Ya58QwQyIXYd7O/8vS0K7bbT.g7MhRdQSsF84n8mok5xm', 'johnc@ucf.edu', 'admin'),
(31, 'Judy', 'Genshaft', 'judy', '$2y$10$vZVPtMKlyEReupPtf0tdeet6vQDkKFfH/zgT7bgBeJ6n1Pd6BPFKi', 'judy@usf.edu', 'admin'),
(32, 'W. Kent', 'Fuchs', 'kent', '$2y$10$hoxUDsSMGMFonFKomlSdkOgR3v9SHiBZgXaxPKGTQPeO/x6esQGKm', 'kent@uf.edu', 'admin'),
(36, 'Lewis', 'Duncan', 'duncan', '$2y$10$PEG4VmJVmToZA2IQ5zk4nee9X.IEbHipEqfH5ma6P8FS/5bedU5.K', 'duncan@rollins.edu', 'admin'),
(43, 'Andrew', 'Torrez', 'atorrez', '$2y$10$J40/LBVFtUwQRwtrA51fFeyecsCYRB5j9UsiTw6e6x3VDDN4lWq56', 'atorrez@knights.ucf.edu', 'leader'),
(44, 'Jen', 'Miller', 'jmiller', '$2y$10$watMyzlzC7IWgXXJxCA4uOkzew7eCJDtwvwitIS3vzBWXQkX4Rkc6', 'jen@knights.ucf.edu', 'leader'),
(45, 'Bob', 'The Builder', 'bbob', '$2y$10$Hx6Agwz2rfYq41kXtosEnuYJyjW6xKWRTAmCvv63GJuUTEbluxsdm', 'bob@knights.ucf.edu', 'leader'),
(46, 'Eric', 'Bob', 'ebob', '$2y$10$em74.R7H9aB0lUdFsRnuNe/8hYYRbu4g7kZHZlCLfHnOxEdJCysPu', 'eric@knights.ucf.edu', 'student'),
(47, 'John', 'Doe', 'jdoe', '$2y$10$r8u1zb0n1RFr3PM3xLAtWO35v5vUJ9OBYxo60qCHQwCeHocwhauAO', 'john@knights.ucf.edu', 'student'),
(48, 'Jane', 'Doe', 'janed', '$2y$10$VA.k0CWuopCz3fPG8rwasucqeAGNOf/nfLackb/RVn5Xrr50x8tHO', 'jane@knights.ucf.edu', 'student'),
(49, 'Sherlok', 'Holmes', 'sherlok', '$2y$10$f5fNdX4nh4.ZK4I4fHd9/.ee9zbae1SR8n4gc2lP/eHMrd27Al6eq', 'sherlok@student.ufl.edu', 'student'),
(50, 'Ryan', 'Vaflours', 'ryan', '$2y$10$4BJ2WBzOO/b.M773lp8zAexu7YkDbKrr9SV7deIr2YW9fW3wH8Jje', 'ryan@fakeschool.edu', 'admin'),
(51, 'Jerk', 'Face', 'jerk', '$2y$10$eDvrJJqEQ8Glc0JMH9IP2Ogk/fIRiFGOo8mO6hCtfl0VNw9mvZxk6', 'jerk@jerkschool.edu', 'admin'),
(52, 'Albus', 'Dumbledog', 'albus', '$2y$10$o2kFS0rwAs4wM9KP/9GFMepupdCTMYoJJybqmoXbZCRekbAD/uqVG', 'albus@dog.edu', 'admin'),
(53, 'John', 'Deer', 'jdeer', '$2y$10$qdGa2LL0PU5g.8njJqizwOdU9Z0Csai5er62NbBBs6PYmH7qEounm', 'deer@knights.ucf.edu', 'student'),
(54, 'Fred', 'Dead', 'dfred', '$2y$10$v8taPCm2nmyQ.qf0sKJJ3usjIpWPXFz.EqOzn.IyjgwS5qxzuyjYO', 'dfred@knights.ucf.edu', 'student'),
(55, 'Bill', 'Compton', 'bcompton', '$2y$10$BwhSsd7FATyvjxdTqbrZM.IIP91EA8.HVeMph5cia02Is.P9z4vfC', 'bill@student.usf.edu', 'student'),
(56, 'Chris', 'Farley', 'chrisf', '$2y$10$MpUqo2hJdICXDtlRzqXlZ.Omx0WMFm5Fs6ONBqUuB5wOga8L7PG0C', 'chrisf@cows.edu', 'admin'),
(57, 'Andrew', 'Torrez', 'atorrez2', '$2y$10$IlVjRY5ADqk4BrqQVIv7JuxianEeyAjPv324E.ySUSY0r/zPrSSNq', 'atorrez2@knights.ucf.edu', 'student'),
(58, 'Andrew', 'Torrez', 'atorrez3', '$2y$10$VHpstHNcx5PcjWzqExL3PuEh391Ojm7sb.27lEWOdrnS9cMkcDpru', 'atorrez3@knights.ucf.edu', 'student'),
(59, 'Master', 'Chef', 'chef', '$2y$10$/yAqr/E1abvduDSmiVdTSeV3ahraNXvV4zalBDoae9.Di4FZaVUta', 'masterchef@gmail.com', 'admin'),
(60, 'Andrew', 'Torrez', 'atorrez4', '$2y$10$jZyVQPycRxH7jNabZl8pJuwfOhjQebgfwfnaER8LEzn090jiEIpZW', 'atorrez@student.rollins.edu', 'student'),
(61, 'Andrew', 'Torrez', 'atorrez5', '$2y$10$R4CNdqM4VN7u5rsSva1Dv.P8.KapjHI7Xr03pQmNS6iDoK5KphgV6', 'atorrez@fullsail.edu', 'student'),
(62, 'Andrew', 'Torrez', 'atorrez6', '$2y$10$.XEm1XXoEIhJEeo2CZOJv.D3QruCK0sJKhfqwELI61SIfNPxMwJ3e', 'atorrez6@knights.ucf.edu', 'student'),
(63, 'andrew', 'torrez', 'atorrez7', '$2y$10$/rnazD0A6pZUDFFDXilgKOpTpQcmX2iaREkuMFNy5QScBwLHJWSkS', 'atorrez7@knights.ucf.edu', 'student'),
(64, 'Full', 'Sail', 'fsail1', '$2y$10$EMYHc99pXpctcgfjKfHJHOrrqgmSRa7KuWEwK8AZsznKXzmnyH7su', 'fsail1@fullsail.edu', 'leader'),
(65, 'Full', 'Sail', 'fsail2', '$2y$10$BRiNQsjGMzOZLlS5ujxPGuzhD2jU0zVhzM511hJMh9hqUigxaylDO', 'fsail2@fullsail.edu', 'student'),
(66, 'Full', 'Sail', 'fsail3', '$2y$10$GwPFkK2douszu7K0bz5JEuJyk6XGzp/RA5YHgKcYpts5GpRZlXyV.', 'fsail3@fullsail.edu', 'student'),
(67, 'Full', 'Sail', 'fsail4', '$2y$10$o6BdykxKIlZbzxhzT7aLJOCa70hfZWgQlCch6d7PLDOu4fLQVjO6O', 'fsail4@fullsail.edu', 'student'),
(68, 'Full', 'Saill', 'fsail5', '$2y$10$1Rrr.jQbiVNeUhsbE2RMl.YV6.q.MBuHxtM4JMqMZPIIW5hIdI1.W', 'fsail5@fullsail.edu', 'student'),
(69, 'Full', 'Sail', 'fsail6', '$2y$10$2G/a90WRQowaSI/aW0EPQelzSiHF.MK92vAGicblXh3ygqiA/l1MS', 'fsail6@fullsail.edu', 'student'),
(70, 'Some', 'one', 'sone', '$2y$10$dhIOKp6P7RgCiD5cfHoz3u7xI9J1tBEZ5m4IBr4eKJrrqx8SGQaeW', 'someone@student.usf.edu', 'student'),
(71, 'Andrew', 'Torrez', 'atorrez9', '$2y$10$twrvni8hK5FSjme1M1wdxuHjDXRrw62EoSg7e21hTHdUJWvXIewAi', 'atorrez9@knights.ucf.edu', 'student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`userid`,`eventid`), ADD KEY `lolz2` (`eventid`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`), ADD KEY `rsoid` (`rsoid`), ADD KEY `fk_event_university_map1` (`universityid`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rsos`
--
ALTER TABLE `rsos`
  ADD PRIMARY KEY (`id`), ADD KEY `universityid` (`universityid`), ADD KEY `fk_rosos_users_map2` (`leaderid`);

--
-- Indexes for table `rso_users`
--
ALTER TABLE `rso_users`
  ADD PRIMARY KEY (`rsoid`,`userid`), ADD KEY `userid` (`userid`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`), ADD KEY `userid` (`userid`);

--
-- Indexes for table `universities`
--
ALTER TABLE `universities`
  ADD PRIMARY KEY (`id`), ADD KEY `userid` (`userid`);

--
-- Indexes for table `university_users`
--
ALTER TABLE `university_users`
  ADD PRIMARY KEY (`universityid`,`userid`), ADD KEY `userid` (`userid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `rsos`
--
ALTER TABLE `rsos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=457;
--
-- AUTO_INCREMENT for table `universities`
--
ALTER TABLE `universities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=72;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
ADD CONSTRAINT `lolz` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `lolz2` FOREIGN KEY (`eventid`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`rsoid`) REFERENCES `rsos` (`id`),
ADD CONSTRAINT `fk_event_university_map1` FOREIGN KEY (`universityid`) REFERENCES `universities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rsos`
--
ALTER TABLE `rsos`
ADD CONSTRAINT `fk_rosos_users_map2` FOREIGN KEY (`leaderid`) REFERENCES `users` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `rsos_ibfk_1` FOREIGN KEY (`universityid`) REFERENCES `universities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rso_users`
--
ALTER TABLE `rso_users`
ADD CONSTRAINT `rso_users_ibfk_1` FOREIGN KEY (`rsoid`) REFERENCES `rsos` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `rso_users_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `universities`
--
ALTER TABLE `universities`
ADD CONSTRAINT `universities_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `university_users`
--
ALTER TABLE `university_users`
ADD CONSTRAINT `university_users_ibfk_1` FOREIGN KEY (`universityid`) REFERENCES `universities` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `university_users_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
