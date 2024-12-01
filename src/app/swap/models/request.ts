export enum RequestType {
    GET_CURRENCY = "get_currency",
    GET_ALL_CURRENCIES = "get_all_currencies",
    GET_PAIRS_ALL_PAIRS = "get_all_pairs",
    GET_ESTIMATED = "get_estimated",
    GET_PAIRS = "get_pairs",
    GET_RANGE = "get_ranges",
    GET_ORDER = "get_exchange",
    CREATE_EXCHANGE = "create_exchange"
}

export enum RequestErrorCodes {
    WRONG_API_KEY = 401,
    SYMBOL_NOT_FOUND = 404,
    INVALID_REQUEST = 400
}

export interface RequestError {
    code: RequestErrorCodes,
    error: string,
    description: string,
    trace_id: string
}