export const environment = {
  production: false,
  starsOptions: {
    star: {
      width: 3
    },
    line: {
      color: 'rgba(157, 188, 225, 1)'
    },
    radius: 250
  },
  circleOptions: {
    radius: 13,
    fillColor: 'black',
    strokeWidth: 10,
    strokeColor: 'white'
  },
  linesWidth: 3,
  dashOptions: [3, 2],
  apiBaseURL: 'http://localhost:5000/',
  storage: {
    token: 'auth_token'
  },
  roomsUpdateInterval: 5000,
  userIdTokenKey: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'

};
