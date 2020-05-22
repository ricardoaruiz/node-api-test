import restify, { Request, Response, Next } from 'restify';
import Route from '../commons/route';
import HelloService from './hello.service';

export default class HelloRoute extends Route {

    private static readonly BASE_URL = '/hello';

    apply(server: restify.Server): void {
        this.list(server);
        this.load(server);
        this.create(server);
        this.update(server);
        this.partialUpdate(server);
        this.delete(server);
    }

    private list(server: restify.Server): void {
        server.get(HelloRoute.BASE_URL, (req: Request, res: Response, next: Next) => {
            HelloService.list(req.query)
                .then(hellos => {
                    res.status(200);
                    res.json(hellos);
                    return next();
                })
                .catch(next);
        });
    }

    private load(server: restify.Server): void {
        server.get(`${HelloRoute.BASE_URL}/:id`, (req: Request, res: Response, next: Next) => {
            HelloService.findById(req.params.id)
                .then(hello => {
                    res.status(200);
                    res.json(hello);
                    return next();
                })
                .catch(next);
        });
    }

    private create(server: restify.Server): void {
        server.post(HelloRoute.BASE_URL, (req: Request, res: Response, next: Next) => {
            HelloService.create(req.body)
                .then(hello => {
                    res.status(201);
                    res.json(hello);
                    return next();
                })
                .catch(next);
        });
    }

    private update(server: restify.Server): void {
        server.put(`${HelloRoute.BASE_URL}/:id`, (req: Request, res: Response, next: Next) => {
            HelloService.update(req.params.id, req.body)
                .then(hello => {
                    if(hello) {
                        res.status(200);
                        res.json(hello);
                        return next();
                    } else {
                        res.send(404);
                        return next();
                    }
                })
                .catch(next);
        });
    }

    private partialUpdate(server: restify.Server): void {
        server.patch(`${HelloRoute.BASE_URL}/:id`, (req: Request, res: Response, next: Next) => {
            HelloService.update(req.params.id, req.body, false)
                .then(hello => {
                    if(hello) {
                        res.status(200);
                        res.json(hello);
                        return next();
                    } else {
                        res.send(404);
                        return next();
                    }
                })
                .catch(next);
        });      
    }

    private delete(server: restify.Server): void {
        server.del(`${HelloRoute.BASE_URL}/:id`, (req: Request, res: Response, next: Next) => {
            HelloService.delete(req.params.id)
                .then(hello => {
                    if (hello) {
                        res.status(200);
                        res.json(hello);
                        return next();
                    } else {
                        res.send(404);
                        return next();
                    }
                })
                .catch(next);
        });
    }

}