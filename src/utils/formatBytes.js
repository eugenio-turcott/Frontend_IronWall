export default function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const isNegative = bytes < 0;
    const absoluteBytes = Math.abs(bytes);
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (absoluteBytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(absoluteBytes) / Math.log(k));
    const formattedValue = parseFloat((absoluteBytes / Math.pow(k, i)).toFixed(dm));

    return (isNegative ? '-' : '') + formattedValue + ' ' + sizes[i];
}