<script setup lang="ts">



</script>

<template>
		<div>
				<v-container>
						<div class="d-flex align-center justify-between mb-4 ga-5">
								<h2 class="text-xl font-semibold">Учётные записи</h2>
								<v-btn icon="mdi-plus" variant="outlined">
										<v-icon>mdi-plus</v-icon>
								</v-btn>
						</div>

						<v-row>
								<v-col cols="2 ">
										<v-text-field label="Метки" variant="outlined" hide-details/>
								</v-col>

								<v-col cols="2">
										<v-select variant="outlined" hide-details></v-select>
								</v-col>

								<v-col cols="2">
										<v-text-field label="Логин" variant="outlined" hide-details/>
								</v-col>

								<v-col cols="2">
										<v-text-field label="Пароль" type="password" variant="outlined" hide-details/>
								</v-col>

								<v-col cols="2">
										<v-btn icon="mdi-delete" variant="outlined">
												<v-icon>mdi-delete</v-icon>
										</v-btn>
								</v-col>

						</v-row>
				</v-container>
		</div>
</template>