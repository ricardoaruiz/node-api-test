import { Server } from 'restify';

abstract class Route {

    abstract apply(server: Server): void;

}

export default Route;