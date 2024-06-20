import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import NodeCache from 'node-cache';

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const authority = `https://login.microsoftonline.com/${tenantId}`;
const jwksUri = `${authority}/discovery/v2.0/keys`;

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

async function fetchJwksKeys() {
  const response = await axios.get(jwksUri);
  const keys = response.data.keys;
  keys.forEach(key => {
    cache.set(key.kid, jwkToPem(key));
  });
  return keys;
}

async function getPublicKey(kid) {
  let publicKey = cache.get(kid);
  if (!publicKey) {
    const keys = await fetchJwksKeys();
    const key = keys.find(k => k.kid === kid && k.use === 'sig' && k.kty === 'RSA');
    if (!key) {
      throw new Error('No suitable signing key found');
    }
    publicKey = jwkToPem(key);
    cache.set(kid, publicKey);
  }
  return publicKey;
}

export async function verifyToken(token) {

  const decodedHeader = jwt.decode(token, { complete: true }).header;
  const publicKey = await getPublicKey(decodedHeader.kid);

  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: `https://sts.windows.net/${tenantId}/`,
      audience: `api://${clientId}`,
    }, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}
