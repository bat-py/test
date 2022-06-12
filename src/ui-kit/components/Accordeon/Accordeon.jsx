import { useState } from 'react';
import classNames from 'classnames';
import { Card } from '..';

import styles from './Accordeon.module.scss';
import { Arrow } from '../Arrow';

export const Accordeon = ({ className, title, children }) => {
  const [expanded, setExpanded] = useState(false);

  const onExpanderClick = () => {
    setExpanded(state => !state);
  };

  return (
    <Card
      className={classNames(styles.wrapper, className, {
        [styles['wrapper--expanded']]: expanded,
      })}
    >
      <div className={styles.expander} onClick={onExpanderClick}>
        <p className={styles.expander__title}>{title}</p>
        <Arrow className={styles.expander__arrow} active={expanded} color='gray' />
      </div>
      <Card
        className={classNames(styles.children, {
          [styles['children--expanded']]: expanded,
        })}
      >
        {children}
      </Card>
    </Card>
  );
};
