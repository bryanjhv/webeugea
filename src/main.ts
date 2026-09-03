import type { Item } from './api'
import Alpine from 'alpinejs'
import { fetchItems, photoUrl, profileUrl } from './api'
import { flagFor } from './flags'

interface App {
	data: Item[]
	filters: Record<string, string[]>
	filtersOpen: boolean
	readonly filterFields: FilterField[]
	options: (field: keyof Item) => FilterOption[]
	readonly filteredData: Item[]
	mainPhoto: (item: Item) => string
	previewUrl: string
	openPreview: (item: Item) => void
	openInNewTab: () => void
	views: (item: Item) => string
	isVerified: (item: Item) => boolean
	nationalityFlag: (item: Item) => string
	currencySymbol: (item: Item) => string
	price: (item: Item) => string | null
}

interface FilterField {
	field: keyof Item
	label: string
}

interface FilterOption {
	value: string
	count: number
}

const FILTER_FIELDS: FilterField[] = [
	{ field: 'anuncio_verificado', label: 'Verificado' },
	{ field: 'nacionalidad', label: 'Nacionalidad' },
	{ field: 'edad', label: 'Edad' },
	{ field: 'nombre_de_departamento', label: 'Departamento' },
	{ field: 'nombre_de_provincia', label: 'Provincia' },
	{ field: 'nombre_de_distrito_1', label: 'Distrito' },
]

const PRICE_KEYS = Array.from({ length: 6 }, (_, i) => `precio_${i + 1}` as keyof Item)

Alpine.data<App, never>('app', () => ({
	data: [],
	filters: Object.fromEntries(FILTER_FIELDS.map(({ field }) => [field, []])),
	filtersOpen: false,
	filterFields: FILTER_FIELDS,
	options(field) {
		const base = this.data.filter(item =>
			FILTER_FIELDS.every(({ field: otherField }) => {
				if (otherField === field)
					return true
				const selected = this.filters[otherField] ?? []
				return selected.length === 0 || selected.includes(item[otherField])
			}),
		)
		const counts = new Map<string, number>()
		for (const item of base) {
			const value = item[field]
			if (value)
				counts.set(value, (counts.get(value) ?? 0) + 1)
		}
		for (const value of this.filters[field] ?? []) {
			if (!counts.has(value))
				counts.set(value, 0)
		}
		const numeric = field === 'edad'
		return [...counts.entries()]
			.map(([value, count]) => ({ value, count }))
			.sort(numeric
				? (a, b) => Number(a.value) - Number(b.value)
				: (a, b) => a.value.localeCompare(b.value))
	},
	get filteredData() {
		return this.data.filter(item =>
			FILTER_FIELDS.every(({ field }) => {
				const selected = this.filters[field] ?? []
				return selected.length === 0 || selected.includes(item[field])
			}),
		)
	},
	mainPhoto(item) {
		const filename = item[item.foto_principal as keyof Item]
		return filename ? photoUrl(filename) : ''
	},
	previewUrl: '',
	openPreview(item) {
		this.previewUrl = profileUrl(item.id_usuario)
		const dialog = this.$refs['previewDialog'] as HTMLDialogElement
		dialog.showModal()
		dialog.focus()
	},
	openInNewTab() {
		window.open(this.previewUrl, '_blank', 'noopener')
	},
	views(item) {
		return new Intl.NumberFormat('es-MX').format(+item.cantidad_de_vistas)
	},
	isVerified(item) {
		return +item.anuncio_verificado === 1
	},
	nationalityFlag(item) {
		return flagFor(item.nacionalidad)
	},
	currencySymbol(item) {
		return item.moneda === 'Dolares (US$)' ? 'US$' : 'S/'
	},
	price(item) {
		if (item.mostrar_tarifa !== 'MOSTRAR')
			return null
		const found = PRICE_KEYS.find(key => +item[key] > 0)
		return found ? `${this.currencySymbol(item)} ${+item[found]}` : null
	},
	init() {
		void fetchItems().then((data) => {
			this.data = data.sort((a, b) =>
				+b.anuncio_verificado - +a.anuncio_verificado
				|| +b.puntuacion - +a.puntuacion
				|| +b.cantidad_de_vistas - +a.cantidad_de_vistas
				|| +a.id_usuario - +b.id_usuario)
		})
	},
}))

Alpine.start()
