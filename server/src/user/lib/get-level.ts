// import { CategoriesType } from '../types/get-category.types'

export const getLevel = (points: number) => {
	if (points >= 100000) return 'Высший разум'
	if (points >= 50000) return 'Гений'
	if (points >= 20000) return 'Просветленный'
	if (points >= 10000) return 'Мудрец'
	if (points >= 5000) return 'Мыслитель'
	if (points >= 2500) return 'Гуру'
	if (points >= 1000) return 'Мастер'
	if (points >= 500) return 'Профи'
	if (points >= 250) return 'Знаток'
	if (points >= 1) return 'Ученик'
	return 'Новичок'
}
