import {defineStore} from "pinia";

/** интерфейс аккаунта **/
interface Account {
  id: number;
  labels: string[];
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string | null;
  isValid: boolean;
}

export const useAccountsStore = defineStore({
  id: "accounts",

  /** храним аккаунты **/
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    /** создание аккаунта **/
    addAccount() {
      const newAccount: Account = {
        id: Date.now(),
        labels: [],
        type: 'LDAP',
        login: '',
        password: null,
        isValid: false,
      }
    },
    /** удаление аккаунта **/
    removeAccount(id: number) {

      // массив объектов, хранящий все наши аккаунты, filter - метод массива, который создает новый массив с элементами
      this.accounts = this.accounts.filter((acc) => {
        // если id аккаунта не равен id, который мы хотим удалить, то мы его оставляем
        return acc.id !== id;
      })
    },
    /** обновление аккаунта **/
    updateAccount(id: number, account: Partial<Account>) {

    }
  }
});