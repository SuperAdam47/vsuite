import { mount } from '@vue/test-utils';
import Button from 'components/Button';

describe('Button component', () => {
  it('renders correctly', () => {
    const wrapper = mount({
      render() {
        return <Button>Default</Button>;
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders correctly when no content', () => {
    const wrapper = mount({
      render() {
        return <Button />;
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
