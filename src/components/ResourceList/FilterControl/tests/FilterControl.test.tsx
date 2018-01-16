import * as React from 'react';
import {mount} from 'enzyme';
import {noop} from '@shopify/javascript-utilities/other';
import {trigger} from '../../../../../tests/utilities';

import FilterControl, {Props} from '../';
import FilterCreator from '../FilterCreator';
import {Filter, FilterType} from '../types';
import {TextField, Tag, Button} from '../../../';

describe('<FilterControl />', () => {
  const mockDefaultProps: Props = {
    resourceName: {
      singular: 'Item',
      plural: 'Items',
    },
    onSearchChange: noop,
  };

  const mockFilters: Filter[] = [
    {
      key: 'filterKey1',
      label: 'Product type',
      operatorText: 'is',
      type: FilterType.Select,
      options: [
        'Bundle',
        {
          value: 'electronic_value',
          label: 'Electronic',
          disabled: true,
        },
        {
          value: 'beauty_value',
          label: 'Beauty',
        },
      ],
    },
    {
      key: 'filterKey2',
      label: 'Tagged with',
      type: FilterType.TextField,
    },
  ];

  const mockAppliedFilters = [
    {
      key: 'filterKey1',
      value: 'Bundle',
    },
    {
      key: 'filterKey1',
      value: 'beauty_value',
    },
  ];

  describe('searchValue', () => {
    it('renders with TextField by default', () => {
      const wrapper = mount(
        <FilterControl {...mockDefaultProps} />,
      );

      const searchField = wrapper.find(TextField);
      expect(searchField.exists()).toBe(true);
    });

    it('renders with searchValue as its value', () => {
      const searchValue = 'search value';
      const wrapper = mount(
        <FilterControl
          {...mockDefaultProps}
          searchValue={searchValue}
        />,
      );

      const searchField = wrapper.find(TextField);
      expect(searchField.prop('value')).toBe(searchValue);
    });
  });

  describe('onSearchChange()', () => {
    it('calls onSearchChange with the new searchValue when onChange is triggered', () => {
      const newSearchValue = 'new search value';
      const onSearchChange = jest.fn();
      const wrapper = mount(
        <FilterControl
          {...mockDefaultProps}
          onSearchChange={onSearchChange}
        />,
      );

      trigger(wrapper.find(TextField), 'onChange', newSearchValue);

      expect(onSearchChange).toBeCalledWith(newSearchValue);
    });
  });

  describe('filters', () => {
    it('renders no <FilterCreator /> if there are no filters', () => {
      const wrapper = mount(
        <FilterControl {...mockDefaultProps} />,
      );

      const searchField = wrapper.find(TextField);
      expect(searchField.prop('connectedLeft')).toBeNull();
    });

    it('renders <FilterCreator /> if there is filters', () => {
      const wrapper = mount(
        <FilterControl
          {...mockDefaultProps}
          filters={mockFilters}
        />,
      );

      expect(wrapper.find(FilterCreator).exists()).toBe(true);
    });

    it('renders <FilterCreator /> with filters', () => {
      const wrapper = mount(
        <FilterControl
          {...mockDefaultProps}
          filters={mockFilters}
        />,
      );

      expect(wrapper.find(FilterCreator).prop('filters'))
        .toMatchObject(mockFilters);
    });
  });

  describe('onFiltersChange()', () => {
    it('gets call with the new filter when FilterCreator.onAddFilter is triggered', () => {
      const newFilter = {
        key: 'new key',
        value: 'new value',
      };

      const onFiltersChange = jest.fn();
      const wrapper = mount(
        <FilterControl
          {...mockDefaultProps}
          filters={mockFilters}
          appliedFilters={mockAppliedFilters}
          onFiltersChange={onFiltersChange}
        />,
      );

      trigger(wrapper.find(FilterCreator), 'onAddFilter', newFilter);

      expect(onFiltersChange)
        .toBeCalledWith([
          ...mockAppliedFilters,
          newFilter,
        ]);
    });

    it('does not get call if the new filter already exist when FilterCreator.onAddFilter is triggered', () => {
      const newFilter = mockAppliedFilters[0];
      const onFiltersChange = jest.fn();
      const wrapper = mount(
        <FilterControl
          {...mockDefaultProps}
          filters={mockFilters}
          appliedFilters={mockAppliedFilters}
          onFiltersChange={onFiltersChange}
        />,
      );

      trigger(wrapper.find(FilterCreator), 'onAddFilter', newFilter);

      expect(onFiltersChange).not.toBeCalled();
    });
  });

  describe('appliedFilters', () => {
    it('renders the same number of Tag as appliedFilters', () => {
      const wrapper = mount(
        <FilterControl
          {...mockDefaultProps}
          appliedFilters={mockAppliedFilters}
        />,
      );

      const tags = wrapper.find(Tag);
      expect(tags).toHaveLength(mockAppliedFilters.length);
    });

    it('calls onFiltersChange without the applied filter when user click remove on the appliedFilter', () => {
      const onFiltersChange = jest.fn();
      const wrapper = mount(
        <FilterControl
          {...mockDefaultProps}
          appliedFilters={mockAppliedFilters}
          onFiltersChange={onFiltersChange}
        />,
      );

      const tags = wrapper.find(Tag);
      trigger(tags.at(0), 'onRemove', mockAppliedFilters[0].key);

      expect(onFiltersChange)
        .toBeCalledWith([
          ...mockAppliedFilters.slice(1, mockAppliedFilters.length),
        ]);
    });
  });

  describe('additionalAction', () => {
    it('renders no connectedRight prop on TextField if there is no additionalAction', () => {
      const wrapper = mount(
        <FilterControl {...mockDefaultProps} />,
      );

      const searchField = wrapper.find(TextField);
      expect(searchField.prop('connectedRight')).toBeNull();
    });

    it('renders Button if there is additionalAction', () => {
      const action = {
        content: 'button label',
        onAction: jest.fn(),
      };
      const wrapper = mount(
        <FilterControl
          {...mockDefaultProps}
          additionalAction={action}
        />,
      );

      expect(wrapper.find(Button).exists()).toBe(true);

      trigger(wrapper.find(Button), 'onClick');
      expect(action.onAction).toBeCalled();
    });
  });
});
