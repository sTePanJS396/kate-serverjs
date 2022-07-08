/*Kate-Server - библиотека для общения с сервером*/
class KateServer {
    
    constructor() {
        this.inRequestState = false;
        this.errorManager = null;
        this.currentDataInServer = {}
    }

    _response(whatRequest = '') {
        switch (whatRequest) {
            case 'GET':
                return {
                    data: this.currentDataInServer,
                    state: this.inRequestState,
                    error: this.errorManager
                }
            case 'POST':
                return {
                    state: this.inRequestState,
                    error: this.errorManager
                }
            case 'DELETE': 
                return {
                    state: this.inRequestState,
                    error: this.errorManager
                }
            default:
                break;
        }
    }

    get(url = '') {
        const _this = this;
        if (url.trim() !== '' && typeof url === 'string') {
            return new Promise(async function(resolve, reject) {
                _this.inRequestState = true;
                const request = await fetch(url, {method: 'GET'});
                if (request.ok) {
                    _this.currentDataInServer = await request.json();
                    _this.inRequestState = false;
                    resolve(_this._response('GET'))
                } else {
                    _this.errorManager = request.status + request.statusText;
                    _this.inRequestState = false;
                    reject(_this.errorManager);
                }
            })
        } else {
            throw new Error('"url" is a required parameter and must be a string');
        }
    }

    post(url = '', options = {dataJSON: {}}) {
        const _this = this;
        if ((url.trim() !== '' && typeof url === 'string') && (typeof options === 'object' && (options.dataJSON !== null || options.dataJSON !== undefined))) {
            return new Promise(async function(resolve, reject) {
                _this.inRequestState = true;
                const request = await fetch(url, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify(options.dataJSON)
                });
                if (request.ok) {
                    _this.inRequestState = false;
                    resolve(_this._response('POST'))
                } else {
                    _this.errorManager = request.status + request.statusText;
                    _this.inRequestState = false;
                    reject(_this.errorManager);
                }
            });
        } else {
            throw new Error('"url" is a required parameter and must be a string; "options" is a required parameter and must be a object')
        }
    }

    delete(url = '') {
        const _this = this;
        if (url.trim() !== '' && typeof url === 'string') {
            return new Promise(async function(resolve, reject) {
                const request = await fetch(url, {method: 'DELETE'});
                if (request.ok) {
                    _this.inRequestState = false;
                    resolve(_this._response('DELETE'))
                } else {
                    _this.errorManager = request.status + request.statusText;
                    _this.inRequestState = false;
                    reject(_this.errorManager);
                }
            });
        } else {
            throw new Error('"url" is a required parameter and must be a string');
        }
    }
}

export default KateServer