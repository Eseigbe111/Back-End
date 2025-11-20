// Run this command "mongosh --file .\copy_db5.js" to copy all of natours-test4 to natours-test5. U do that b4 running mongosh.exe
// So for this lecture, we will work with this file "natours-test5"

//Let's now create a remote database hosted on the MOngoDB Atlas. Watch this also.
// So for devpg our project we will actually not use a local database on our computer, like we've been doing in the section until
// this pt. So instead, we're gonna use a remote database hosted on a service called Atlas, which is actually owned by the same
// company that involves MongoDB.

// So we will download MongoDB Atlas. So jonas downloaded Atlas as at when he did the this video. But ChatGpt said that i won't
// need to download Atlas bcos it is in the "MongoDB Compass" i downloaded, but would need to create a Atlas acc and start
// using it for "hosted connectn".

// After logging in,
//1) we create a new project.
//2) Build a cluster. A cluster is basically like an instance of our database and configure it. I am simply using the default setting,
//bcos that's gonna allow me to create a free cluster.  U'll click on advanced setting, located at the ending of the page and click on
// free and then leave everything a default and then click on create cluster located at the end of the page. This will then create it
// for u.

// So Atlas is a so-called database as a service provider which takes all the pain of managing and scaling databases away from us.
// So that already is a huge advantage for usbut it's also extremely useful to always have our data basically in the Cloud, bcos
// this way we can devp our appplication from everywhere and even, more importantly, we don't have to export data from the local
// database and then upload it to a hosted database, once we are ready to deploy our application. So instead we simply use this
// hosted database right from the beginning, instead of even messing with local databases in the first place.

// Now, of course, if u're one of the students who doesn't have access to the internet, then u just have to keep using the local
// database just as we learned until this lecture. So that's not prob at all, i will of course teach u how to connect our application
// later, with both a database hosted on Atlas and also a local database.

// We will continue this in the next video.
