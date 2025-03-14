import { defineStore } from "pinia";

/** Интерфейс аккаунта **/
interface Account {
  id: number;
  labels: string[];
  type: "LDAP" | "Локальная";
  login: string;
  password: string | null;
  isValid: boolean;
}

export const useAccountsStore = defineStore("accounts", {

  /** Храним аккаунты **/
  state: (): { accounts: Account[] } => ({
    accounts: [],
  }),

  actions: {
    /** Создание аккаунта **/
    addAccount() {
      const newAccount: Account = {
        id: Date.now(),
        labels: [],
        type: "LDAP",
        login: "",
        password: null,
        isValid: false,
      };
      this.accounts.push(newAccount); // Добавили в массив

      console.log(newAccount)
    },

    /** Удаление аккаунта **/
    removeAccount(id: number) {
      this.accounts = this.accounts.filter((acc) => acc.id !== id);

      console.log(id)
    },

    /** Обновление аккаунта **/
    updateAccount(id: number, account: Partial<Account>) {
      // Найти индекс аккаунта по id
      const indexAcc: number = this.accounts.findIndex((acc) => acc.id === id);

      console.log(indexAcc)

      // Если нашли такой аккаунт, обновляем его
      if (indexAcc !== -1) {
        this.accounts[indexAcc] = {
          ...this.accounts[indexAcc], // Оставляем старые данные
          ...account, // Обновляем переданные поля
        };
      }
    },

    /** Валидация аккаунта **/
    validateAccount(id: number) {
      // Найти индекс аккаунта по id
      const indexAcc: number = this.accounts.findIndex((acc) => acc.id === id);

      console.log(indexAcc)

      // Если нашли такой аккаунт, валидируем его
      if (indexAcc !== -1) {
        this.accounts[indexAcc].isValid = true;
      }
    }
  }
});
