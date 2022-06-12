import styles from './SelectOption.module.scss';

export const SelectOption = ({ icon, text }) => (
  <div className={styles.option}>
    <img className={styles.option__icon} src={icon} alt='' />
    {text}
  </div>
);
