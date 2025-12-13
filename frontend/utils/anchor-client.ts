import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
// import { SnakeLaddersProgram } from "@/program_type"; // Assuming you have this or generated types
import IDL from "@/idl.json";
import { SnakeLaddersProgram } from "@/program_type";

// Program ID from your IDL or environment
export const PROGRAM_ID = new PublicKey("aASgAk1s5KbAMPsiLTkeuA3k1ebTammftXpsP96QB3T");

export const getProgram = (connection: Connection, wallet: any) => {
    const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
    });
    return new Program<SnakeLaddersProgram>(IDL as any, provider);
};

export const getGamePDA = (creator: PublicKey, gameId: number[]) => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("game"),
            creator.toBuffer(),
            Buffer.from(gameId),
        ],
        PROGRAM_ID
    );
};
