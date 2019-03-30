import Vue from 'vue';
import _ from 'lodash';
import Loader from 'components/Loader';
import Icon from 'components/Icon';
import renderX from 'utils/render';
import prefix, { defaultClassPrefix } from 'utils/prefix';
import { STATUS_ICON_NAMES } from 'utils/constant';

import Notification from './Notification.jsx';

const CLASS_PREFIX = defaultClassPrefix('notification');
const PLACEMENT_TYPES = {
  TOP_LEFT: 'topLeft',
  TOP_RIGHT: 'topRight',
  BOTTOM_LEFT: 'bottomLeft',
  BOTTOM_RIGHT: 'bottomRight',
};
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

let notificationStore = {};
let DEFAULT_DURATION = 4500;
let DEFAULT_TOP = 24;
let DEFAULT_BOTTOM = 24;
let DEFAULT_PLACEMENT = PLACEMENT_TYPES.TOP_RIGHT;
let DEFAULT_REMOVE_ON_EMPTY = true;

function addPrefix(cls) {
  return prefix(CLASS_PREFIX, cls);
}

function formatStyleVal(val) {
  if (typeof val === 'number') return `${val}px`;

  return val;
}

function getPlacementStyle(config) {
  let style = {};
  let className = '';
  const placement = _.camelCase(config.placement || DEFAULT_PLACEMENT);
  const top = config.top || DEFAULT_TOP;
  const bottom = config.bottom || DEFAULT_BOTTOM;

  if (placement === PLACEMENT_TYPES.TOP_LEFT) {
    style = {
      top: formatStyleVal(top),
      left: '24px',
    };
    className = addPrefix('top-left');
  } else if (placement === PLACEMENT_TYPES.TOP_RIGHT) {
    style = {
      top: formatStyleVal(top),
      right: '24px',
    };
    className = addPrefix('top-right');
  } else if (placement === PLACEMENT_TYPES.BOTTOM_LEFT) {
    style = {
      bottom: formatStyleVal(bottom),
      left: '24px',
    };
    className = addPrefix('bottom-left');
  } else if (placement === PLACEMENT_TYPES.BOTTOM_RIGHT) {
    style = {
      bottom: formatStyleVal(bottom),
      right: '24px',
    };
    className = addPrefix('bottom-right');
  } else {
    style = {
      top: formatStyleVal(top),
      left: '24px',
    };
  }

  return { style, className };
}

// title description duration onClose option
// title description duration onClose
// title description duration option
// title description onClose option
// description duration onClose option
// title description duration
// title description onClose
// title description option
// description duration option
// description onClose option
// title description
// description duration
// description onClose
// description option
// description
function getOptions(title, description, duration, onClose, option) {
  let options = option || {};

  if (_.isPlainObject(onClose)) {
    options = onClose;
    onClose = undefined;
  }

  if (_.isPlainObject(duration)) {
    options = duration;
    duration = undefined;
    onClose = undefined;
  }

  if (_.isPlainObject(description)) {
    options = description;
    description = undefined;
    duration = undefined;
    onClose = undefined;
  }

  if (_.isPlainObject(title)) {
    options = title;
    title = undefined;
    description = undefined;
    duration = undefined;
    onClose = undefined;
  }

  if (_.isFunction(duration)) {
    onClose = duration;
    duration = undefined;
  }

  if (_.isFunction(description)) {
    onClose = description;
    description = title;
    title = null;
  }

  if (_.isNumber(description)) {
    duration = description;
    description = title;
    title = null;
  }

  if (title !== undefined) options.title = title;
  if (description !== undefined) options.description = description;
  if (duration !== undefined) options.duration = duration;
  if (onClose !== undefined) options.onClose = onClose;

  return options;
}

function decoratorTitle(options, decorator) {
  if (!options.title || !decorator) return options;
  if (_.isArray(options.title)) options.title.unshift(decorator);
  else options.title = [decorator, options.title];

  return options;
}

function createNotificationInstance(config) {
  const placement = _.camelCase(config.placement || DEFAULT_PLACEMENT);

  if (notificationStore[placement]) return notificationStore[placement];

  const wrapper = new Vue({
    render: h => {
      const { style, className } = getPlacementStyle(config);
      const notificationData = {
        class: [addPrefix('notify'), className],
        style,
        props: { classPrefix: CLASS_PREFIX },
        on: {
          empty: () =>
            (DEFAULT_REMOVE_ON_EMPTY &&
              notificationStore[placement] &&
              notificationStore[placement].destroy()) ||
            (notificationStore[placement] = null),
        },
      };

      return <Notification {...notificationData} />;
    },
  });
  const component = wrapper.$mount();

  document.body.appendChild(component.$el);

  const notification = wrapper.$children[0];

  notificationStore[placement] = {
    component: notification,
    notice(data) {
      notification.add(data || {});
    },
    remove(key) {
      notification.remove(key);
    },
    destroy() {
      document.body.removeChild(component.$el);
    },
  };

  return notificationStore[placement];
}

function notice(config) {
  config = config || {};

  let instance = createNotificationInstance(config);
  let key = null;

  const content = function(h) {
    let title = renderX(h, config.title);
    let description = renderX(h, config.description);

    return (
      <div class={addPrefix('content')}>
        <div class={addPrefix('title')}>{title}</div>
        <div class={addPrefix('description')}>{description}</div>
      </div>
    );
  };

  key = instance.notice(
    _.merge({ duration: DEFAULT_DURATION }, { content, ...config })
  );

  return { remove: () => instance.remove(key) };
}

export default {
  open(...args) {
    return notice(getOptions(...args));
  },

  loading(...args) {
    return notice(
      decoratorTitle(getOptions(...args), h => (
        <Loader size="xs" style={{ position: 'absolute', left: '20px' }} />
      ))
    );
  },

  success(...args) {
    const options = getOptions(...args);

    options.type = NOTIFICATION_TYPES.SUCCESS;

    return notice(
      decoratorTitle(options, h => (
        <Icon icon={STATUS_ICON_NAMES[options.type]} />
      ))
    );
  },

  info(...args) {
    const options = getOptions(...args);

    options.type = NOTIFICATION_TYPES.INFO;

    return notice(
      decoratorTitle(options, h => (
        <Icon icon={STATUS_ICON_NAMES[options.type]} />
      ))
    );
  },

  warning(...args) {
    const options = getOptions(...args);

    options.type = NOTIFICATION_TYPES.WARNING;

    return notice(
      decoratorTitle(options, h => (
        <Icon icon={STATUS_ICON_NAMES[options.type]} />
      ))
    );
  },

  warn(...args) {
    const options = getOptions(...args);

    options.type = NOTIFICATION_TYPES.WARNING;

    return notice(
      decoratorTitle(options, h => (
        <Icon icon={STATUS_ICON_NAMES[options.type]} />
      ))
    );
  },

  error(...args) {
    const options = getOptions(...args);

    options.type = NOTIFICATION_TYPES.ERROR;

    return notice(
      decoratorTitle(options, h => (
        <Icon icon={STATUS_ICON_NAMES[options.type]} />
      ))
    );
  },

  remove(key, placement) {
    if (placement) {
      placement = _.camelCase(placement || '');
    }

    if (notificationStore[placement]) {
      notificationStore[placement].remove(key);

      return;
    }

    Object.keys(notificationStore).map(placement => {
      notificationStore[placement] && notificationStore[placement].remove(key);
    });
  },

  config(options, remove = true) {
    remove &&
      Object.keys(notificationStore).map(placement => {
        notificationStore[placement] && notificationStore[placement].destroy();
        notificationStore[placement] = null;
      });

    if (options.top !== undefined) {
      DEFAULT_TOP = options.top;
    }

    if (options.bottom !== undefined) {
      DEFAULT_BOTTOM = options.bottom;
    }

    if (options.placement !== undefined) {
      DEFAULT_PLACEMENT = options.placement;
    }

    if (options.duration !== undefined) {
      DEFAULT_DURATION = options.duration;
    }

    if (options.removeOnEmpty !== undefined) {
      DEFAULT_REMOVE_ON_EMPTY = options.removeOnEmpty;
    }
  },

  destroy(placement) {
    if (placement && notificationStore[placement]) {
      notificationStore[placement].destroy();
      notificationStore[placement] = null;

      return;
    }

    Object.keys(notificationStore).map(placement => {
      notificationStore[placement] && notificationStore[placement].destroy();
      notificationStore[placement] = null;
    });
  },
};
