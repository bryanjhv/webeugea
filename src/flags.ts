const FLAGS: Record<string, string> = {
	ARGENTINA: '🇦🇷',
	BOLIVIANA: '🇧🇴',
	BRASILEÑA: '🇧🇷',
	CHILENA: '🇨🇱',
	COLOMBIANA: '🇨🇴',
	COSTARRICENSE: '🇨🇷',
	CUBANA: '🇨🇺',
	DOMINICANA: '🇩🇴',
	ECUATORIANA: '🇪🇨',
	ESPAÑOLA: '🇪🇸',
	ESTADOUNIDENSE: '🇺🇸',
	GUATEMALTECA: '🇬🇹',
	HONDUREÑA: '🇭🇳',
	MEXICANA: '🇲🇽',
	NICARAGÜENSE: '🇳🇮',
	PANAMEÑA: '🇵🇦',
	PARAGUAYA: '🇵🇾',
	PERUANA: '🇵🇪',
	PUERTORRIQUEÑA: '🇵🇷',
	SALVADOREÑA: '🇸🇻',
	URUGUAYA: '🇺🇾',
	VENEZOLANA: '🇻🇪',
}

export function flagFor(nationality: string): string {
	return FLAGS[nationality] ?? '🏳️'
}
