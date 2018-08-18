import { storiesOf } from '@storybook/vue';
import Demo from 'stories/demo';
import JsonView from 'stories/json-view';
import Checkbox from 'components/Checkbox';

const stories = storiesOf('Data Entry|CheckboxGroup', module);

stories.add('default', () => ({
  data() {
    return { value: [] };
  },

  render() {
    return (
      <Demo title="Default">
        <JsonView data={this.value} />

        <Checkbox.Group
          inline
          value={this.value}
          onChange={v => (this.value = v)}
        >
          <Checkbox value="A">Item A</Checkbox>
          <Checkbox value="B">Item B</Checkbox>
          <Checkbox value="C">Item C</Checkbox>
          <Checkbox value="D">Item D</Checkbox>
        </Checkbox.Group>
      </Demo>
    );
  },
}));

stories.add('initial', () => ({
  render() {
    return (
      <Demo title="Initial">
        <Checkbox.Group inline defaultValue={['A']}>
          <Checkbox value="A">Item A</Checkbox>
          <Checkbox value="B">Item B</Checkbox>
          <Checkbox value="C">Item C</Checkbox>
          <Checkbox value="D">Item D</Checkbox>
        </Checkbox.Group>
      </Demo>
    );
  },
}));

stories.add('group', () => ({
  render() {
    return (
      <Demo title="Group">
        <Checkbox.Group>
          <p>Group1</p>
          <Checkbox value="A">Item A</Checkbox>
          <Checkbox value="B">Item B</Checkbox>
          <p>Group2</p>
          <Checkbox value="C">Item C</Checkbox>
          <Checkbox value="D" disabled>
            Item D
          </Checkbox>
        </Checkbox.Group>
      </Demo>
    );
  },
}));

stories.add('inline', () => ({
  render() {
    return (
      <Demo title="Inline">
        <Checkbox.Group inline>
          <Checkbox value="A">Item A</Checkbox>
          <Checkbox value="B">Item B</Checkbox>
          <Checkbox value="C">Item C</Checkbox>
          <Checkbox value="D" disabled>
            Item D
          </Checkbox>
        </Checkbox.Group>
      </Demo>
    );
  },
}));

stories.add('controlled', () => ({
  render() {
    return (
      <Demo title="Controlled">
        <Checkbox.Group value={['A', 'C']} inline>
          <Checkbox value="A">Item A</Checkbox>
          <Checkbox value="B">Item B</Checkbox>
          <Checkbox value="C">Item C</Checkbox>
          <Checkbox value="D" disabled>
            Item D
          </Checkbox>
        </Checkbox.Group>
      </Demo>
    );
  },
}));
