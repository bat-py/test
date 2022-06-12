import {
  MainPage,
  SignIn,
  SignUp,
  RestorePassword,
  RestoreEmailSent,
  TestPage,
  DepositRefill,
  Trade,
  Balance,
  Deposit,
  Withdrawal,
  Exchange,
  History,
  Support,
  Information,
  Verification,
  Referal,
  VIP,
  News,
  NewsItem,
  ChangePassword,
  Page,
  RestorePasswordCreate,
  ConfirmEmail,
  ConfirmEmailData,
} from '../../pages';

import {
  BALANCE_ROUTER,
  CHANGE_PASSWORD_ROUTER,
  EXCHANGE_ROUTER,
  HISTORY_ROUTER,
  MAIN_ROUTER,
  NEWS_ONE_ROUTER,
  NEWS_ROUTER,
  REFERAL_ROUTER,
  SIGNIN_ROUTER, 
  SIGNUP_ROUTER, 
  SUPPORT_ROUTER, 
  TRADE_ROUTER, 
  VERIFICATION_ROUTER, 
  VIP_ROUTER,
  PAGE_ROUTER,
  DEPOSIT_ROUTER,
  DEPOSIT_REFILL_ROUTER,
  WITHDRAWAL_ROUTER,
  SUPPORT_INFORMATION_ROUTER,
  PASSWORD_RESTORE_ROUTER,
  PASSWORD_RESTORE_CREATE_ROUTER,
  RESTORE_EMAIL_SENT_ROUTER,
  CONFIRM_EMAIL_ROUTER,
} from '../../utils/consts'

export const authRoutes = [
  {
    path: TRADE_ROUTER,
    name: 'trade',
    element: <Trade />,
  },
  {
    path: DEPOSIT_REFILL_ROUTER,
    name: 'deposit-refill',
    element: <DepositRefill />,
  },
  {
    path: BALANCE_ROUTER,
    name: 'balance',
    element: <Balance />,
  },
  {
    path: DEPOSIT_ROUTER,
    name: 'deposit',
    element: <Deposit />,
  },
  {
    path: WITHDRAWAL_ROUTER,
    name: 'withdrawal',
    element: <Withdrawal />,
  },
  {
    path: EXCHANGE_ROUTER,
    name: 'exchange',
    element: <Exchange />,
  },
  {
    path: HISTORY_ROUTER,
    name: 'history',
    element: <History />,
  },
  {
    path: SUPPORT_ROUTER,
    name: 'support',
    element: <Support />,
  },
  {
    path: SUPPORT_INFORMATION_ROUTER,
    name: 'information',
    element: <Information />,
  },
  {
    path: VERIFICATION_ROUTER,
    name: 'verification',
    element: <Verification />,
  },
  {
    path: REFERAL_ROUTER,
    name: 'referal',
    element: <Referal />,
  },
  {
    path: VIP_ROUTER,
    name: 'vip',
    element: <VIP />,
  },
  {
    path: CHANGE_PASSWORD_ROUTER,
    name: 'change-password',
    element: <ChangePassword />,
  },
  {
    path: CONFIRM_EMAIL_ROUTER,
    name: 'confirm-email',
    element: <ConfirmEmailData />,
  },
]

export const publicRoutes = [
  {
    path: MAIN_ROUTER,
    name: 'main-page',
    element: <MainPage />,
  },
  {
    path: SIGNIN_ROUTER,
    name: 'sign-in',
    element: <SignIn />,
  },
  {
    path: PASSWORD_RESTORE_ROUTER,
    name: 'password-restore',
    element: <RestorePassword />,
  },
  {
    path: PASSWORD_RESTORE_CREATE_ROUTER,
    name: 'password-restore-create',
    element: <RestorePasswordCreate />,
  },
  {
    path: SIGNUP_ROUTER,
    name: 'sign-up',
    element: <SignUp />,
  },
  {
    path: RESTORE_EMAIL_SENT_ROUTER,
    name: 'restore-email-sent',
    element: <RestoreEmailSent />,
  },
  {
    path: NEWS_ROUTER,
    name: 'news',
    element: <News />,
  },
  {
    path: NEWS_ONE_ROUTER,
    name: 'news_item',
    element: <NewsItem />,
  },

  {
    path: PAGE_ROUTER,
    name: 'page',
    element: <Page />,
  },
  
];
