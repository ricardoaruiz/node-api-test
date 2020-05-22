import restify from 'restify';
import mongoose from 'mongoose';
import Route from './route';
import globalErrorHandler from './global-error-handler';
import env from './environment';

export default class Application {

    server: restify.Server;

    constructor(private routes: Route[] = []) {
        this.server = this.createServer();
    }

    init(): Promise<Application> {
        return this.connectDatabase()
            .then(() => this.initServer()
                            .then(() => this));
    }

    private initServer(): Promise<restify.Server> {
        return new Promise( (resolve, reject) => {
            try {
                this.setPlugins();
                this.applyRoutes()    
                this.listenErrors();
                this.server.listen(env.server.port, () => {
                    resolve(this.server);
                });
            } catch(e) {
                reject(e);
            }
        })
    } 

    private createServer(): restify.Server {
        return restify.createServer({
            name: 'api-teste',
            version: '1.0.0'
        });
    }

    private connectDatabase(): Promise<typeof mongoose> {        
        const url = this.getDatabaseUrlConnection();
        return mongoose.connect(url, {
            useNewUrlParser: true
        })
    }

    private getDatabaseUrlConnection(): string {
        if(env.database.host === 'localhost') {
            return `mongodb://${env.database.host}/${env.database.namespace}`;
        } else {
            return `mongodb+srv://${env.database.user}:${env.database.pwd}@${env.database.host}/${env.database.namespace}?retryWrites=true&w=majority`;
        }
    }

    private setPlugins(): void {
        this.server.use(restify.plugins.queryParser());
        this.server.use(restify.plugins.bodyParser());
    }

    private applyRoutes(): void {
        this.routes.forEach(route => route.apply(this.server));
    }

    private listenErrors(): void {
        this.server.on('restifyError', globalErrorHandler);
    }

}