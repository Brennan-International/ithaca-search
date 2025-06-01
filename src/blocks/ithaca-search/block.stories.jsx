import IsolatedBlockEditor from '@automattic/isolated-block-editor';


import './index';

export default {
  title: 'Blocks/Ithaca Search',
  component: Edit,
  args: {
    attributes: { title: 'Hero headline', mediaId: 0 },
  },
};

const Template = (args) => (
  <IsolatedBlockEditor
    blocks={[
      { name: "ithaca-search/ithaca-search", attributes: { indexToSearch: "wp_post"} }
    ]}
  />
);

export const Default = Template.bind({});