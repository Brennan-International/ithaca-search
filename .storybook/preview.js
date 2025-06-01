import { I18nProvider } from '@wordpress/react-i18n';

import '@wordpress/block-library/build-style/style.css';
import '@wordpress/block-library/build-style/editor.css';   // still present
import '@wordpress/block-library/build-style/theme.css';

// Make WP globals (wp.element, etc.) available to your stories.
global.wp = window.wp || {};

export const decorators = [
  (Story) => (
    <I18nProvider locale="en_US">
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    </I18nProvider>
  ),
];

export const parameters = {
  controls: { expanded: true },
  a11y: { context: 'body' },
};
