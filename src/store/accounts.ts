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

    /** Загрузка аккаунтов из LocalStorage **/
    const storedAccounts: string | null = localStorage.getItem("accounts");
    return {
      accounts: storedAccounts ? JSON.parse(storedAccounts) : [],
    };
  },

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
      this.accounts.push(newAccount); // Добавили в массив

      // Сохраняем обновлённый список аккаунтов в localStorage
      this.saveAccounts();

      localStorage.setItem("lastId", newId.toString());

      console.log('addAccount: ' + newId)
    },

    /** Удаление аккаунта **/
    removeAccount(id: number): void {
      this.accounts = this.accounts.filter((acc) => acc.id !== id);

      // Сохраняем обновлённый список аккаунтов в localStorage
      this.saveAccounts()
      console.log(id)
    },

    /** Обновление аккаунта **/
    updateAccount(id: number, account: Partial<Account>): void {
      // Найти индекс аккаунта по id
      const indexAcc: number = this.accounts.findIndex((acc) => acc.id === id);


      if (account.name && typeof account.name === 'string') {
        //@ts-ignore
        account.name = account.name.split(';').map((label) => ({ text: label.trim() })).filter((label) => label.text !== '');
      }

      console.log(account.name)


      console.log('updateAccount: ' + indexAcc)

      // Если нашли такой аккаунт, обновляем его
      if (indexAcc !== -1) {
        const existingAccount: Account = this.accounts[indexAcc];

        // если изменился тип на LDAP, то обнуляем пароль
        if (account.type === 'LDAP') {
          account.password = null;
        }

        this.accounts[indexAcc] = {
          ...existingAccount, // Оставляем старые данные
          ...account, // Обновляем переданные поля
        };
      }
      this.validateAccount(id)

      // Сохраняем обновлённый список аккаунтов в localStorage
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

      console.log('Valid')

      return errors;
    }
  }
});
