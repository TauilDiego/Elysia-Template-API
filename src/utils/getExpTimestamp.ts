export default function getExpTimestamp(seconds: number) {
    const currentTimeMillis = Date.now();
    const secondsIndoMillis = seconds * 1000;
    const expirationTimeMillis = currentTimeMillis + secondsIndoMillis;

    return Math.floor(expirationTimeMillis / 1000);
}