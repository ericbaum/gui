import util from '../util';

class LoginManager {
  constructor() {
    this.baseUrl = ""
  }

  authenticate(login) {
    return util.POST(this.baseUrl + '/auth', login);
  }

  setNewPassword(token) {
      return util.POST(this.baseUrl + '/auth/password/resetlink?link=' + token.token, token);
  }
}

let loginManager = new LoginManager();
export default loginManager;
