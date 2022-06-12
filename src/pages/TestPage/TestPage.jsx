import { HollowButton, Select, Accordeon } from '../../ui-kit/components';
import { Checkbox } from '../../ui-kit/components/Checkbox';

const options = [
  {
    name: 'test1',
    value: 'suka dreina',
  },
  {
    name: 'test2',
    value: 'suka nedreina',
  },
  {
    name: 'test3',
    value: 'no sukas',
    Component: () => <div>Zdarova UEBISHE</div>,
  },
];

const accordeonChildren = [
  {
    name: 'yeah',
  },
  {
    name: 'yeah',
  },
  {
    name: 'yeah',
  },
  {
    name: 'yeah',
  },
  {
    name: 'yeah',
  },
  {
    name: 'yeah',
  },
];

export const TestPage = () => {
  return (
    <div>
      <HollowButton>wtf</HollowButton>
      <Select options={options} placeholder='Ваш вопрос, мой ответ.' />
      <Checkbox color='red' />
      <Checkbox color='green' />
      <Accordeon title='История'>
        {accordeonChildren.map(({ name }) => (
          <div>name</div>
        ))}
      </Accordeon>
    </div>
  );
};
