<script setup lang="ts">
import {useAccountsStore} from "../store/accounts.ts";
import {computed, reactive, ref, watch} from "vue";
import {storeToRefs} from "pinia";

//	получаем хранилище
const store = useAccountsStore();

// реактивный объект
const data = reactive({

  // позволяет сделать реактивными свойства объекта (чтобы обновлялись) и быть доступными как ссылки
  accounts: storeToRefs(useAccountsStore()).accounts,
});

// метод добавления учётной записи
const addAcc = () => {
  store.addAccount();
};

// метод удаления учётной записи
const removeAcc = (id: number) => {
  store.removeAccount(id);
};

// метод обновления учётной записи
const updateAcc = (id: number, account: Partial<Account>) => {
  store.updateAccount(id, account);
};

// ограничение на количество символов в поле
const limitText = (account, field, maxLength) => {
  if (account[field].length > maxLength) {
    account[field] = account[field].slice(0, maxLength);
  }
};

const errors = ref<Record<number, Errors>>({});

// Валидация полей
const validateAccField = (account, field: 'login' | 'password') => {
  // результат валидации
		const resultValid = store.validateAccount(account.id);

  if (!errors.value[account.id]) {
				errors.value[account.id] = {isValidate: true};
  }

  errors.value[account.id][field] = resultValid[field];

  store.updateAccount(account.id, {
    [field]: account[field],
  });
}

// отображение массива меток через разделитель ;
const objAccName = ref<Record<number, string>>({});

const formatName = (labels: { text: string }[] | string): string => {
  return Array.isArray(labels) ? labels.map(item => item.text).join(';') : labels;
};

const parseName = (nameString: string): { text: string }[] => {
  return nameString.split(';').map(item => ({ text: item.trim() }));
};

const updateName = (account: Account, nameString: string) => {
  if (nameString) {
    const newArrayAcc = parseName(nameString);
    store.updateAccount(account.id, { name: newArrayAcc });
  }
};

watch(() => data.accounts, (accounts) => {
    accounts.forEach((account) => {
      objAccName.value[account.id] = formatName(account.name);
    });
  },
  {
    deep: true,
		  immediate: true
  }
);


</script>

<template>
		<div>
				<v-container>
						<div class="d-flex align-center justify-between mb-4 ga-5">
								<h2 class="text-xl font-semibold">Учётные записи</h2>
								<v-btn
												@click="addAcc"
												icon="mdi-plus"
												variant="outlined"
								>
										<v-icon>mdi-plus</v-icon>
								</v-btn>
						</div>
						<v-form>
								<v-row class="mb-2" align="center">
										<v-col cols="8">
												<v-alert type="info" color="gray">
														Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
												</v-alert>
										</v-col>
								</v-row>
								<v-row
												v-for="account in data.accounts"
												:key="account.id"
												:class="{'no-password': account.type === 'LDAP'}"
								>
										<v-col cols="2">
												<v-text-field
																:id="`username-${account.id}`"
																v-model="objAccName[account.id]"
																label="Метки"
																variant="outlined"
																:aria-describedby="`username-messages-${account.id}`"
																autocomplete="username"
																hide-details
																@blur="updateName(account, objAccName[account.id])"
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
																@update:modelValue="updateAcc(account.id, { type: account.type })"
												></v-select>
										</v-col>

										<v-col cols="2">
												<v-text-field
																v-model="account.login"
																label="Логин"
																variant="outlined"
																hide-details
																autocomplete="username"
																:class="{'error-field': errors[account.id]?.login}"
																:error-messages="errors[account.id]?.login"
																@blur="validateAccField(account, 'login')"
																@input="limitText(account, 'login', 100)"
												/>
										</v-col>

										<v-col
														v-if="account.type !==	'LDAP'"
														cols="2"
										>
												<v-text-field
																:id="`login-${account.id}`"
																v-model="account.password"
																:aria-describedby="`login-messages-${account.id}`"
																autocomplete="current-password"
																label="Пароль"
																type="password"
																variant="outlined"
																hide-details
																:class="{'error-field': errors[account.id]?.password}"
																:error-messages="errors[account.id]?.password"
																@blur="validateAccField(account, 'password')"
																@input="limitText(account, 'password', 100)"
												/>
										</v-col>

										<v-col cols="2">
												<v-btn
																@click="removeAcc(account.id)"
																icon="mdi-delete"
																variant="outlined"
												>
														<v-icon>mdi-delete</v-icon>
												</v-btn>
										</v-col>

								</v-row>
						</v-form>
				</v-container>
		</div>
</template>

<style scoped>
.error-field .v-field__overlay {
    border: 1px solid red !important;
}

.no-password .v-col:nth-last-of-type(2) {
    flex: 0 0 597px;
    max-width: none;
}
</style>