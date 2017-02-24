export function increment(params) {
  return params[0]+1;
}
export default Ember.Helper.helper(increment);