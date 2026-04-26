# Changelog for upcoming version: v2.2

This update provides some new features for the design. It also contains some improvements and I have also fixed some bugs.

## New features

- **Deactivatable services:** I have added the ability to deactivate services, which can be useful for maintenance or other purposes. The admin can activate and deactivate services in the admin panel. If a service is deactivated, it will not be available for users and they will get an error message if they try to use it. They will also get an warning banner on the homepage.
- **New Animations:** I have added some new animations to the frontend, which make the user experience more enjoyable.
- **New Icon:** I have added a new icon for the frontend, which is now also used in the header and the favicon. It is a dark version of the old icon, which fits better to the overall design. I have made it with Icon Composer. The old icon is still used for the admin panel, which has a light design. (Maybe I will change the admin panel design in the future...)
- **New Button:** When you go to your user card (over the user icon in the header) you have a new button "Click me". If you click it, you will get an message... _I am just saying: I have implemented the no-as-a-service code in to my Backend._

## Improvements

- The overview page now shows the note column and is overall better organised.
- Improved error logging
- If you try to delete a loan that has not been returned yet, you will get an 507 error code.
- When the admin deletes a loan, the loan will be still visible in the database, but it will be marked as deleted. This is to prevent data loss and to keep track of deleted loans.

## Fixed bugs

- Fixed bug: #13
- Fixed bug for messaging when server has an error
- Fixed footer height

---

## New version numbers

**Backend:** v2.2

**Frontend:** v2.2

**Admin panel:** v1.4

---

-[Theis](https://portfolio-theis.de)
