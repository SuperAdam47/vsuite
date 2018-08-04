import VueTypes from 'vue-types';

export default {
  name: 'SafeAnchor',

  props: {
    href: VueTypes.string,
    disabled: VueTypes.bool.def(false),
    role: VueTypes.string,
    tabIndex: VueTypes.oneOfType([VueTypes.number, VueTypes.string]),
    componentClass: VueTypes.string.def('a'),
  },

  render() {
    const Component = this.componentClass;
    const anchorData = {
      attrs: {
        role: this.role,
        tabIndex: this.tabIndex,
        href: this.href,
        ...this.$attrs,
      },
      on: {
        ...this.$listeners,
        click: this._handleClick,
      },
    };

    if (this.disabled) {
      anchorData.attrs.tabIndex = -1;
    }

    return <Component {...anchorData}>{this.$slots.default}</Component>;
  },

  methods: {
    _handleClick(event) {
      if (this.disabled || !this.href || this.href.trim() === '#') {
        event.preventDefault();
      }

      if (this.disabled) {
        return event.stopPropagation();
      }

      this.$emit('click', event);
    },
  },
};
