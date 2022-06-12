import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
  publicRoutes,
  authRoutes
} from './router';


import { 
  actionSetIsAuth,
  actionSetUserData
} from '../store/actionCreators/userActionCreator'

import {
  SIGNIN_ROUTER
} from '../utils/consts'

import { useWindowSize } from '../hooks';
import { Header, Footer, MobileNav } from '../components';

import '../index.scss';
import styles from './App.module.scss';
import store from '../store/store'
import { useEffect, useState } from 'react'
import { checkIsAuth } from '../http/userAPI'
import { useSelector, useDispatch } from 'react-redux'
import { MainPage } from '../pages';
import { useTranslation } from 'react-i18next';
import { actionSetLang, actionSetLangSelected, actionSetLanguageId } from '../store/actionCreators/siteActionCreator';
import { getTranslation } from '../http/siteAPI';

export const App = () => {

  const dispatch = useDispatch()
  const { isMobile } = useWindowSize();
  const isAuth = useSelector(store => store.user.isAuth)

  const [loading, setLoading] = useState(true)

  const lang = {
    ru: 1,
    en: 2,
    es: 11,
    fr: 12,
    de: 13,
    tr: 14,
  }

  // http://localhost:3000/restore-password-create/7b23dc7a-1aad-41e4-87a0-dbea8eb2d6e2

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.slice(0, 2);

  dispatch(actionSetLanguageId(lang[currentLanguage]))


  const load_lang = async() => {
    let lang = await getTranslation(currentLanguage)
    dispatch(actionSetLang(lang))
    dispatch(actionSetLangSelected(currentLanguage))
  }
  useEffect(() => {
    load_lang()
  },[currentLanguage])

  checkIsAuth().then( async (data) => {
    
    dispatch(actionSetIsAuth(true))
    dispatch(actionSetUserData(data)) 

  }).finally(()=>{

    setLoading(false)

  }).catch((e) => {

    console.log(e.response.data)
    
  })

  if (loading) {
    return (
      <div>
        Идет загрузка ....
      </div>
    )
  }

  return (
    <div className={styles.app}>

      <BrowserRouter>

        <Header logged={isAuth} />

        <main className={styles.main}>

          <Routes>

            {publicRoutes.map(elem => (
              <Route {...elem} key={elem.name} />
            ))}

            {isAuth && authRoutes.map(elem => (
              <Route {...elem} key={elem.name} />
            ))}

            <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

          </Routes>

        </main>
        <Footer />
        {isMobile && <MobileNav />}
      </BrowserRouter>
    </div>
  );
};
