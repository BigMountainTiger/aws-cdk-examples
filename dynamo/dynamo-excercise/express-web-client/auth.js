
const axios = require('axios');
const jwktopem = require("jwk-to-pem");
const jwt = require('jsonwebtoken');


// https://www.npmjs.com/package/jsonwebtoken

// const auth = new Auth({
//     certs: certs,
//     scope: scope,
//     issuer: issuer,
//     headers: headers
// });

let certs = null;
let get_certification = async () => {
    if (!certs) {

        const url = 'https://..../jwks';
        const response = await axios.get(url);
        const keys = response.data.keys;

        certs = {};
        for (const key of keys) {
            certs[key.kid] = key
        }
    }

    return certs;
};

class Auth {
    constructor(data) {
        this.data = data;
    }

    get_bearer_token() {
        const headers = this.data.headers;
        const authorization = headers?.authorization;
        const token = authorization.split(' ')[1];
        return token;
    }

    authenticate() {

        const token = this.get_bearer_token();
        const decoded = jwt.decode(token, { complete: true });
        const payload = decoded.payload;

        if (payload.iss != this.data.issuer) {
            throw new Error('Issuerinvalid');
        }

        if (!payload.scope.includes(this.data.scope)) {
            throw new Error('scope invalid');
        }

        const kid = decoded.header.kid
        const cert = this.data.certs[kid]
        const publicKey = jwktopem(cert);
        return jwt.verify(token, publicKey);

    }
}

module.exports = Auth;






