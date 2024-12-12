export interface QuicknodeResponse<Inner> {
    jsonrpc: string,
    id: string,
    result: Inner,
}