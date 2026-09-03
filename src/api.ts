export interface Item {
	id_usuario: string
	nombre_usuario: string
	edad: string
	nacionalidad: string
	top: string
	puntuacion: string
	cantidad_de_vistas: string
	anuncio_verificado: string
	moneda: string
	mostrar_tarifa: string
	nombre_de_departamento: string
	nombre_de_provincia: string
	nombre_de_distrito_1: string
	precio_1: string
	precio_2: string
	precio_3: string
	precio_4: string
	precio_5: string
	precio_6: string
	foto_principal: string
	foto_01: string
	foto_02: string
	foto_03: string
	foto_04: string
	foto_05: string
	foto_06: string
	foto_07: string
	foto_08: string
	foto_09: string
	foto_10: string
	foto_11: string
	foto_12: string
}

export function photoUrl(filename: string): string {
	return import.meta.env.VITE_PHOTO_URL.replace('{}', filename)
}

export function profileUrl(id: string): string {
	return import.meta.env.VITE_PROFILE_URL.replace('{}', id)
}

export async function fetchItems(): Promise<Item[]> {
	return new Promise((resolve) => {
		const callbackName = `cb$${Date.now()}`
		const script = document.createElement('script')
		script.src = import.meta.env.VITE_LIST_URL.replace('{}', callbackName)
		// @ts-expect-error window global
		window[callbackName] = (data: Item[]) => {
			resolve(data)
			// @ts-expect-error window global
			delete window[callbackName]
			script.remove()
		}
		document.body.appendChild(script)
	})
}
