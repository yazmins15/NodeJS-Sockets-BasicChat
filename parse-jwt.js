function parseJwt(token){
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-','+').replace('-','/');
  return JSON.parse(window.atob(base64));
}