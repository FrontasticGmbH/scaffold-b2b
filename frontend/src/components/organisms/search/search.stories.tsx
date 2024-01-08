import { Meta, StoryFn } from '@storybook/react';
import Search from '.';

export default {
  title: 'Organisms/Search',
  component: Search,
} as Meta<typeof Search>;

const commonProduct = {
  id: '1',
  sku: 'SKU-123',
  name: 'PrecisionStop™ 494 Advanced Brake Pad Set',
};

const productList = Array(6)
  .fill(commonProduct)
  .map((p, index) => {
    return { ...p, id: index.toString(), sku: `SKU-11${index}`, name: `Product ${index}` };
  });

const image = { src: '/brake-disk.png', width: 45, height: 45 };

const productListImage = productList.map((p) => {
  return {
    ...p,
    url: '/',
    image,
  };
});

const Template: StoryFn<typeof Search> = (args) => {
  return (
    <div className="p-3">
      <Search {...args} searchValue={''} />
      {args.filterSearch && (
        <div className="mt-6">
          {productList?.map((result) => (
            <div key={result.sku} className="px-4 py-1">
              {result.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const SmallFilter = Template.bind({});
SmallFilter.args = {
  filterSearch: true,
  variant: 'xs',
  suggestions: productList,
  placeholder: 'Search...',
};

export const SmallInput = Template.bind({});
SmallInput.args = {
  filterSearch: false,
  variant: 'sm',
  searchResult: productList,
  suggestions: productList,
  placeholder: 'Search...',
};

export const largeInput = Template.bind({});
largeInput.args = {
  filterSearch: false,
  variant: 'lg',
  placeholder: 'Search by SKU, product or keyword',
  searchResult: productListImage,
  suggestions: productListImage,
};
