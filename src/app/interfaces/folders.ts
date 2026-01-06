export interface FolderI {
    id?: number
    name: string
    added?: boolean
}

export type FolderActionsT = {
    update: (data: string) => void
    delete: () => void
}

export type FolderUpdateKeyI = {
    [key in keyof FolderI]?: any
}

export interface FolderModelI {
    id: number
    list: FolderI[]
    db: {
        add(data: FolderI): Promise<any>
        update(data: FolderI): void
        delete(): void
        updateAllFolders(value: string): void
    }
}
