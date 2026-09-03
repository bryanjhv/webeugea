/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_LIST_URL: string
	readonly VITE_PHOTO_URL: string
	readonly VITE_PROFILE_URL: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
