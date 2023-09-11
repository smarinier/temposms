# tempo SMS
Get the EDF Tempo Status, and send it by SMS to your Free account

# Free Notifications
get your id and mobile.free.fr and activate SMS notifications, you'll get your pass at https://mobile.free.fr/account/mes-options/notifications-sms 

# Configuration
Copy free.sample.conf to free.conf
Modify it with your id and pass

# Run 
## see tempo status
./temposms.js -p

## Receive SMS
./temposms.js

# Warning
Tempo Status is updated at 11h each day. So cron should be planned after this time

