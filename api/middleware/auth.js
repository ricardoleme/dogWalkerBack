import jwt from 'jsonwebtoken'
/* 
Maiores informações sobre Tokens JWT: https://medium.com/tableless/entendendo-tokens-jwt-json-web-token-413c6d1397f6
Para decodificar online um Token: https://jwt.io/
*/

export default async function auth(req, res, next) {
  const token = req.header('access-token') || req.headers['x-access-token']
  if (!token) return res.status(401).json({ mensagem: "É obrigatório o envio do token!" });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    /* O retorno decoded irá conter:
    usuario (payload do usuário);
    exp (expiration) = Timestamp de quando o token irá expirar;
    iat (issued at) = Timestamp de quando o token foi criado;
    */
    req.usuario = await decoded.usuario
    next()
  } catch (e) {
    console.error(e.message)
    res.status(403).send({ error: `Token inválido: ${e.message}` });
  }
}