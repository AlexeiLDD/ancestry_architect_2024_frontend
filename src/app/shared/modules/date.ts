
export namespace DateModule{
    export function formatDate(date: string): string {
        return new Date(date).toLocaleDateString("en-GB");
    }
}