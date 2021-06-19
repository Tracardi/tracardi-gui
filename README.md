[![header.jpg](https://raw.githubusercontent.com/atompie/tracardi/tracardi-unomi-master/screenshots/github-splash.png)](https://raw.githubusercontent.com/atompie/tracardi/tracardi-unomi-master/screenshots/github-splash.png)

# Tracardi GUI

Node version: 14.17.0

## Download

##```git clone https://github.com/atompie/tracardi-gui.git```

Go to root directory ant build docker image

## Run with docker

Go to root directory ant build docker image

```
 docker build . -t tracardi-gui
```

It may take some time ~ 15min. 

Than run

##```docker-compose up```

Or if you prefer to run it with docker

##```docker run -p 7777:80 -e API_URL=http://127.0.0.1:7676 tracardi-gui```

It open pot 8787 on your localhost and connects to API at localhost: 8686.

## Run locally

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


Go to [https://github.com/atompie/tracardi](https://github.com/atompie/tracardi) for tracardi api. 
