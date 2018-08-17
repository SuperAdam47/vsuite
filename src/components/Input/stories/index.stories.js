import { storiesOf } from '@storybook/vue';
import Demo from 'stories/demo';
import Input from 'components/Input';
import InputGroup from 'components/InputGroup';
import Icon from 'components/Icon';
import Row from 'components/Row';
import Col from 'components/Col';

const stories = storiesOf('Data Entry|Input', module);

stories.add('default', () => ({
  data() {
    return { value: '' };
  },

  render() {
    return (
      <Demo title="Default">
        <Input
          value={this.value}
          style={{ width: '300px' }}
          placeholder="Default Input"
          onChange={val => (this.value = val)}
        />
      </Demo>
    );
  },
}));

stories.add('size', () => ({
  render() {
    return (
      <Demo title="Size">
        <Row>
          <Col xs={24} sm={12} md={8}>
            <Input
              style={{ marginBottom: '10px' }}
              size="lg"
              placeholder="Large"
            />
            <Input
              style={{ marginBottom: '10px' }}
              size="md"
              placeholder="Medium"
            />
            <Input
              style={{ marginBottom: '10px' }}
              size="sm"
              placeholder="Small"
            />
            <Input
              style={{ marginBottom: '10px' }}
              size="xs"
              placeholder="Xsmall"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <InputGroup style={{ marginBottom: '10px' }} size="lg">
              <Input placeholder="Large" />
              <InputGroup.Addon>
                <Icon icon="search" />
              </InputGroup.Addon>
            </InputGroup>
            <InputGroup style={{ marginBottom: '10px' }} size="md">
              <Input placeholder="Medium" />
              <InputGroup.Addon>
                <Icon icon="search" />
              </InputGroup.Addon>
            </InputGroup>
            <InputGroup style={{ marginBottom: '10px' }} size="sm">
              <Input placeholder="Small" />
              <InputGroup.Addon>
                <Icon icon="search" />
              </InputGroup.Addon>
            </InputGroup>
            <InputGroup style={{ marginBottom: '10px' }} size="xs">
              <Input placeholder="Xsmall" />
              <InputGroup.Addon>
                <Icon icon="search" />
              </InputGroup.Addon>
            </InputGroup>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <InputGroup inside style={{ marginBottom: '10px' }} size="lg">
              <Input placeholder="Large" />
              <InputGroup.Button>
                <Icon icon="search" />
              </InputGroup.Button>
            </InputGroup>
            <InputGroup inside style={{ marginBottom: '10px' }} size="md">
              <Input placeholder="Medium" />
              <InputGroup.Button>
                <Icon icon="search" />
              </InputGroup.Button>
            </InputGroup>
            <InputGroup inside style={{ marginBottom: '10px' }} size="sm">
              <Input placeholder="Small" />
              <InputGroup.Button>
                <Icon icon="search" />
              </InputGroup.Button>
            </InputGroup>
            <InputGroup inside style={{ marginBottom: '10px' }} size="xs">
              <Input placeholder="Xsmall" />
              <InputGroup.Button>
                <Icon icon="search" />
              </InputGroup.Button>
            </InputGroup>
          </Col>
        </Row>
      </Demo>
    );
  },
}));

stories.add('textarea', () => ({
  render() {
    return (
      <Demo title="Textarea">
        <Input
          componentClass="textarea"
          rows={3}
          style={{ width: '300px' }}
          placeholder="Textarea"
        />

        <hr />

        <Input
          componentClass="textarea"
          rows={3}
          style={{ width: '300px', resize: 'auto' }}
          placeholder="resize: 'auto'"
        />
      </Demo>
    );
  },
}));

stories.add('disabled', () => ({
  render() {
    return (
      <Demo title="Disabled">
        <Input style={{ width: '300px', marginBottom: '10px' }} disabled />

        <InputGroup style={{ width: '300px', marginBottom: '10px' }} disabled>
          <Input />
          <InputGroup.Addon>
            <Icon icon="search" />
          </InputGroup.Addon>
        </InputGroup>
      </Demo>
    );
  },
}));

stories.add('control', () => ({
  data() {
    return { value: 'please edit me' };
  },

  render() {
    return (
      <Demo title="Control">
        <Input
          value={this.value}
          style={{ width: '300px' }}
          placeholder="Default Input"
        />
      </Demo>
    );
  },
}));
