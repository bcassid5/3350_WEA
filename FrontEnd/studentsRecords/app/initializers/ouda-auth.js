export function initialize( application ) {
  application.inject('route', 'oudaAuth', 'service:ouda-auth');
  application.inject('controller', 'oudaAuth', 'service:ouda-auth');
  application.inject('component', 'oudaAuth', 'service:ouda-auth');
  application.inject('component', 'myexport', 'service:myexport');

}

export default {
  name: 'ouda-auth',

  initialize
};
