import { defineStore } from "pinia";

/** Интерфейс аккаунта **/
interface Account {
  id: number;
  name: { text: string }[];
  type: "LDAP" | "Локальная";
  login: string;
  password: string | null;
}

interface Errors {
  login?: string;
  password?: string;
  isValid: boolean;
}


export const useAccountsStore = defineStore("accounts", {

  /** Храним аккаунты **/
  state: (): { accounts: Account[] } => {

    const storedAccounts: string | null = localStorage.getItem("accounts");
    return {
      accounts: storedAccounts ? JSON.parse(storedAccounts) : [],
    };
  },
  persist: true,

  actions: {
    /** Получаем последний id из LocalStorage **/
    getLastId(): number {
      const lastId: string | null = localStorage.getItem("lastId")
      return lastId ? parseInt(String(lastId)) : 0;
    },

    /** Сохраняем аккаунты в LocalStorage **/
    saveAccounts(): void {
      localStorage.setItem("accounts", JSON.stringify(this.accounts));
    },

    /** Создание аккаунта **/
    addAccount(): void {
      const lastId: number = this.getLastId();
      const newId: number = lastId + 1;

      const newAccount: Account = {
        id: newId,
        name: [{ text: "" }],
        type: "Локальная",
        login: "",
        password: null
      };
      this.accounts.push(newAccount);

      this.saveAccounts();

      localStorage.setItem("lastId", newId.toString());
    },

    /** Удаление аккаунта **/
    removeAccount(id: number): void {
      this.accounts = this.accounts.filter((acc) => acc.id !== id);
      this.saveAccounts()
    },

    /** Обновление аккаунта **/
    updateAccount(id: number, account: Partial<Account>): void {
      const indexAcc: number = this.accounts.findIndex((acc) => acc.id === id);

      if (account.name && typeof account.name === 'string') {
        //@ts-ignore
        account.name = account.name.split(';').map((label) => ({ text: label.trim() })).filter((label) => label.text !== '');
      }

      if (indexAcc !== -1) {
        const existingAccount: Account = this.accounts[indexAcc];

        if (account.type === 'LDAP') {
          account.password = null;
        }

        this.accounts[indexAcc] = {
          ...existingAccount,
          ...account,
        };
      }
      this.validateAccount(id)
      this.saveAccounts()
    },

    /** Валидация аккаунта **/
    validateAccount(id: number): Errors {
      const indexAcc: number = this.accounts.findIndex((acc: Account): boolean => acc.id === id);

      if (indexAcc === -1) return { isValid: false };

      const account: Account = this.accounts[indexAcc];
      const errors: Errors = { isValid: true };

      if (!account.login.trim()) {
        errors.login = "Логин обязателен";
        errors.isValid = false;
      }

      if (account.type !== 'LDAP') {
        if (!account.password || !account.password.trim()) {
          errors.password = 'Пароль обязателен';
          errors.isValid = false;
        }
      }
      return errors;
    }
  }
});
