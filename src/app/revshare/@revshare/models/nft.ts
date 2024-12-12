export interface NFTData {
    chain: string,
    collectionAddress: string,
    collectionName: string,
    collectionTokenId: string,
    description: string,
    name: string,
    imageUrl: string,
    network: string
}

export interface FetchNftResponse {
    owner: string,
    ensName: string,
    pageNumber: number,
    totalItems: number,
    totalPages: number,
    assets: NFTData[]
}