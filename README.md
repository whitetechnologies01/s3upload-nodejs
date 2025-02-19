Step 1: Launch and Set Up EC2 Instance

Step 2: Install Node.js and Dependencies
1. Update System Packages
      sudo apt update && sudo apt upgrade -y
2. Install Node.js and npm
      curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
      sudo apt install -y nodejs
Check if Node.js and npm are installed:

node -v
npm -v

3. Install PM2 (Process Manager for Node.js)

sudo npm install -g pm2
=============================================================================================================================================
Step 3: Create the Node.js Application
Run the following commands to set up the project:

1. Create a Project Directory

mkdir s3-file-upload && cd s3-file-upload

2. Initialize a Node.js Project
npm init -y
3. Install Required Dependencies

npm install express multer aws-sdk dotenv cors

Step 4: Create the Node.js Application Code

touch .env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name

2. Create server.js

Step 5: Run the Application

node server.js
Step 6: Keep the Server Running with PM2

pm2 start server.js --name s3-upload-app


Set up PM2 to start on reboot:

pm2 startup
pm2 save

Step 1: Create index.html

Inside your s3-file-upload directory, create a public folder and place index.html inside it.

mkdir public
nano public/index.html

Step 3: Restart the Application

pm2 restart s3-upload-app
Step 4: Open the Web App

http://your-ec2-public-ip:3000

Try uploading a file, and it should successfully be stored in AWS S3.

Bonus: Use Nginx to Serve the Web App on Port 80

If you want to access the app without specifying port 3000, set up Nginx as a reverse proxy.

Install Nginx:

sudo apt install nginx -y


Configure Nginx:

sudo nano /etc/nginx/sites-available/default

Replace the content with:

sudo systemctl restart nginx

Now, you can access your app at:

http://your-ec2-public-ip
Final Notes
✅ Node.js app serves an HTML page for file upload.
✅ Users can upload files directly from the web interface.
✅ Uploaded files are sent to S3 and displayed in the console.
✅ Can use Nginx to serve the app on port 80.
**************************************************************
node -v
v18.20.6
root@ip-172-31-45-105:~/s3-file-upload# npm -v
10.8.2                                                            
******************************************************************
