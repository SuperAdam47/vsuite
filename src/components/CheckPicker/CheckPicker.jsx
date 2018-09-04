import VueTypes from 'vue-types';
import _ from 'lodash';
import popperMixin from 'mixins/popper';
import onMenuKeydown from 'shares/onMenuKeydown';
import prefix, { defaultClassPrefix } from 'utils/prefix';
import { filterNodes, findNode } from 'utils/tree';
import { splitDataByComponent } from 'utils/split';
import { vueToString } from 'utils/node';
import getDataGroupBy from 'utils/getDataGroupBy';
import shallowEqual from 'utils/shallowEqual';
import invariant from 'utils/invariant';

import {
  PickerMenuWrapper,
  PickerDropdownMenu,
  PickerToggle,
  PickerSearchBar,
  getToggleWrapperClassName,
} from 'components/_picker';

const CLASS_PREFIX = 'picker';

export default {
  name: 'CheckPicker',

  model: {
    prop: 'value',
    event: 'change',
  },

  mixins: [popperMixin],

  props: {
    /* eslint-disable vue/require-prop-types */
    placement: {
      ...popperMixin.props.placement,
      default: 'bottom-start',
    },
    trigger: {
      ...popperMixin.props.trigger,
      default: 'click',
    },
    value: VueTypes.arrayOf(VueTypes.any),
    defaultValue: VueTypes.arrayOf(VueTypes.any).def([]),
    appearance: VueTypes.oneOf(['default', 'subtle']).def('default'),
    data: VueTypes.arrayOf(VueTypes.any).def([]),
    cacheData: VueTypes.arrayOf(VueTypes.any).def([]),
    block: VueTypes.bool.def(false),
    disabled: VueTypes.bool.def(false),
    disabledItemValues: VueTypes.arrayOf(VueTypes.any).def([]),
    maxHeight: VueTypes.number.def(320),
    valueKey: VueTypes.string.def('value'),
    labelKey: VueTypes.string.def('label'),
    groupBy: VueTypes.any,
    placeholder: VueTypes.string,
    searchable: VueTypes.bool,
    cleanable: VueTypes.bool,
    menuClassName: VueTypes.string,
    menuStyle: VueTypes.object,
    renderMenu: Function,
    renderMenuItem: Function,
    renderMenuGroup: Function,
    renderValue: Function,
    classPrefix: VueTypes.string.def(defaultClassPrefix(CLASS_PREFIX)),
    toggleComponentClass: VueTypes.oneOfType([
      VueTypes.string,
      VueTypes.object,
    ]),
    // change, select, search
  },

  data() {
    const initVal =
      (_.isUndefined(this.value) ? this.defaultValue : this.value) || [];

    invariant.not(
      this.groupBy === this.valueKey || this.groupBy === this.labelKey,
      '`groupBy` can not be equal to `valueKey` and `labelKey`'
    );

    return {
      innerVal: initVal,
      focusItemValue: initVal[0],
      searchKeyword: '',
    };
  },

  computed: {
    currentVal() {
      return (_.isUndefined(this.value) ? this.innerVal : this.value) || [];
    },

    dataWithCacheList() {
      return [].concat(this.data || [], this.cacheData || []);
    },

    focusableDataList() {
      let filteredData = filterNodes(this.data, item =>
        this._shouldDisplay(item[this.labelKey])
      );

      if (this.groupBy) {
        filteredData = getDataGroupBy(filteredData, this.groupBy);
      }

      return filteredData;
    },
  },

  render(h) {
    const hasValue = !!(this.currentVal && this.currentVal.length);
    const selectedItems = this.currentVal.map(x =>
      findNode(this.dataWithCacheList, item =>
        shallowEqual(item[this.valueKey], x)
      )
    );
    let selectedLabel = hasValue
      ? this.$t('_.CheckPicker.selectedValues', [selectedItems.length])
      : this.$slots.placeholder || this.placeholder;

    if (this.renderValue && hasValue) {
      selectedLabel = this.renderValue(h, this.currentVal, selectedItems);
    }

    const referenceData = {
      class: getToggleWrapperClassName(
        'check',
        this._addPrefix,
        this,
        hasValue
      ),
      directives: [{ name: 'click-outside', value: this._handleClickOutside }],
      attrs: { tabindex: -1, role: 'menu' },
      on: { keydown: this._handleKeydown },
      ref: 'reference',
    };
    const toggleData = splitDataByComponent({
      splitProps: {
        ...this.$attrs,
        hasValue,
        cleanable: this.cleanable && !this.disabled,
        componentClass: this.toggleComponentClass,
      },
      on: { clean: this._handleClean },
    });
    const popperData = {
      directives: [
        { name: 'show', value: this.currentVisible },
        { name: 'transfer-dom' },
      ],
      attrs: { 'data-transfer': `${this.transfer}` },
      ref: 'popper',
    };

    if (!this.disabled) this._addTriggerListeners(toggleData, referenceData);

    return (
      <div {...referenceData}>
        <PickerToggle {...toggleData}>
          {selectedLabel || this.$t('_.Picker.placeholder')}
        </PickerToggle>
        <transition name="picker-fade">
          {this._renderDropdownMenu(h, popperData)}
        </transition>
      </div>
    );
  },

  methods: {
    _renderDropdownMenu(h, popperData) {
      popperData = _.merge(popperData, {
        class: [this._addPrefix('check-menu'), this.menuClassName],
        style: this.menuStyle,
        on: { keydown: this._handleKeydown },
      });

      const menuData = splitDataByComponent(
        {
          splitProps: {
            data: this.focusableDataList,
            group: !_.isUndefined(this.groupBy),
            checkable: true,
            maxHeight: this.maxHeight,
            valueKey: this.valueKey,
            labelKey: this.labelKey,
            disabledItemValues: this.disabledItemValues,
            activeItemValues: this.currentVal,
            focusItemValue: this.focusItemValue,
            renderMenuGroup: this.renderMenuGroup,
            renderMenuItem: this.renderMenuItem,
            dropdownMenuItemClassPrefix: this._addPrefix('check-menu-item'),
            classPrefix: this._addPrefix('check-menu'),
          },
          on: { select: this._handleSelect },
          ref: 'menu',
        },
        PickerDropdownMenu
      );
      const menu = <PickerDropdownMenu {...menuData} />;

      return (
        <PickerMenuWrapper {...popperData}>
          {this.$slots.header}
          {this.searchable && (
            <PickerSearchBar
              placeholder={this.$t('_.Picker.searchPlaceholder')}
              value={this.searchKeyword}
              onChange={this._handleSearch}
              ref="search"
            />
          )}
          {this.renderMenu ? this.renderMenu(h, menu) : menu}
          {this.$slots.footer}
        </PickerMenuWrapper>
      );
    },

    _shouldDisplay(label, searchKeyword) {
      const word =
        (_.isUndefined(searchKeyword) ? this.searchKeyword : searchKeyword) ||
        '';

      if (!_.trim(word)) return true;

      const keyword = word.toLocaleLowerCase();

      if (_.isString(label) || _.isNumber(label)) {
        return `${label}`.toLocaleLowerCase().indexOf(keyword) >= 0;
      } else if (_.isObject(label)) {
        return (
          vueToString(label)
            .join('')
            .toLocaleLowerCase()
            .indexOf(keyword) >= 0
        );
      }
    },

    _setVal(val, item, event) {
      this.innerVal = val;

      this.$emit('change', val, event);
      this.$emit('select', val, item, event);
    },

    _handleSelect(value, item, event, checked) {
      let newVal = _.cloneDeep(this.currentVal);

      if (checked) {
        // add new item
        newVal.push(value);
      } else {
        // remove old item
        newVal.splice(_.findIndex(newVal, v => shallowEqual(v, value)), 1);
      }

      this.focusItemValue = value;

      this._setVal(newVal, item, event);
    },

    _handleClean(event) {
      if (this.disabled) return;

      this.focusItemValue = null;
      this.searchKeyword = '';

      this._setVal([], null, event);
    },

    _handleSearch(val, event) {
      this.searchKeyword = val;

      this.$emit('search', val, event);
    },

    _handleKeydown(event) {
      event.stopPropagation();

      onMenuKeydown(event, {
        down: this._handleFocusNext,
        up: this._handleFocusPrev,
        enter: this._handleFocusCurrent,
        esc: this._closePopper,
      });
    },

    _walkFocusItem(list, fn, offset = 0) {
      const len = list.length;

      for (let i = offset; i < len; i++) {
        const item = list[i];
        let res;

        if (item.children) {
          const pList = i - 1 < 0 ? [] : list[i - 1].children;
          const nList = i + 1 >= len ? [] : list[i + 1].children;

          res = this._walkFocusItem(
            [].concat(pList, item.children, nList),
            fn,
            pList.length
          );
        } else {
          res = fn && fn(item, i, list) && i;
        }

        if (!_.isNumber(res)) res = -1;
        if (res !== -1) return true;
      }

      return false;
    },

    _handleFocusNext() {
      const focusVal = this.focusItemValue;
      const list = this.focusableDataList;
      let firstItem;
      let nFocusItem;
      let groupItems;

      this._walkFocusItem(list, (x, index, list) => {
        const res = shallowEqual(x[this.valueKey], focusVal);

        if (index === 0 && !firstItem) {
          firstItem = x;
        }

        if (res) {
          groupItems = list;
          nFocusItem = groupItems[index + 1];
        }

        return res;
      });

      if (groupItems && nFocusItem) {
        // find focus item
        this.focusItemValue = nFocusItem[this.valueKey];
      }

      if (!groupItems) {
        this.focusItemValue = firstItem[this.valueKey];
      }

      this.$nextTick(
        () => this.$refs.menu && this.$refs.menu._updateScrollPosition()
      );
    },

    _handleFocusPrev() {
      const focusVal = this.focusItemValue;
      const list = this.focusableDataList;
      let firstItem;
      let nFocusItem;
      let groupItems;

      this._walkFocusItem(list, (x, index, list) => {
        const res = shallowEqual(x[this.valueKey], focusVal);

        if (index === 0 && !firstItem) {
          firstItem = x;
        }

        if (res) {
          groupItems = list;
          nFocusItem = groupItems[index - 1];
        }

        return res;
      });

      if (groupItems && nFocusItem) {
        // find focus item
        this.focusItemValue = nFocusItem[this.valueKey];
      }

      if (!groupItems) {
        this.focusItemValue = firstItem[this.valueKey];
      }

      this.$nextTick(
        () => this.$refs.menu && this.$refs.menu._updateScrollPosition()
      );
    },

    _handleFocusCurrent(event) {
      const focusVal = this.focusItemValue;
      const list = this.focusableDataList;
      let currentItem;

      this._walkFocusItem(list, (x, index, list) => {
        const res = shallowEqual(x[this.valueKey], focusVal);

        if (res) {
          currentItem = x;
        }

        return res;
      });

      if (!currentItem) return;

      this._handleSelect(
        currentItem[this.valueKey],
        currentItem,
        event,
        !this.currentVal.some(x => shallowEqual(x, focusVal))
      );
    },

    _addPrefix(cls) {
      return prefix(this.classPrefix, cls);
    },
  },
};
