import { useTranslation } from 'react-i18next';
import RU from './assets/RU.svg';
import EN from './assets/EN.svg';
import FR from './assets/FR.svg';
import DE from './assets/DE.svg';
import ES from './assets/ES.svg';
import TR from './assets/TR.svg';

export const LanguageMenuIcon = ({ className }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.slice(0, 2);
  switch (currentLanguage) {
    case 'ru':
      return <img className={className} src={RU} draggable={false} />;
    case 'en':
      return <img className={className} src={EN} draggable={false} />;
    case 'fr':
      return <img className={className} src={FR} draggable={false} />;
    case 'de':
      return <img className={className} src={DE} draggable={false} />;
    case 'es':
      return <img className={className} src={ES} draggable={false} />;
    case 'tr':
      return <img className={className} src={TR} draggable={false} />;
  }
};
