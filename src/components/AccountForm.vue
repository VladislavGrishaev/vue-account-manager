<script setup lang="ts">
import {useAccountsStore} from "../store/accounts.ts";
import {reactive} from "vue";
import {storeToRefs} from "pinia";

//	получаем хранилище
const store = useAccountsStore();

// реактивный объект
const data = reactive({

  // позволяет сделать реактивными свойства объекта (чтобы обновлялись) и быть доступными как ссылки
  accounts: storeToRefs(useAccountsStore()).accounts
});

// метод добавления учётной записи
const addAccount = () => {
		store.addAccount();
};

// метод удаления учётной записи
const removeAccount = (id: number) => {
		store.removeAccount(id);
};

// метод обновления учётной записи
const updateAccount = (id: number, account: Partial<Account>) => {
		store.updateAccount(id, account);
};

// ограничение на количество символов в поле
const limitText = (account, field, maxLength) => {
		if (account[field].length > maxLength) {
				account[field] = account[field].slice(0, maxLength);
		}
};



</script>

<template>
		<div>
				<v-container>
						<div class="d-flex align-center justify-between mb-4 ga-5">
								<h2 class="text-xl font-semibold">Учётные записи</h2>
								<v-btn
												@click="addAccount"
												icon="mdi-plus"
												variant="outlined"
								>
										<v-icon>mdi-plus</v-icon>
								</v-btn>
						</div>

						<v-row class="mb-2" align="center">
								<v-col cols="8">
										<v-alert type="info">
												Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
										</v-alert>
								</v-col>
						</v-row>
						<v-row
							v-for="account in data.accounts"
							:key="account.id"
							:class="{'no-password': account.type === 'LDAP'}"
						>
								<v-col cols="2 ">
										<v-text-field
														v-model="account.name"
														label="Метки"
														variant="outlined"
														hide-details
														@blur="updateAccount(account.id, { name: account.name })"
														@input="limitText(account, 'name', 50)"
										/>
								</v-col>

								<v-col cols="2">
										<v-select
														v-model="account.type"
														variant="outlined"
														hide-details
														:items="['Локальная', 'LDAP']"
														label="Тип записи"
														@update:modelValue="updateAccount(account.id, { type: account.type })"
										></v-select>
								</v-col>

								<v-col cols="2">
										<v-text-field
														v-model="account.login"
														label="Логин"
														variant="outlined"
														hide-details
														@blur="updateAccount(account.id, { login: account.login })"
										/>
								</v-col>

								<v-col
												v-if="account.type !==	'LDAP'"
												cols="2"
								>
										<v-text-field
														v-model="account.password"
														label="Пароль"
														type="password"
														variant="outlined"
														hide-details
														@blur="updateAccount(account.id, { password: account.password })"
										/>
								</v-col>

								<v-col cols="2">
										<v-btn
														@click="removeAccount(account.id)"
														icon="mdi-delete"
														variant="outlined"
										>
												<v-icon>mdi-delete</v-icon>
										</v-btn>
								</v-col>

						</v-row>
				</v-container>
		</div>
</template>

<style	scoped>
.error	{
		border: 1px solid red;
}

.no-password .v-col:nth-last-of-type(2) {
    flex: 0 0 597px;
    max-width: none;
}
</style>