export default class response {
    success: boolean;
    status: number;
    errors: string[];
    response: object;
    constructor(status=400, errors=[], response={}, connected=false, success=false, auth={}) {
        this.success = success;
        this.status = status;
        //this.auth = auth;
        this.errors = [];
        this.errors.push(...errors);
        this.response = response;
    }
}