declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PDGADATABASE: string;
			PASSWORD: string;
		}
	}
}

export {};
