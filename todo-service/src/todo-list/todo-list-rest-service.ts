import Restify from 'restify';




export class TodoListRestService {

    private _server: Restify.Server;

    constructor(private _todoLogic: TodoLogic) {
       /* this._server = Restify.createServer();
        this._server.use(Restify.plugins.bodyParser());
        this._server.use(Restify.plugins.queryParser());
*/

        this._server.get('todo/lists', this._getLists.bind(this));
        this._server.post('/phones', this._addPhone.bind(this));
        this._server.put('/phones/:id', this._updatePhone.bind(this));
        this._server.del('/phones/:id', this._deletePhone.bind(this));

    }

}