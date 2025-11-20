// We stii be working with copy_db5.js

/// USE CHATGPT ASSIST FOR THIS PART
///As the final step in this section, let's now connect our remote hosted database with our Compass app and also with the Mongo shell.
// watch the video for this:
// Save ur password in the "config.env" file we created in the last lecture. This is my username: temple, password : "quTB1XELrZAxcSnu".
// They will be saved in the file this way USERNAME: temple, DATABASE_PASSWORD: quTB1XELrZAxcSnu, IP Address: 102.89.68.210/32

// After u create a cluster, click on connect => compass => I have MongoDB Compass installed => Copy the connection string "mongodb+srv://temple:<db_password>@cluster0.3wmyz3z.mongodb.net/"
// and input the password like this : "mongodb+srv://temple:quTB1XELrZAxcSnu@cluster0.3wmyz3z.mongodb.net/" . Paste this string  in
// the URI in the  MongoDB compass and click on "save & connect"

// After everything is set, u can then watch everything jonas is doing and do them also.

// Now afetr we can see our database in our cluster0, one more thing to do is to allow access from everywhere to this cluster. So remember
// how right in the beginning of this video we whitelisted our IPon order to grant access tour current computer to this cluster. But if u
// happen to switch computers during devpt, u might need to whitelist the IP of that computer as well, bcos otherwise umight not be
// able to connect. But since we are not really dealing with sensitive data here anyway, we can simply whitelist every single IP in the
// world and allow access from everywhere. Now ofcourse we will always still need our username and our password, but this way we don't need
// to keep adding our computers to whitelist. We will simple whitelist all the IPs that exist.

// So to do that, we just go to the sidebar under SECURITY go to "Network Access"=> ADD IP ADDRESS => ALLOW ACCESS FROM ANYWHERE
//Just as a last step, let's also connect our Mongo Shell i.e mongod.exe to this cluster. So we will do the below:
/* 
1) Go to Clusters => cluster0 => connect => shell=> I have the MongoDB Shell installed => copy the string "mongosh "mongodb+srv://cluster0.3wmyz3z.mongodb.net/" --apiVersion 1 --username temple"
=> click enter=> input the password "quTB1XELrZAxcSnu" and click enter. It then loads. We can then access the files with all what jonas tauhgt in the previous lessons.

*/
// So now everything is interconnected. We have the mongo shell, and we have also the Compass both connected tour remote database hosted on Atlas.
