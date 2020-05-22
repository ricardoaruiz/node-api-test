import Application from './commons/application'
import environment from './commons/environment';

import HelloRoute from './hello/hello.route';

const routes = [
    new HelloRoute()
]

const app = new Application(routes);

app.init()
    .then((application: Application) => {
        console.log('Server is listening on: ', 
        (application.server && application.server.address()));
        console.log(`Running in ${environment.name}`)
    })
    .catch(error => {
        console.log('Server failed to start');
        console.log(error);
        process.exit(1);
    })