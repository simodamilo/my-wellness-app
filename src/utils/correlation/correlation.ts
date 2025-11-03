export const pearsonCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    if (n === 0) return 0;

    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const denominator = Math.sqrt(
        x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0) *
        y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0)
    );

    return denominator === 0 ? 0 : numerator / denominator;
}
