import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('perform-adjud', 'Integration | Component | perform adjud', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{perform-adjud}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#perform-adjud}}
      template block text
    {{/perform-adjud}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
