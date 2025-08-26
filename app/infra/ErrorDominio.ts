export class ErrorDominio extends Error {
    private problemas: string[] = [];

    public constructor( message?: string ) {
        super( message );
    }

    static comProblemas( problemas: string[] ): ErrorDominio {
        const e = new ErrorDominio();
        e.setProblemas( problemas );
        return e;
    }

    public setProblemas( problemas: string[] ) {
        this.problemas = problemas;
    }

    public getProblemas(): string[] {
        return this.problemas;
    }
}