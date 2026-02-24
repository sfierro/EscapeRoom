export interface ElectronAPI {
    saveGame: (data: unknown) => Promise<boolean>;
    loadGame: () => Promise<unknown | null>;
    deleteSave: () => Promise<boolean>;
}

declare global {
    interface Window {
        api: ElectronAPI;
    }
}
