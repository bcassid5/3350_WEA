import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('adding-courses', 'Integration | Component | adding courses', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{adding-courses}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#adding-courses}}
      template block text
    {{/adding-courses}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
