export function round(number: number, decimals: number): number {
    const foo = 10 ** decimals;
    return Math.round((number + Number.EPSILON) * foo) / foo;
}
