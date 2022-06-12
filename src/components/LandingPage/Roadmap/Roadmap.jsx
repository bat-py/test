import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Card, ColoredText, ControlButtonMenu } from '../../../ui-kit/components';
import { ControlButtonMenuCommont } from '../../../ui-kit/components/ControlButtonMenu/ControlButtonMenuCommon';

import styles from './Roadmap.module.scss';

export const Roadmap = () => {

  const lang = useSelector((state) => state.site.lang)

  const roadmapInfo = {
    2022: [
      {
        title: lang['roadmap_2_2022'],
        items: [
          lang['roadmap_2_2022_item_1'],
          lang['roadmap_2_2022_item_2'],
          lang['roadmap_2_2022_item_3'],
          lang['roadmap_2_2022_item_4'],
        ],
      },
      {
        title: lang['roadmap_3_2022'],
        items: [
          lang['roadmap_3_2022_item_1'],
          lang['roadmap_3_2022_item_2'],
          lang['roadmap_3_2022_item_3'],
          lang['roadmap_3_2022_item_4'],
          lang['roadmap_3_2022_item_5'],
        ],
      },
      {
        title: lang['roadmap_4_2022'],
        items: [
          lang['roadmap_4_2022_item_1'],
          lang['roadmap_4_2022_item_2'],
          lang['roadmap_4_2022_item_3'],
          lang['roadmap_4_2022_item_4'],
          lang['roadmap_4_2022_item_5'],
        ],
      },
    ],
    2023: [
      {
        title: lang['roadmap_1_2023'],
        items: [
          lang['roadmap_1_2023_item_1'],
          lang['roadmap_1_2023_item_2'],
          lang['roadmap_1_2023_item_3'],
          lang['roadmap_1_2023_item_4'],
          lang['roadmap_1_2023_item_5'],
        ],
      },
      {
        title: lang['roadmap_2_2023'],
        items: [
          lang['roadmap_2_2023_item_1'],
          lang['roadmap_2_2023_item_2'],
        ],
      },
    ],
    2025: [
      {
        title: lang['roadmap_2_2025'],
        items: [
          lang['roadmap_2_2025_item_1'],
          lang['roadmap_2_2025_item_2'],
          lang['roadmap_2_2025_item_3'],
        ],
      },
    ],
    2026: [
      {
        title: lang['roadmap_3_2026'],
        items: lang['roadmap_3_2026_item_1'],
      },
    ],
  };



  const [activeYear, setActiveYear] = useState('2022');
  const buttons = useMemo(
    () => Object.keys(roadmapInfo).map(year => ({ name: year, value: year })),
    []
  );

  const onYearChange = useCallback(value => {
    setActiveYear(value);
  }, []);

  return (
    <section className={styles.body}>
      <h3 className={styles.title}>{ lang['roadmap_title'] }</h3>
      <ControlButtonMenuCommont className={styles.menu} buttons={buttons} onChange={onYearChange} />
      <div className={styles['roadmap-list']}>
        {roadmapInfo[activeYear].map(({ title, items }) => (
          <Card className={styles['roadmap-item']}>
            <h4 className={styles['roadmap-item__title']}>
              <ColoredText color='gold'>{title}</ColoredText>
            </h4>
            {items.map(item => (
              <p className={styles['roadmap-item__text']}>{item}</p>
            ))}
          </Card>
        ))}
      </div>
    </section>
  );
};
