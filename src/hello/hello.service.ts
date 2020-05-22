import HelloModel, { HelloDocument } from './hello.model';
import errors from 'restify-errors';

export interface HelloFilter {
    message?: string,
    active?: boolean
}

/**
 * Classe de servico para o recurso Hello
 */
class HelloService {

    /**
     * Retorna uma listagem com todos os recursos Hello que atendem ao filtro
     * @param params Filtro
     * @returns Promise<HelloDocument[]> com a lista de recursos encontrados
     */
    list(params?: HelloFilter): Promise<HelloDocument[]> {       
        return HelloModel.find(this.buildFilter(params), { message: true, active: true })
            .then((docs: any) => 
                docs.map((doc: any) => this.buildHelloDocument(doc)));
    }

    /**
     * Constroi filtro para consulta de documentos em função dos parametros recebidos
     * @param params 
     */
    private buildFilter(params: HelloFilter | undefined): Object {
        const filter: any = {};
        if (params) {
            if (params.message) {
                // https://docs.mongodb.com/manual/reference/operator/query/#query-selectors
                filter.message = { '$regex': params.message, '$options': 'i'}
            }
            if (params.active) {
                filter.active = params.active
            }
        }
        return filter;
    }

    /**
     * Busca um recurso através do seu Id
     * @param id Id do recurso
     * @returns Promise<HelloDocument | null> contendo o recurso encontrado ou nulo caso não encontrado
     */
    findById(id: string): Promise<HelloDocument | null> {
        return HelloModel.findOne({ _id: id })
            .then((doc: any) => this.buildHelloDocument(doc));
    }

    /**
     * Cria um novo recurso Hello
     * @param hello recurso a ser criado
     * @returns Promise<HelloDocument | null> com o recurso criado ou nulo caso não tenha sido criado
     */
    async create(hello: HelloDocument): Promise<HelloDocument | null> {

        const existHello = await HelloModel.findOne({ message: hello.message});
            
        if (existHello) 
            throw new errors.UnprocessableEntityError('Hello Already exists');            

        return HelloModel.create(hello)
            .then((doc: any) => this.buildHelloDocument(doc));
    }

    /**
     * Faz a alteração do recurso Hello
     * @param id Id do recurso a ser alterado
     * @param hello recurso a ser alterado
     * @param overwrite indica se os campos não informados serão sobrescritos (default true).
     * caso seja true e não seja passado um campo, o mesmo será removido do recurso
     * caso seja false e não seja passado um campo, o mesmo não sofrerá alterações
     * @returns Promise<HelloDocument | null> contendo o recurso já com a alteração 
     * ou nulo caso o recurso não tenha sido encontrado
     */
    update(id: string, hello: HelloDocument, overwrite = true): Promise<HelloDocument | null> {
        const options ={ runValidators: true, new: true, overwrite }
        return HelloModel.findByIdAndUpdate(id, hello, options)
            .then((doc: any) => this.buildHelloDocument(doc));
    }

    /**
     * Remove um recurso Hello
     * @param id Id do recurso a ser removido
     * @returns Promise<HelloDocument | null> com o recurso removido ou nulo caso recurso não exista
     */
    delete(id: string): Promise<HelloDocument | null> {
        return HelloModel.findByIdAndDelete(id)
            .then((doc: any) => this.buildHelloDocument(doc));
    }

    /**
     * Monta um documento HelloDocument para ser devolvido para as rotas
     * @param doc HelloDocument
     */
    private buildHelloDocument(doc: any): HelloDocument | null {
        return doc ? {
            _id: doc.id,
            message: doc.message,
            active: doc.active
        }
        : null;
    }

}

export default new HelloService();