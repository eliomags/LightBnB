# Lighthouse LightBnB


## Installation

### Clone the repository:

```
git clone git@github.com:eliomags/LightBnB.git
``` 

### Install the required packages:

1. cd into LightBnB_WebApp-master `
```
cd LightBnB_WebApp-master
```
2. Insta required package 
```
npm i
```
3. Ensure you are using Nove version 14 
```
nvm use 14
```
4. You may need to run 
```
npm install -g npm
```

### Database Setup

#### Install a database management system PostgreSQL.

The command to install PostgreSQL will depend on your operating system. Here are some common commands for popular operating systems:

1. Linux Ubuntu / Debian

```
sudo apt-get install postgresql
```

2. CentOS / Red Hat

```
sudo yum install postgresql-server
```

3. macOS

```
brew install postgresql
```

4. Windows

You can download the PostgreSQL installer for Windows from the official website: https://www.postgresql.org/download/windows/

Once the installer is downloaded, run it and follow the on-screen instructions to install PostgreSQL.

After you have installed PostgreSQL, you should be able to start using it by connecting to it with the psql command. For example, you can start a PostgreSQL session by running:

```
psql -U postgres
```
This will start a PostgreSQL session as the `postgres` user, which is the default superuser for PostgreSQL.

#### Create a new database and make note of the database name, username, and password.
#### In the project root directory, create a new file called .env and add the following configuration:
```
DB_NAME=your_database_name
DB_USER=your_database_username
DB_PASS=your_database_password
```
### Run the database migrations:

```
npm run db:migrate
```

### Usage

To start the application, run:

```
npm run local
```

The application will be available at http://localhost:3000.

### Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature: ```git checkout -b feature-name```
3. Make your changes and commit them: ```git commit -m 'Add some feature'```
4. Push to the branch: ```git push origin feature-name```
5. Create a new pull request

### License

This project is licensed under the MIT License. See the LICENSE file for more information.