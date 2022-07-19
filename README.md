# Whole application description

Current application plays a role of online clipboard. It allows transferring data between different clients.<br/>
It's useful, when regular system clipboard is not available - e.g. working with remote desktop with security 
restrictions. Or, transferring data between PC and mobile device.<br/>
It allows transferring text data and files. Maximum supported file size - 100 kB. The reason of this restriction
is in the limit of max. size for AWS AppSync mutators. This can be solved by splitting files and uploading their
parts separately.<br/>

<strong>Copied data are not stored! They are shared between all clients in the secret room. Secret room is 
defined by the secret word, that is stored in the DynamoDB.<br/>
The longer secret word is, the higher data confidentiality will be.</strong>

Secret words/rooms are cleaned up periodically and can be safely re-used again.

![Clipboard UI](https://github.com/cobalt12345/clipboard-online/blob/9ddb897395b63b24d15468a82da1e96d79239e01/ui.png)

## Application Architecture

Application is written on ReactJs with Amplify framework.
It uses AWS AppSync as a back-end to publish/subscribe data. Client subscriptions are stored in DynamoDB.<br/><br/>
<strong>Data and files are not stored!</strong><br/><br/>
Lambda function implements a fanout for Web Push notifications - user is notified about received data even if he/she 
has closed an application tab.<br/>
Files are encoded to the Base64 and transferred as simple strings.

![Clipboard Design](https://github.com/cobalt12345/clipboard-online/blob/2b7eac68658ffe8cd4570f4fbe929b7ad028104f/clipboard-design.png)

Web Push notifications are supported for the desktop Google Chrome only. Implementation for Apple devices requires
a registered developer account.


## See how it works
<a href="https://clipboard.talochk.in/">Online Clipboard</a>
