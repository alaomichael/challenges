export {};
async function runWithConcurrency<T, R>(
    items: T[],
    limit: number,
    operation: (item: T) => Promise<R>
): Promise<R[]> {

    const results: R[] = new Array(items.length);
    let nextIndex = 0;

    // input validation
    if (!Number.isInteger(limit) || limit < 1) {
        throw new Error("Concurrency limit must be a positive integer");
    }

    async function worker() {
        while (nextIndex < items.length) {
            const currentIndex = nextIndex++;

            results[currentIndex] =
                await operation(items[currentIndex]);
        }
    }

    const workers = Array.from(
        { length: Math.min(limit, items.length) },
        () => worker()
    );

    await Promise.all(workers);

    return results;
}
