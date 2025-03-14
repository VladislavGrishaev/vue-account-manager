import { defineStore } from "pinia";

/** Интерфейс аккаунта **/
interface Account {
  id: number;
  name: string[];
  type: "LDAP" | "Локальная";
  login: string;
  password: string | null;
  isValid: boolean;
}


export const useAccountsStore = defineStore("accounts", {

  /** Храним аккаунты **/
  state: (): { accounts: Account[] } => {

    /** Загрузка аккаунтов из LocalStorage **/
    const storedAccounts: string | null = localStorage.getItem("accounts");
    return {
      accounts: storedAccounts ? JSON.parse(storedAccounts) : [],
    };
  },

  actions: {
    /** Получаем последний id из LocalStorage **/
    getLastId() {
      const lastId: string | null = localStorage.getItem("lastId")
      return lastId ? parseInt(String(lastId)) : 0;
    },

    /** Сохраняем аккаунты в LocalStorage **/
    saveAccounts() {
      localStorage.setItem("accounts", JSON.stringify(this.accounts));
    },

    /** Создание аккаунта **/
    addAccount() {
      const lastId: number = this.getLastId();
      const newAccount: Account = {
        id: lastId + 1,
        name: [],
        type: "LDAP",
        login: "",
        password: null,
        isValid: false,
      };
      this.accounts.push(newAccount); // Добавили в массив

      // Сохраняем обновлённый список аккаунтов в localStorage
      this.saveAccounts();

      console.log(newAccount)
    },

    /** Удаление аккаунта **/
    removeAccount(id: number) {
      this.accounts = this.accounts.filter((acc) => acc.id !== id);

      // Сохраняем обновлённый список аккаунтов в localStorage
      this.saveAccounts()
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

      // Если нашли такой аккаунт, валидируем его
      if (indexAcc !== -1) {
        this.accounts[indexAcc].isValid = true;

        // Сохраняем обновлённый список аккаунтов в localStorage
        this.saveAccounts()
      }

      console.log(indexAcc)
    }
  }
});
