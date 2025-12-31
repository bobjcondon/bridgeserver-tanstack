# BridgeServer Functional Specification

Bridgeserver is a fullstack application which serves as a web hub for
a duplicate bridge club.

## Users

Users are people who use the bridge club.   Some users may be authenticated and have permissions to perform actions on the bridge club.
Non-authenticated users can still view many of the website pages.

A user must have a unique email address (used to authenticate the user).   User may have other properties (first name, last name, display name(nickname), phone number, address, etc).   A user can chose to make their personal information visible to other users.

The 3 levels of permissions are:

- User
- Tournament Director
- Admin

## Locations

Locations are places where tournaments are held. They have a name, address, and other details.

## Tournaments

Tournaments are events where bridge players compete against each other.   A tournament is played on a specific date and time and in a specific location.

Once a tournment has been played, it will have the results stored in the database.   Players will be able to view the results.

Before a tournament is played, users can register for the tournament.
Players can register as part of a 2-user team (a partnership), as an individual needing a partner, or as an individual joining a partnership.

The dashboard page will show a list of the most recent tournaments and a separate list of the next upcomming tournaments.

The dashboard page will also a list of recent blog posts.
The navbar will have a signin/signup/signout button, links to the most recent tournaments, and the next upcomming tournaments.
