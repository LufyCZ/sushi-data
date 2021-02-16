type User = {
    id: string,
    claims: {
        id: string,
        week: number,
        amount: number
    }[],
    totalClaimed: number
};

export function user({block, timestamp, userAddress}: {
    block?: number;
    timestamp?: number;
    user_address: string;
}): Promise<User>;

export function users({block, timestamp}?: {
    block?: number;
    timestamp?: number;
}): Promise<User[]>;



type Week = {
    id: number,
    numberOfClaims: number,
    totalClaimed: number,
    merkleRoot: string
};

export function week({block, timestamp, week}: {
    block?: number;
    timestamp?: number;
    week: number;
}): Promise<Week>;

export function weeks({block, timestamp}?: {
    block?: number;
    timestamp?: number;
}): Promise<Week[]>;